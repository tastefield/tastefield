import type { CuratedSkill } from "./types.js";
import { SkillsClient } from "./client.js";
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
export declare const CURATED: CuratedSkill[];
export declare const SEED_META: {
    generatedFrom: string;
    verifiedAt: string;
};
export declare function byCategory(category: CuratedSkill["category"]): CuratedSkill[];
export declare function byRecipe(recipe: string): CuratedSkill[];
export declare function findSkill(idOrSlug: string): CuratedSkill | undefined;
export declare function recipes(): Array<{
    name: string;
    skills: CuratedSkill[];
}>;
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
export declare function hydrateInstalls(client?: SkillsClient, skills?: CuratedSkill[]): Promise<{
    skills: CuratedSkill[];
    hydrated: number;
    error?: string;
}>;
/** Format an install count for display. Null renders as an em dash, never 0. */
export declare function formatInstalls(installs: number | null): string;
