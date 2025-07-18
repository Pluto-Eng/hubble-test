/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileRef } from '../models/FileRef';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FilesService {
    /**
     * Retrieve all files for a documentable entity
     * Fetches a list of all file references associated with a loan application or other documentable entity. Supports pagination, sorting, and field selection.
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param pLimit Maximum number of items to return
     * @param pOffset Number of items to skip for pagination
     * @param pOrder Comma-separated list of fields to order by. Use '+' for ascending (default) and '-' for descending
     * @param pFields Comma-separated list of fields to return
     * @returns any A list of file references.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsFiles(
        accountId: string,
        documentableId: string,
        pLimit: number = 20,
        pOffset?: number,
        pOrder?: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: Array<FileRef>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
            },
            query: {
                'pLimit': pLimit,
                'pOffset': pOffset,
                'pOrder': pOrder,
                'pFields': pFields,
            },
            errors: {
                400: `Bad Request - Invalid query parameters`,
                404: `Entity not found.`,
                422: `Unprocessable Entity - Validation error on query parameters`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Upload a file for a loan application
     * Uploads a file and creates a file reference associated with a loan application. The file is stored in AWS S3.
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param formData
     * @param pFields Comma-separated list of fields to return
     * @returns any File uploaded successfully.
     * @throws ApiError
     */
    public static postAccountsLoanApplicationsFiles(
        accountId: string,
        documentableId: string,
        formData: {
            /**
             * The file to upload
             */
            document: Blob;
            /**
             * Type of document being uploaded
             */
            documentType?: string;
        },
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: FileRef;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
            },
            query: {
                'pFields': pFields,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request - Invalid file or missing parameters`,
                413: `Payload Too Large - File too large`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve a specific file by ID
     * Fetches details for a single file reference.
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param id The ID of the file to retrieve.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved file details.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsFiles1(
        accountId: string,
        documentableId: string,
        id: string,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: FileRef;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files/{id}',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            errors: {
                404: `File not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing file reference
     * Modifies fields of an existing file reference (metadata only, not the file content).
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param id The ID of the file to update.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any File reference updated successfully.
     * @throws ApiError
     */
    public static patchAccountsLoanApplicationsFiles(
        accountId: string,
        documentableId: string,
        id: string,
        requestBody: {
            /**
             * Type of document
             */
            documentType?: string;
            /**
             * File status
             */
            status?: 'pending' | 'approved' | 'rejected';
        },
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: FileRef;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files/{id}',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
                'id': id,
            },
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                404: `File not found.`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a file
     * Removes a file reference from the system (file content remains in S3).
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param id The ID of the file to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteAccountsLoanApplicationsFiles(
        accountId: string,
        documentableId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files/{id}',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
                'id': id,
            },
            errors: {
                404: `File not found.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Download a file
     * Downloads the actual file content from AWS S3.
     * @param accountId The ID of the account
     * @param documentableId The ID of the loan application or other documentable entity
     * @param id The ID of the file to download.
     * @returns binary File download successful.
     * @throws ApiError
     */
    public static getAccountsLoanApplicationsFilesDownload(
        accountId: string,
        documentableId: string,
        id: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/{accountId}/loan-applications/{documentableId}/files/{id}/download',
            path: {
                'accountId': accountId,
                'documentableId': documentableId,
                'id': id,
            },
            errors: {
                404: `File not found.`,
                500: `Internal Server Error`,
            },
        });
    }
}
