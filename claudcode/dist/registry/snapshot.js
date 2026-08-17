import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
/**
 * Hash the parts of an entry that represent real content, deliberately
 * excluding rank and momentum. Ranks churn constantly; hashing them would make
 * every run look like a change and defeat no-op detection.
 */
export function hashEntries(entries) {
    const stable = entries
        .map((e) => `${e.id}:${e.installs}:${e.relevance.verdict}`)
        .sort()
        .join("\n");
    return createHash("sha256").update(stable).digest("hex");
}
export function buildSnapshot(skills, options) {
    const entries = skills.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        source: s.source,
        url: s.url,
        installs: s.installs,
        allTimeRank: s.allTimeRank,
        trendingRank: s.trendingRank,
        hotRank: s.hotRank,
        relevance: s.relevance,
        momentum: s.momentum,
    }));
    const takenAt = new Date().toISOString();
    const day = takenAt.slice(0, 10);
    // Multiple runs on one day get .1, .2, … so versions stay unique and sortable.
    const sameDay = (options.existingVersions ?? []).filter((v) => v.startsWith(day));
    const version = `${day}.${sameDay.length + 1}`;
    return {
        version,
        takenAt,
        registryTotal: options.registryTotal ?? null,
        sweepDepth: options.sweepDepth,
        contentHash: hashEntries(entries),
        entries,
    };
}
export function diffSnapshots(previous, current) {
    if (!previous) {
        return {
            from: null,
            to: current.version,
            added: current.entries,
            removed: [],
            momentumChanged: [],
            topGainers: [],
            decliners: [],
            noop: false,
        };
    }
    const prevById = new Map(previous.entries.map((e) => [e.id, e]));
    const currById = new Map(current.entries.map((e) => [e.id, e]));
    const added = current.entries.filter((e) => !prevById.has(e.id));
    const removed = previous.entries.filter((e) => !currById.has(e.id));
    const momentumChanged = [];
    const gains = [];
    const decliners = [];
    for (const entry of current.entries) {
        const before = prevById.get(entry.id);
        if (!before)
            continue;
        if (before.momentum.state !== entry.momentum.state) {
            momentumChanged.push({
                entry,
                was: before.momentum.state,
                now: entry.momentum.state,
            });
        }
        const delta = entry.installs - before.installs;
        if (delta > 0) {
            gains.push({
                entry,
                delta,
                growthPct: before.installs > 0
                    ? Number(((delta / before.installs) * 100).toFixed(2))
                    : null,
            });
        }
        else if (delta < 0) {
            decliners.push({ entry, delta });
        }
    }
    gains.sort((a, b) => b.delta - a.delta);
    decliners.sort((a, b) => a.delta - b.delta);
    return {
        from: previous.version,
        to: current.version,
        added,
        removed,
        momentumChanged,
        topGainers: gains.slice(0, 25),
        decliners: decliners.slice(0, 25),
        noop: previous.contentHash === current.contentHash,
    };
}
const SNAPSHOT_DIR = "registry/snapshots";
export async function listSnapshotVersions(root) {
    try {
        const files = await readdir(path.join(root, SNAPSHOT_DIR));
        return files
            .filter((f) => f.endsWith(".json"))
            .map((f) => f.replace(/\.json$/, ""))
            .sort();
    }
    catch {
        return [];
    }
}
export async function loadLatestSnapshot(root) {
    const versions = await listSnapshotVersions(root);
    const latest = versions.at(-1);
    if (!latest)
        return null;
    try {
        const raw = await readFile(path.join(root, SNAPSHOT_DIR, `${latest}.json`), "utf8");
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export async function writeSnapshot(root, snapshot) {
    const dir = path.join(root, SNAPSHOT_DIR);
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${snapshot.version}.json`);
    await writeFile(file, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    // latest.json is what the web app reads, so it never has to sort filenames.
    await writeFile(path.join(root, "registry", "latest.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    return file;
}
/** Render a diff as the body of a review PR. */
export function renderChangelog(diff, snapshot) {
    const lines = [];
    lines.push(`# Registry snapshot ${diff.to}`);
    lines.push("");
    lines.push(`Taken ${snapshot.takenAt} · swept top ${snapshot.sweepDepth.toLocaleString()} ` +
        `${snapshot.registryTotal ? `of ${snapshot.registryTotal.toLocaleString()} total` : ""}`);
    lines.push("");
    if (diff.noop) {
        lines.push("**No content changes.** Identical hash to the previous snapshot.");
        return lines.join("\n");
    }
    lines.push(`${diff.added.length} added · ${diff.removed.length} removed · ` +
        `${diff.momentumChanged.length} momentum changes`);
    lines.push("");
    if (diff.added.length) {
        lines.push("## New candidates");
        lines.push("");
        lines.push("| Skill | Source | Installs | Score | Momentum |");
        lines.push("| --- | --- | ---: | ---: | --- |");
        for (const e of diff.added.slice(0, 40)) {
            lines.push(`| [${e.slug}](${e.url}) | \`${e.source}\` | ${e.installs.toLocaleString()} | ${e.relevance.score} | ${e.momentum.state} |`);
        }
        if (diff.added.length > 40) {
            lines.push("");
            lines.push(`_…and ${diff.added.length - 40} more._`);
        }
        lines.push("");
    }
    if (diff.momentumChanged.length) {
        lines.push("## Momentum changes");
        lines.push("");
        for (const m of diff.momentumChanged.slice(0, 25)) {
            lines.push(`- **${m.entry.slug}** ${m.was} → ${m.now}`);
        }
        lines.push("");
    }
    if (diff.topGainers.length) {
        lines.push("## Top gainers");
        lines.push("");
        for (const g of diff.topGainers.slice(0, 15)) {
            lines.push(`- **${g.entry.slug}** +${g.delta.toLocaleString()}${g.growthPct != null ? ` (+${g.growthPct}%)` : ""}`);
        }
        lines.push("");
    }
    if (diff.removed.length) {
        lines.push("## Dropped out of the window");
        lines.push("");
        lines.push("_Falling out of the top-N sweep is not the same as being delisted._");
        lines.push("");
        for (const e of diff.removed.slice(0, 20)) {
            lines.push(`- ${e.slug} (\`${e.source}\`)`);
        }
        lines.push("");
    }
    if (diff.decliners.length) {
        lines.push("## Install count decreases");
        lines.push("");
        lines.push("_Usually a dedup or recount upstream, occasionally a delisting._");
        lines.push("");
        for (const d of diff.decliners.slice(0, 10)) {
            lines.push(`- ${d.entry.slug} ${d.delta.toLocaleString()}`);
        }
        lines.push("");
    }
    lines.push("---");
    lines.push("");
    lines.push("Curation is **not** automatic. This PR updates the observed snapshot only. " +
        "Category, status, rationale and recipe membership are assigned by hand before " +
        "anything reaches the published index.");
    return lines.join("\n");
}
//# sourceMappingURL=snapshot.js.map