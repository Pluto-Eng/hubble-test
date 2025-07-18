/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Standard error response format
 */
export type ErrorResponse = {
    /**
     * Request ID associated with the error
     */
    id?: string;
    /**
     * Human-readable error message
     */
    message?: string;
    /**
     * HTTP status code
     */
    statusCode?: number;
    /**
     * User-friendly feedback message (optional)
     */
    feedback?: string;
    /**
     * Validation error details (optional, typically for 400/422)
     */
    errors?: Record<string, string>;
    /**
     * Stack trace in development mode for 500 errors
     */
    data?: string;
};

