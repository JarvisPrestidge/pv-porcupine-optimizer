/**
 * Represents top level structure of github contents api
 *
 * @export
 * @interface IGithubContent
 */
export interface IGithubContent {
    name:         string;
    path:         string;
    sha:          string;
    size:         number;
    url:          string;
    html_url:     string;
    git_url:      string;
    download_url: string;
    type:         string;
    _links:       IGithubContentLinks;
}

interface IGithubContentLinks {
    self: string;
    git:  string;
    html: string;
}
