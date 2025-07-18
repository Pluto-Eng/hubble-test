/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Retrieve a list of users
     * Fetches a list of all users. Supports filtering, pagination, sorting, and field selection.
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of users.
     * @throws ApiError
     */
    public static getAdminUsers(
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<User>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
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
     * Create a new user
     * Adds a new user to the system.
     * @param requestBody
     * @returns any User created successfully.
     * @throws ApiError
     */
    public static postAdminUsers(
        requestBody: User,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users',
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
     * Retrieve a specific user by ID
     * Fetches details for a single user by their ID.
     * @param id The ID of the user to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved user details.
     * @throws ApiError
     */
    public static getAdminUsers1(
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{id}',
            path: {
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `User not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing user
     * Modifies fields of an existing user.
     * @param id The ID of the user to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any User updated successfully.
     * @throws ApiError
     */
    public static patchAdminUsers(
        id: string,
        requestBody: User,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/users/{id}',
            path: {
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `User not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a user
     * Removes a user from the system.
     * @param id The ID of the user to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAdminUsers(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
