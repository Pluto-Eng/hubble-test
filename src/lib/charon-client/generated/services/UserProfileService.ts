/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessResponse } from '../models/SuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileService {
    /**
     * Retrieve current user's profile
     * Fetches the authenticated user's profile information. The user can only access their own profile data.
     * @param pFields Comma-separated list of fields to return
     * @returns any Successfully retrieved user profile details.
     * @throws ApiError
     */
    public static getUserProfile(
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/profile',
            query: {
                'pFields': pFields,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                422: `Unprocessable Entity - Validation error on query parameters`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update current user's profile
     * Modifies the authenticated user's profile information. Users can only update their own profile data.
     * @param requestBody
     * @param pFields Comma-separated list of fields to return
     * @returns any User profile updated successfully.
     * @throws ApiError
     */
    public static putUserProfile(
        requestBody: User,
        pFields?: string,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/profile',
            query: {
                'pFields': pFields,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                422: `Unprocessable Entity - Validation error`,
                500: `Internal Server Error`,
            },
        });
    }
}
