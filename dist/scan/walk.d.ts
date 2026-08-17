export interface WalkOptions {
    /** File extensions to return, including the dot. */
    extensions: string[];
    /** Hard cap so a scan of a huge monorepo can't hang the CLI. */
    maxFiles?: number;
}
/**
 * Depth-first file walk that skips build output and vendor directories.
 * Returns absolute paths.
 */
export declare function walk(root: string, options: WalkOptions): Promise<string[]>;
export declare function exists(p: string): Promise<boolean>;
