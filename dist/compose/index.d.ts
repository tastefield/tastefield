import type { Composition, CompositionLock } from "../schema/index.js";
export interface ComposeResult {
    composition: Composition;
    lock: CompositionLock;
    lockPath: string;
    compositionPath: string;
}
export declare function resolveCompositionPath(fieldRoot: string, nameOrPath: string): string;
export declare function composeComposition(fieldRoot: string, nameOrPath: string): ComposeResult;
//# sourceMappingURL=index.d.ts.map