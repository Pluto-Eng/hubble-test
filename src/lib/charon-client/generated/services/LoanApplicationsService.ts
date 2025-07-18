/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoanApplication } from '../models/LoanApplication';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoanApplicationsService {
    /**
     * Retrieve all loan applications for a specific account
     * Fetches a list of all loan applications associated with the given account ID. Supports pagination, sorting, and field selection.
     * @param accountId The ID of the account to retrieve loan applications for.
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of loan applications.
     * @throws ApiError
     */
    public static getAccountsLoanApplications(
        accountId: string,
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<LoanApplication>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications',
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
     * Create a new loan application for an account
     * Adds a new loan application associated with a specific account. The account ID is taken from the path.
     * @param accountId The ID of the account to associate the loan application with.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan application created successfully.
     * @throws ApiError
     */
    public static postAccountsLoanApplications(
        accountId: string,
        requestBody: LoanApplication,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanApplication;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts/{accountId}/loan-applications',
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
     * Retrieve a specific loan application by ID
     * Fetches details for a single loan application.
     * @param accountId The ID of the account.
     * @param id The ID of the loan application to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved loan application details.
     * @throws ApiError
     */
    public static getAccountsLoanApplications1(
        accountId: string,
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanApplication;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{id}',
            path: {
                'accountId': accountId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `Loan application not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing loan application
     * Modifies fields of an existing loan application.
     * @param accountId The ID of the account.
     * @param id The ID of the loan application to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan application updated successfully.
     * @throws ApiError
     */
    public static patchAccountsLoanApplications(
        accountId: string,
        id: string,
        requestBody: LoanApplication,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanApplication;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{accountId}/loan-applications/{id}',
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
                404: `Loan application not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a loan application
     * Removes a loan application from the system.
     * @param accountId The ID of the account.
     * @param id The ID of the loan application to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccountsLoanApplications(
        accountId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{accountId}/loan-applications/{id}',
            path: {
                'accountId': accountId,
                'id': id,
            },
            errors: {
                404: `Loan application not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
