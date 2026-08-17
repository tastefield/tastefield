import type { Field } from "../schema/index.js";
export interface InitFieldOptions {
    dir: string;
    name?: string;
    id?: string;
    force?: boolean;
}
export declare function initField(opts: InitFieldOptions): Field;
export declare function readField(fieldRoot: string): Field;
export declare function addSkillRef(fieldRoot: string, ref: {
    name: string;
    path: string;
    version?: string;
    origin?: string;
}): Field;
export declare function addSource(fieldRoot: string, sourcePath: string): Field;
//# sourceMappingURL=index.d.ts.map