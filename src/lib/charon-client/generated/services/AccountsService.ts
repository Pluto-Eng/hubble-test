/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from '../models/Account';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountsService {
    /**
     * Retrieve a list of accounts
     * Fetches a list of all accounts. Supports filtering, pagination, sorting, and field selection.
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of accounts.
     * @throws ApiError
     */
    public static getAccounts(
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<Account>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts',
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
     * Create a new account
     * Adds a new account to the system.
     * @param requestBody
     * @returns any Account created successfully.
     * @throws ApiError
     */
    public static postAccounts(
        requestBody: Account,
    ): CancelablePromise<(SuccessResponse & {
        data?: Account;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts',
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
     * Retrieve a specific account by ID
     * Fetches details for a single account.
     * @param accountId The ID of the account to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved account details.
     * @throws ApiError
     */
    public static getAccounts1(
        accountId: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Account;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{id}',
            path: {
                'accountId': accountId,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                401: `Access token is missing or invalid`,
                404: `Account not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing account
     * Modifies fields of an existing account.
     * @param accountId The ID of the account to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Account updated successfully.
     * @throws ApiError
     */
    public static patchAccounts(
        accountId: string,
        requestBody: Account,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Account;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{id}',
            path: {
                'accountId': accountId,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `Account not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete an account
     * Removes an account from the system.
     * @param accountId The ID of the account to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccounts(
        accountId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{id}',
            path: {
                'accountId': accountId,
            },
            errors: {
                404: `Account not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
