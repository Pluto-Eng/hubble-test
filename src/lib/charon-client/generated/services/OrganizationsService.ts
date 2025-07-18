/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationsService {
    /**
     * Retrieve a list of organizations
     * Fetches a list of all organizations. Supports filtering, pagination, sorting, and field selection.
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of organizations.
     * @throws ApiError
     */
    public static getOrganizations(
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<Organization>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations',
            query: {
                'pLimit': pLimit,
                'pOffset': pOffset,
                'pOrder': pOrder,
                'pFields': pFields,
            },
            errors: {
                400: `Bad Request - Invalid query parameters`,
                422: `Unprocessable Entity - Validation error on query parameters`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a new organization
     * Adds a new organization to the system.
     * @param requestBody
     * @returns any Organization created successfully.
     * @throws ApiError
     */
    public static postOrganizations(
        requestBody: Organization,
    ): CancelablePromise<(SuccessResponse & {
        data?: Organization;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve a specific organization
     * Fetches a single organization by its unique identifier.
     * @param id The unique identifier of the organization
     * @param pFields Comma-separated list of fields to return
     * @returns any Organization details.
     * @throws ApiError
     */
    public static getOrganizations1(
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Organization;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{id}',
            path: {
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `Organization not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a specific organization
     * Updates an existing organization by its unique identifier.
     * @param id The unique identifier of the organization
     * @param requestBody
     * @returns any Organization updated successfully.
     * @throws ApiError
     */
    public static putOrganizations(
        id: string,
        requestBody: Organization,
    ): CancelablePromise<(SuccessResponse & {
        data?: Organization;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `Organization not found`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a specific organization
     * Soft deletes an organization by its unique identifier.
     * @param id The unique identifier of the organization
     * @returns void
     * @throws ApiError
     */
    public static deleteOrganizations(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/organizations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Organization not found`,
                500: `Internal Server Error`,
            },
        });
    }
}
