import { AxiosResponse, default as axios, Method } from "axios";
const BASE_URL = "https://b2b.revolut.com";

export class RevolutClient {
    private token: string;
    private axios = axios.create();

    /**
     * Set the b2b revolut api key.
     *
     * @param {string} token
     */
    public setApiKey(token: string): this {
        this.token = token;
        return this;
    }

    /**
     * Return list of accounts.
     */
    public getAccounts(): Promise<any> {
        return this.request("/api/1.0/accounts");
    }

    /**
     * Return list of transactions.
     * @param {number} limit
     */
    public async getTransactions(limit: number = 1000): Promise<any> {
        return this.request(`/api/1.0/transactions?count=${limit}`);
    }

    /**
     * Helper to create promise with call to an endpoint.
     *
     * @param {string} endpoint
     * @param {string} method = get
     * @param {*} data
     */
    private request(endpoint: string, method: Method = "get", data?: any): Promise<any> {
        const headers: any = {
            "Content-Type": "application/json",
        };
        this.axios.defaults.headers.common = {};
        if (this.token) {
            headers.Authorization = "Bearer " + this.token;
        }
        return new Promise((resolve, reject) => {
            this.axios({
                data,
                headers,
                maxRedirects: 0,
                method,
                url: BASE_URL + endpoint,
            })
                .then((result) => this.handleResponse(result, resolve, reject))
                .catch((err) => reject(err));
        });
    }

    /**
     * Calls rejecter when response has invalid status, calls resolver(data) if status is valid.
     *
     * @param {*} data
     * @param {*} response
     * @param {*} resolver
     * @param {*} rejecter
     */
    private async handleResponse(
        result: AxiosResponse,
        resolver: (data: any) => void,
        rejecter: (error: Error) => void,
    ): Promise<any> {
        if (result.status === 302) {
            // manually redirect (w/o headers) to avoid problems an S3 when multiple Auth params are send.
            // tslint:disable-next-line:no-string-literal
            return this.axios({ method: "get", url: result.headers.location })
                .then((redirectedResult) => this.handleResponse(redirectedResult, resolver, rejecter))
                .catch((err) => rejecter(err));
        }
        if (result.status < 200 || result.status > 299) {
            // tslint:disable-next-line:no-console
            console.debug(result);
            rejecter(new Error(result.statusText));
        }
        resolver(result.data);
    }
}
