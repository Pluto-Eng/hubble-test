/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { AbortError } from './AbortError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import { BaseHttpRequest } from './BaseHttpRequest';
import { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import { ApiError } from './ApiError';

export class FetchHttpRequest extends BaseHttpRequest {

    constructor(config: OpenAPIConfig) {
        super(config);
    }

    /**
     * Request method
     * @param options The request options from the service
     * @returns CancelablePromise<T>
     * @throws ApiError
     */
    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        return new CancelablePromise(async (resolve, reject, onCancel) => {
            try {
                const url = this.getUrl(options);
                const controller = new AbortController();

                onCancel(() => {
                    controller.abort();
                });

                const requestBodyParams = await this.getRequestBody(options);

                fetch(url, {
                    ...requestBodyParams,
                    signal: controller.signal,
                })
                    .then(response => {
                        if (!response.ok) {
                            reject(new ApiError(options, response, this.getErrorMessage(response)));
                        }
                        return response;
                    })
                    .then(response => {
                        if (response.status === 204) {
                            return undefined as T;
                        }
                        if (response.headers.get('Content-Type')?.includes('application/json')) {
                            return response.json();
                        }
                        return response.text();
                    })
                    .then(resolve)
                    .catch(error => {
                        if (error.name === 'AbortError') {
                            reject(new AbortError(options));
                        } else {
                            reject(error);
                        }
                    });
            } catch (error) {
                reject(error);
            }
        });
    }
}