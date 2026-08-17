import { createRequire } from "node:module";
import { SkillsClient, SkillsApiError } from "./client.js";
const require = createRequire(import.meta.url);
const seed = require("./seed.json");
/**
 * The curated set.
 *
 * Deliberately small. skills.sh indexes 600k+ skills and has Vercel's
 * distribution behind it; competing on catalogue size is unwinnable and beside
 * the point. What isn't replicable is the editorial layer — a categorised,
 * argued-for set that composes into recipes — plus what happens after import:
 * bundling, and serving over MCP with progressive disclosure instead of dumping
 * every installed skill into the context window at once.
 */
export const CURATED = seed.skills;
export const SEED_META = {
    generatedFrom: seed.generatedFrom,
    verifiedAt: seed.verifiedAt,
};
export function byCategory(category) {
    return CURATED.filter((s) => s.category === category);
}
export function byRecipe(recipe) {
    return CURATED.filter((s) => s.recipes.includes(recipe));
}
export function findSkill(idOrSlug) {
    return CURATED.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}
export function recipes() {
    const names = new Set(CURATED.flatMap((s) => s.recipes));
    return [...names].sort().map((name) => ({ name, skills: byRecipe(name) }));
}
/**
 * Refresh install counts from the live API.
 *
 * Seed entries ship with `installs: null` wherever a figure wasn't verified.
 * Null is rendered as "—" rather than 0 so an unknown is never mistaken for a
 * real measurement.
 *
 * Never throws: if the API is unreachable or unauthenticated, the curated set
 * still renders from seed data. Degrading rather than failing is the entire
 * reason the seed exists.
 */
export async function hydrateInstalls(client = new SkillsClient(), skills = CURATED) {
    const wanted = new Map(skills.map((s) => [s.id, s]));
    const counts = new Map();
    try {
        // One paginated sweep of the leaderboard is far cheaper than N detail calls
        // and stays well inside the 600 req/min budget.
        for (let page = 0; page < 8; page++) {
            const res = await client.listSkills({ perPage: 500, page });
            for (const skill of res.data) {
                if (wanted.has(skill.id))
                    counts.set(skill.id, skill.installs);
            }
            if (!res.pagination.hasMore)
                break;
            if (counts.size === wanted.size)
                break;
        }
        // Anything not on the leaderboard gets a targeted lookup.
        for (const [id] of wanted) {
            if (counts.has(id))
                continue;
            try {
                const detail = await client.getSkill(id);
                counts.set(id, detail.installs);
            }
            catch {
                // Leave as null — an unknown count is honest, a zero is misleading.
            }
        }
    }
    catch (err) {
        const message = err instanceof SkillsApiError ? err.message : String(err);
        return { skills, hydrated: 0, error: message };
    }
    const merged = skills.map((s) => counts.has(s.id) ? { ...s, installs: counts.get(s.id) } : s);
    return { skills: merged, hydrated: counts.size };
}
/** Format an install count for display. Null renders as an em dash, never 0. */
export function formatInstalls(installs) {
    if (installs === null)
        return "—";
    if (installs >= 1_000_000)
        return `${(installs / 1_000_000).toFixed(1)}M`;
    if (installs >= 1_000)
        return `${(installs / 1_000).toFixed(1)}K`;
    return String(installs);
}
//# sourceMappingURL=curate.js.map