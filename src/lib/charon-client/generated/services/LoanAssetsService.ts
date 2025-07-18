/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoanAsset } from '../models/LoanAsset';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoanAssetsService {
    /**
     * Retrieve all loan assets for a loan application
     * Fetches a list of all loan assets associated with a specific loan application. Supports pagination, sorting, and field selection.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of loan assets.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsAssets(
        accountId: string,
        loanApplicationId: string,
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<LoanAsset>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/assets',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
            },
            query: {
                'pLimit': pLimit,
                'pOffset': pOffset,
                'pOrder': pOrder,
                'pFields': pFields,
            },
            errors: {
                400: `Bad Request - Invalid query parameters`,
                404: `Loan application not found.`,
                422: `Unprocessable Entity - Validation error on query parameters`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a new loan asset for a loan application
     * Adds a new loan asset associated with a specific loan application. The loan application ID is taken from the path.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan asset created successfully.
     * @throws ApiError
     */
    public static postAccountsLoanApplicationsAssets(
        accountId: string,
        loanApplicationId: string,
        requestBody: LoanAsset,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanAsset;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/assets',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data or missing loan application ID`,
                404: `Loan application not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve a specific loan asset by ID
     * Fetches details for a single loan asset.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan asset to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved loan asset details.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsAssets1(
        accountId: string,
        loanApplicationId: string,
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanAsset;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/assets/{id}',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `Loan asset not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing loan asset
     * Modifies fields of an existing loan asset.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan asset to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan asset updated successfully.
     * @throws ApiError
     */
    public static patchAccountsLoanApplicationsAssets(
        accountId: string,
        loanApplicationId: string,
        id: string,
        requestBody: {
            /**
             * Fund name or identifier
             */
            fund?: string;
            /**
             * Investor name or identifier
             */
            investor?: string;
            /**
             * Contact phone number
             */
            phone?: string;
            /**
             * Total number of units
             */
            units?: number;
            /**
             * Value per unit
             */
            unitValue?: number;
        },
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanAsset;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/assets/{id}',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `Loan asset not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a loan asset
     * Removes a loan asset from the system.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan asset to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccountsLoanApplicationsAssets(
        accountId: string,
        loanApplicationId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/assets/{id}',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
                'id': id,
            },
            errors: {
                404: `Loan asset not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
