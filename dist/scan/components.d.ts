import type { ComponentContract } from "../types.js";
export declare function scanComponents(repoRoot: string, alias: string | null): Promise<{
    components: ComponentContract[];
    hasShadcn: boolean;
}>;
