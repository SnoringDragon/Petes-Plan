const deepmerge = require('deepmerge');

module.exports = class BaseService {
    /**
     * @param {RequestInit & {baseUrl: string}} options fetch and base url options, see node-fetch documentation for options
     * @param options.baseUrl base URL for self service webpage
     */
    constructor(options) {
        const { baseUrl, ...opts } = options;
        this._options = opts;
        this._baseUrl = baseUrl;
        // dynamic import es module
        this._fetchFunc = import('node-fetch');
    }

    /**
     * Fetch with options
     *
     * @param {string} url
     * @param {RequestInit} opts
     * @returns {Promise<Response>}
     * @protected
     */
    async _fetch(url, opts = {}) {
        const response = await (await this._fetchFunc).default(`${this._baseUrl}/${url}`,
            deepmerge(this._options, opts)); // merge default options with override options

        // failed response (4xx, 5xx)
        if (!response.ok) {
            const err = new Error(`HTTP status code ${response.status}`);
            err.response = response;
            err.status = response.status;
            throw err;
        }

        return response;
    }
}
