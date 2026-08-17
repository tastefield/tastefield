import type { Method, MethodLock } from "../schema/index.js";
export interface LockMethodResult {
    method: Method;
    lock: MethodLock;
    lockPath: string;
    methodPath: string;
}
export declare function resolveMethodPath(fieldRoot: string, nameOrPath: string): string;
/** Validate a Method and lock participating Skill versions. */
export declare function lockMethod(fieldRoot: string, nameOrPath: string): LockMethodResult;
//# sourceMappingURL=index.d.ts.map