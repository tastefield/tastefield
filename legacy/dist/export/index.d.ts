import type { Method } from "../schema/index.js";
export type ExportTarget = "cursor" | "codex" | "claude" | "generic";
export interface ExportOptions {
    fieldRoot: string;
    method: string;
    outDir: string;
    target?: ExportTarget;
}
export interface ExportResult {
    outDir: string;
    skillMdPath: string;
    method: Method;
}
export declare function exportMethod(opts: ExportOptions): ExportResult;
export declare function defaultExportDir(fieldRoot: string, methodId: string, target: ExportTarget): string;
export declare function suggestInstallPath(methodId: string, target: ExportTarget): string;
export declare function exportLabel(outDir: string): string;
//# sourceMappingURL=index.d.ts.map