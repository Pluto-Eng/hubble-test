/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoanIncome } from '../models/LoanIncome';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoanIncomesService {
    /**
     * Retrieve all loan incomes for a loan application
     * Fetches a list of all income sources associated with a specific loan application. Supports pagination, sorting, and field selection.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of loan incomes.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsIncomes(
        accountId: string,
        loanApplicationId: string,
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<LoanIncome>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/incomes',
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
     * Create a new loan income for a loan application
     * Adds a new income source associated with a specific loan application. The loan application ID is taken from the path.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan income created successfully.
     * @throws ApiError
     */
    public static postAccountsLoanApplicationsIncomes(
        accountId: string,
        loanApplicationId: string,
        requestBody: LoanIncome,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanIncome;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/incomes',
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
     * Retrieve a specific loan income by ID
     * Fetches details for a single loan income.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan income to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved loan income details.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsIncomes1(
        accountId: string,
        loanApplicationId: string,
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanIncome;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/incomes/{id}',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `Loan income not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing loan income
     * Modifies fields of an existing loan income.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan income to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any Loan income updated successfully.
     * @throws ApiError
     */
    public static patchAccountsLoanApplicationsIncomes(
        accountId: string,
        loanApplicationId: string,
        id: string,
        requestBody: {
            /**
             * Income source name or description
             */
            name?: string;
            /**
             * Income amount
             */
            amount?: number;
            /**
             * Currency of the income amount
             */
            currency?: string;
            /**
             * The year this income applies to
             */
            year?: number;
            /**
             * The period frequency of this income
             */
            period?: string;
        },
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: LoanIncome;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/incomes/{id}',
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
                404: `Loan income not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a loan income
     * Removes a loan income from the system.
     * @param accountId The ID of the account
     * @param loanApplicationId The ID of the loan application
     * @param id The ID of the loan income to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccountsLoanApplicationsIncomes(
        accountId: string,
        loanApplicationId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{accountId}/loan-applications/{loanApplicationId}/incomes/{id}',
            path: {
                'accountId': accountId,
                'loanApplicationId': loanApplicationId,
                'id': id,
            },
            errors: {
                404: `Loan income not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
