/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Health check endpoint
     * Returns the health status of the API and its dependencies
     * @returns any Health check successful
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<(SuccessResponse & {
        data?: {
            database?: {
                status?: 'ok' | 'error';
                /**
                 * Error message if database is down
                 */
                error?: string;
            };
            /**
             * Server uptime in seconds
             */
            uptime?: number;
            /**
             * Current server timestamp
             */
            serverTime?: number;
        };
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
