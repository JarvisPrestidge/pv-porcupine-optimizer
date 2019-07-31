import * as os from "os";
import C from "./constants";
import { chmod, mkdir } from "fs";
import { join } from "path";
import { osTypeToPlatformMap, platformToArchMap } from "./utils/filesystem";
import { promisify } from "util";
import { Github } from "./services/github";
import { downloadAndWriteFile } from "./utils/download";

const mkdirAsync = promisify(mkdir);
const chmodAsync = promisify(chmod);

(async () => {

    const osType = os.type();

    const platform = osTypeToPlatformMap.get(osType);
    if (!platform) {
        throw new Error("Unsupported platform");
    }

    const arch = platformToArchMap.get(platform);
    if (!arch) {
        throw new Error("Unsupported cpu architecture");
    }

    const binaryLocalDir = join(C.PROJECT_ROOT_PATH, "optimizer");
    const binaryRemoteDir = `tools/optimizer/${platform}/${arch}`;

    try {
        await mkdirAsync(binaryLocalDir, { recursive: true });
        const binaryContent = await Github.getContents(binaryRemoteDir);
        await Promise.all(binaryContent.map((c) => downloadAndWriteFile(c.download_url, join(binaryLocalDir, c.name))));
        await Promise.all(binaryContent.map((c) => chmodAsync(join(binaryLocalDir, c.name), 0o775)));
    } catch (error) {
        console.error(`Failed to download porcupine optimizer binary: ${error.message}`);
        process.exit(1);
    }

    const resourcesLocalDir = join(C.PROJECT_ROOT_PATH, "optimizer", "resources");;
    const resourcesRemoteDir = "resources/optimizer_data";

    try {
        await mkdirAsync(resourcesLocalDir, { recursive: true });
        const resourcesContent = await Github.getContents(resourcesRemoteDir);
        await Promise.all(resourcesContent.map((c) => downloadAndWriteFile(c.download_url, join(resourcesLocalDir, c.name))));
        await Promise.all(resourcesContent.map((c) => chmodAsync(join(resourcesLocalDir, c.name), 0o755)));
    } catch (error) {
        console.error(`Failed to download porcupine optimizer resource data: ${error.message}`);
        process.exit(1);
    }

    process.exit(0);
})();

