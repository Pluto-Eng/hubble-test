/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

export class AbortError extends Error {
    constructor(options: ApiRequestOptions) {
        super(`Request aborted: ${options.method} ${options.url}`);
        this.name = 'AbortError';
    }
}