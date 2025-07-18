/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Loan } from '../models/Loan';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoansService {
    /**
     * Retrieve all loans for a specific account
     * Fetches a list of all loans associated with the given account ID. Supports pagination, sorting, and field selection.
     * @param accountId The ID of the account to retrieve loans for.
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of loans.
     * @throws ApiError
     */
    public static getAccountsLoans(
        accountId: string,
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<Loan>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loans',
            path: {
                'accountId': accountId,
            },
            query: {
                'pLimit': pLimit,
                'pOffset': pOffset,
                'pOrder': pOrder,
                'pFields': pFields,
            },
            errors: {
                400: `Bad Request - Invalid query parameters`,
                404: `Account not found.`,
                422: `Unprocessable Entity - Validation error on query parameters`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a new loan for an account
     * Adds a new loan associated with a specific account. The account ID is taken from the path.
     * @param accountId The ID of the account to associate the loan with.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan created successfully.
     * @throws ApiError
     */
    public static postAccountsLoans(
        accountId: string,
        requestBody: Loan,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Loan;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts/{accountId}/loans',
            path: {
                'accountId': accountId,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data or missing accountId`,
                404: `Account not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve a specific loan by ID
     * Fetches details for a single loan.
     * @param accountId The ID of the account.
     * @param id The ID of the loan to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved loan details.
     * @throws ApiError
     */
    public static getAccountsLoans1(
        accountId: string,
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Loan;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loans/{id}',
            path: {
                'accountId': accountId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `Loan not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing loan
     * Modifies fields of an existing loan.
     * @param accountId The ID of the account.
     * @param id The ID of the loan to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan updated successfully.
     * @throws ApiError
     */
    public static patchAccountsLoans(
        accountId: string,
        id: string,
        requestBody: Loan,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Loan;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{accountId}/loans/{id}',
            path: {
                'accountId': accountId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `Loan not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a loan
     * Removes a loan from the system.
     * @param accountId The ID of the account.
     * @param id The ID of the loan to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccountsLoans(
        accountId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{accountId}/loans/{id}',
            path: {
                'accountId': accountId,
                'id': id,
            },
            errors: {
                404: `Loan not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
