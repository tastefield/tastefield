/**
 * The benchmark task set.
 *
 * These are the prompts an agent is asked to complete, twice: once with the
 * Tastefield MCP server connected, once without. Both outputs are scored by the
 * same rule checker that ships in the product.
 *
 * Keep prompts phrased the way a developer would actually type them — vague and
 * unhelpful. A prompt that spells out the design system would measure the prompt,
 * not the governance layer.
 */
export interface BenchTask {
    id: string;
    prompt: string;
    /** What a correct answer has to get right, for manual review of edge cases. */
    notes: string;
}
export declare const TASKS: BenchTask[];
