
/**
 * Represents a line of output from optimizer tool
 *
 * @interface IOptimizerOutputLine
 */
export interface IOptimizerOutputLine {
    level: string;
    description: string;
    value?: string;
}
