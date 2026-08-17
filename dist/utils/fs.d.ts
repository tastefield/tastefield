import { type Method, type EvalsFile, type Field, type SkillFrontmatter } from "../schema/index.js";
export declare function readText(path: string): string;
export declare function parseFrontmatter(content: string): {
    data: Record<string, unknown>;
    content: string;
};
export declare function loadSkillFrontmatter(skillMdPath: string): SkillFrontmatter;
export declare function loadField(fieldPath: string): Field;
export declare function loadMethod(methodPath: string): Method;
export declare function loadEvals(evalsPath: string): EvalsFile;
export declare function writeYaml(value: unknown): string;
export declare function contentHash(content: string): string;
export declare function fileHash(path: string): string;
export declare function listSkillResources(skillDir: string): string[];
export declare function walkDirs(root: string, maxDepth?: number): string[];
export declare function findSkillMdFiles(root: string, maxDepth?: number): string[];
export declare function resolveFieldRoot(cwd: string, maybePath?: string): string;
export declare function packageRoot(): string;
export declare function templatesDir(): string;
export declare function rel(from: string, to: string): string;
//# sourceMappingURL=fs.d.ts.map