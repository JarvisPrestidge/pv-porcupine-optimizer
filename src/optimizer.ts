import * as os from "os";
import C from "./constants";
import { access, constants } from "fs";
import { exec } from "child_process";
import { IOptimizerOutputLine } from "./interfaces/IOptimizerOutputLine";
import { join } from "path";
import { osTypeToPlatformMap, Platform } from "./utils/filesystem";
import { promisify } from "util";

const execAsync = promisify(exec);
const accessAsync = promisify(access);

export type OptimizerResult =
    | {
        success: true,
        path: string,
    }
    | {
        success: false,
        errors: string[]
    };

/**
 * Responsible for handling interaction Picovoice Porcupine optimizer tool
 *
 * @export
 * @class Optimizer
 */
export class Optimizer {

    private readonly platform: Platform;
    private readonly binaryName: string;
    private readonly binaryPath: string;

    /**
     * Creates an instance of Optimizer.
     */
    constructor() {
        const osType = os.type();
        const platform = osTypeToPlatformMap.get(osType);
        if (!platform) {
            throw new Error("Unsupported platform");
        }
        this.platform = platform;
        this.binaryName = platform === "windows" ? `${C.BINARY_NAME}.exe` : C.BINARY_NAME;
        this.binaryPath = join(C.OPTIMIZER_ROOT_PATH, this.binaryName);
    }

    /**
     * Convert the optimizer stdout text to a structured object
     *
     * @private
     * @param {string} input
     * @returns {IOptimizerOutputLine}
     */
    private transformOptimizerOutput = (input: string): IOptimizerOutputLine => {

        const removeAnsiColorCodesRegExp = /\u001b\[\d+m/gi;
        const cleanedInput = input.replace(removeAnsiColorCodesRegExp, "").trim();

        const extractRegExp = /\[(?<level>INFO|WARN|ERROR)\] (?<description>.*?)(?:$|')(?:(?<value>.*)')?/i;
        const match = cleanedInput.match(extractRegExp);
        if (!match || !match.groups) {
            throw new Error("unknown optimizer stdout line formatting");
        }

        const { level, description, value } = match.groups;

        return {
            level,
            description,
            ...(value && { value })
        };
    };

    /**
     * Convert sophisticated error message to human readable summary
     *
     * @private
     * @param {string} input
     * @returns {string}
     */
    private humanizeErrors = (input: string): string => {

        const humanizeErrorTupleList: [RegExp, string][] = [
            [/wake phrase is too long/i, "wake word too long"],
            [/wake phrase is too short/i, "wake word too short"],
            [/could not find the pronunciation for/i, "wake word too complex"]
        ];

        const humanizedError = humanizeErrorTupleList
            .map((t) => t[0].test(input) ? t[1] : undefined)
            .find((t) => t);

        return humanizedError ? humanizedError : input;
    };


    /**
     * Handles creation of wakeword
     *
     * @param {string} phrase
     * @returns {Promise<OptimizerResult>}
     */
    public async createWakeWord(phrase: string): Promise<OptimizerResult> {

        try {
            await accessAsync(this.binaryPath, constants.F_OK | constants.R_OK | constants.R_OK);
        } catch (error) {
            throw new Error(`Cannot access optimizer binary: ${error.message}`);
        }

        const command = `${this.binaryPath} -r ${C.OPTIMIZER_RESOURCES_PATH} -w "${phrase}" -p ${this.platform} -o ${C.KEYWORDS_ROOT_PATH}`;
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            throw new Error(`Optimzer tool failed with fatal error: ${stderr}`);
        }

        const benignWarnings: RegExp[] = [
            /This keyword file is only intended for non-commercial use/i
        ];

        const lines = stdout
            .trim()
            .split("\n")
            .filter((l) => !benignWarnings.some((re) => re.test(l)))
            .map(this.transformOptimizerOutput);

        const outputInfo = lines.filter((o) => o.level === "INFO");
        const successInfo = outputInfo.find((l) => /created keyword file at/.test(l.description));
        if (successInfo && successInfo.value) {
            return {
                success: true,
                path: successInfo.value
            };
        }

        const outputError = lines.filter((o) => o.level === "ERROR");
        const errorInfo = outputError.map((l) => l.description);
        const humanizedErrors = errorInfo.map(this.humanizeErrors);
        return {
            success: false,
            errors: humanizedErrors
        };
    }
}
