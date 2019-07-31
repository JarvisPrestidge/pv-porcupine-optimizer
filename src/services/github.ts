import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import C from "../constants";
import { IGithubContent } from "../interfaces/IGithubContent";

/**
 * Responsible for handling interaction with Github APIs
 *
 * @export
 * @class Github
 */
export class Github {

    /**
     * Fetch Github contents API response
     *
     * @param {string} path
     * @returns {Promise<IGithubContent[]>}
     */
    public static getContents = async (path: string): Promise<IGithubContent[]> => {

        const url = `${C.GITHUB_API_BASE}/repos/${C.OWNER}/${C.REPO}/contents/${path}`;

        const requestOptions: AxiosRequestConfig = {
            url,
            method: "GET"
        };

        let response: AxiosResponse<IGithubContent[]>;
        try {
            response = await axios(requestOptions);
        } catch (error) {
            throw error;
        }

        return response.data;
    };
}
