import type { DiscoveredSkill } from "../schema/index.js";
export type AgentOrigin = DiscoveredSkill["origin"];
export interface DiscoverOptions {
    cwd?: string;
    home?: string;
    extraRoots?: string[];
    includeLocalFieldSkills?: boolean;
    fieldPath?: string;
}
interface RootSpec {
    origin: AgentOrigin;
    path: string;
}
/** Known Skill discovery roots for Cursor, Claude, Codex, and Agents. */
export declare function defaultSkillRoots(opts?: DiscoverOptions): RootSpec[];
export declare function discoverSkills(opts?: DiscoverOptions): DiscoveredSkill[];
export declare function formatSkillTable(skills: DiscoveredSkill[]): string;
export {};
//# sourceMappingURL=index.d.ts.map