import { SkillsClient } from "./client.js";
import { scoreRelevance } from "./discover.js";
import { classifyMomentum, mergeViews } from "./momentum.js";
import { buildSnapshot, diffSnapshots, loadLatestSnapshot, listSnapshotVersions, renderChangelog, writeSnapshot, } from "./snapshot.js";
const PER_PAGE = 500;
async function sweepView(client, view, depth, errors) {
    const out = [];
    const pages = Math.ceil(depth / PER_PAGE);
    for (let page = 0; page < pages; page++) {
        try {
            const res = await client.listSkills({ view, page, perPage: PER_PAGE });
            out.push(...res.data);
            if (!res.pagination.hasMore)
                break;
        }
        catch (err) {
            errors.push(`${view} page ${page}: ${err instanceof Error ? err.message : String(err)}`);
            // Stop this view but let the others proceed — a partial sweep is still
            // useful, and the snapshot records its own depth.
            break;
        }
    }
    return out.slice(0, depth);
}
export async function ingest(options = {}) {
    const { depth = 5000, minScore = 30, client = new SkillsClient(), root = process.cwd(), dryRun = false, } = options;
    const errors = [];
    const allTime = await sweepView(client, "all-time", depth, errors);
    // Trending and hot windows are much shallower — past a few hundred the
    // numbers collapse into single-install noise.
    const trending = await sweepView(client, "trending", 1000, errors);
    const hot = await sweepView(client, "hot", 500, errors);
    const merged = mergeViews(allTime, trending, hot);
    const previous = await loadLatestSnapshot(root);
    const prevById = new Map((previous?.entries ?? []).map((e) => [e.id, e]));
    const scored = merged
        .map((skill) => {
        const relevance = scoreRelevance({
            name: skill.name,
            slug: skill.slug,
            source: skill.source,
            topics: [],
        });
        const before = prevById.get(skill.id);
        const momentum = classifyMomentum({
            installs: skill.installs,
            allTimeRank: skill.allTimeRank,
            trendingRank: skill.trendingRank,
            trendingInstalls: skill.trendingInstalls,
            hotRank: skill.hotRank,
            hotChange: skill.hotChange,
            previousInstalls: before?.installs ?? null,
            seenBefore: Boolean(before),
        });
        return { ...skill, relevance, momentum };
    })
        .filter((s) => s.relevance.score >= minScore)
        .sort((a, b) => b.relevance.score - a.relevance.score ||
        b.momentum.score - a.momentum.score ||
        b.installs - a.installs);
    const existingVersions = await listSnapshotVersions(root);
    const snapshot = buildSnapshot(scored, {
        sweepDepth: depth,
        existingVersions,
    });
    const diff = diffSnapshots(previous, snapshot);
    const changelog = renderChangelog(diff, snapshot);
    let written = null;
    // A no-op run produces an identical hash; writing it would add a commit that
    // says nothing and train reviewers to ignore these PRs.
    if (!dryRun && !diff.noop) {
        written = await writeSnapshot(root, snapshot);
    }
    const byMomentum = {};
    const byVerdict = {};
    for (const s of scored) {
        byMomentum[s.momentum.state] = (byMomentum[s.momentum.state] ?? 0) + 1;
        byVerdict[s.relevance.verdict] = (byVerdict[s.relevance.verdict] ?? 0) + 1;
    }
    return {
        snapshot,
        diff,
        changelog,
        written,
        stats: {
            swept: merged.length,
            designRelevant: scored.length,
            byMomentum,
            byVerdict,
        },
        errors,
    };
}
//# sourceMappingURL=ingest.js.map