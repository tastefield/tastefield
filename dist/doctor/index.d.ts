import type { Method, DiscoveredSkill } from "../schema/index.js";
export type DoctorSeverity = "error" | "warning" | "info";
export interface DoctorFinding {
    severity: DoctorSeverity;
    code: string;
    message: string;
    path?: string;
}
export interface DoctorReport {
    ok: boolean;
    findings: DoctorFinding[];
}
export declare function doctorField(fieldRoot: string, discovered?: DiscoveredSkill[]): DoctorReport;
export declare function doctorMethod(fieldRoot: string, method: Method, pathHint?: string): DoctorFinding[];
export declare function doctorMethodByName(fieldRoot: string, nameOrPath: string): DoctorReport;
export declare function formatDoctorReport(report: DoctorReport): string;
//# sourceMappingURL=index.d.ts.map