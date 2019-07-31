import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { createWriteStream } from "fs";
import { Stream } from "stream";

/**
 * Download and write file to path
 *
 * @param {string} url
 * @param {string} path
 * @returns {Promise<void>}
 */
export const downloadAndWriteFile = async (url: string, path: string): Promise<void> => {

    const requestOptions: AxiosRequestConfig = {
        url,
        method: "GET",
        responseType: "stream"
    };

    let response: AxiosResponse<Stream>;
    try {
        response = await axios(requestOptions);
    } catch (error) {
        throw error;
    }

    const fileWriter = createWriteStream(path);

    response.data.pipe(fileWriter);

    return new Promise((resolve, reject) => {
        fileWriter.on("finish", resolve);
        fileWriter.on("error", reject);
    });
};
