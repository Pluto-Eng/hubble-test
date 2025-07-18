/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Standard success response format
 */
export type SuccessResponse = {
    /**
     * Request ID
     */
    id?: string;
    /**
     * Success message
     */
    message?: string;
    /**
     * HTTP status code
     */
    statusCode?: number;
    /**
     * Response data (varies by endpoint)
     */
    data?: any;
    /**
     * Number of items returned (for array responses)
     */
    count?: number;
};

