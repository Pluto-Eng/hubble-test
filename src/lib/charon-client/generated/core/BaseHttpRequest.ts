/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export abstract class BaseHttpRequest {
    constructor(public readonly config: OpenAPIConfig) {}

    protected getUrl(options: ApiRequestOptions): string {
        // options.url is the path template, e.g., "/items/{itemId}"
        // options.path is an object for substitutions, e.g., { itemId: "123" }
        
        let processedPath = options.url; // Start with the URL template

        if (options.path) { // If there are path parameters to substitute
            const encoder = this.config.ENCODE_PATH || encodeURI;
            processedPath = options.url.replace(/{(.*?)}/g, (substring: string, group: string) => {
                if (options.path && options.path.hasOwnProperty(group)) {
                    // Ensure the value from options.path is a string before encoding
                    return encoder(String(options.path[group]));
                }
                return substring;
            });
        }
        
        // Now processedPath is the path string with substitutions done
        let url = `${this.config.BASE}${processedPath}`;

        if (options.query) {
            const query = Object.entries(options.query)
                .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
                .join('&');
            if (query) {
                url = `${url}?${query}`;
            }
        }
        return url;
    }

    protected async getRequestBody(options: ApiRequestOptions): Promise<Record<string, any>> {
        let resolvedHeaders = this.config.HEADERS;
        if (typeof this.config.HEADERS === 'function') {
            resolvedHeaders = await this.config.HEADERS(options);
        }

        const body: Record<string, any> = {
            method: options.method,
            headers: {
                Accept: 'application/json',
                ...((resolvedHeaders as Record<string, any>) || {}), // Cast and fallback
                ...options.headers,
            },
        };

        if (this.config.TOKEN) {
            const tokenValue = typeof this.config.TOKEN === 'function' 
                ? await this.config.TOKEN(options)
                : this.config.TOKEN;
            if (tokenValue) {
                body.headers['Authorization'] = `Bearer ${tokenValue}`;
            }
        }

        if (this.config.USERNAME && this.config.PASSWORD) {
            const usernameValue = typeof this.config.USERNAME === 'function'
                ? await this.config.USERNAME(options)
                : this.config.USERNAME;
            const passwordValue = typeof this.config.PASSWORD === 'function'
                ? await this.config.PASSWORD(options)
                : this.config.PASSWORD;
            
            if (usernameValue && passwordValue) {
                const credentials = btoa(`${usernameValue}:${passwordValue}`);
                body.headers['Authorization'] = `Basic ${credentials}`;
            }
        }
        
        if (this.config.WITH_CREDENTIALS) {
            body.credentials = this.config.CREDENTIALS ?? 'include';
        }

        if (options.body) {
            if (options.mediaType?.includes('/json')) {
                body.headers['Content-Type'] = options.mediaType;
                body.body = JSON.stringify(options.body);
            } else if (options.body instanceof FormData) {
                body.body = options.body;
            } else {
                body.headers['Content-Type'] = options.mediaType ?? 'text/plain';
                body.body = options.body;
            }
        }
        return body;
    }

    protected getErrorMessage(response: Response): string {
        return `API Error: ${response.status} ${response.statusText} - ${response.url}`;
    }

    public abstract request<T>(options: ApiRequestOptions): CancelablePromise<T>;
}