import { join } from "path";

/**
 * Project wide constants
 *
 * @class Constants
 */
class Constants {

    // Paths
    public static readonly PROJECT_ROOT_PATH = join(__dirname, "..");
    public static readonly KEYWORDS_ROOT_PATH = join(Constants.PROJECT_ROOT_PATH, "keywords");
    public static readonly OPTIMIZER_ROOT_PATH = join(Constants.PROJECT_ROOT_PATH, "optimizer");
    public static readonly OPTIMIZER_RESOURCES_PATH = join(Constants.OPTIMIZER_ROOT_PATH, "resources");

    // Values
    public static readonly REPO = "Porcupine";
    public static readonly OWNER = "Picovoice";
    public static readonly BINARY_NAME = "pv_porcupine_optimizer";
    public static readonly GITHUB_API_BASE = "https://api.github.com";
}

export default Constants;
