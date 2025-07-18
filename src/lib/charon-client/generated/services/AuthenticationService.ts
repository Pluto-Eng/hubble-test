/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthRequest } from '../models/AuthRequest';
import type { AuthResponse } from '../models/AuthResponse';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register a new user
     * Creates a new user account with email verification
     * @param requestBody
     * @returns any User registered successfully
     * @throws ApiError
     */
    public static postUserRegister(
        requestBody: AuthRequest,
    ): CancelablePromise<(SuccessResponse & {
        data?: User;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Confirm user registration
     * Confirms user email address with verification code
     * @param requestBody
     * @returns SuccessResponse Email confirmed successfully
     * @throws ApiError
     */
    public static postUserConfirm(
        requestBody: {
            username: string;
            confirmationCode: string;
        },
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * User login
     * Authenticates a user and returns access tokens
     * @param requestBody
     * @returns any Login successful
     * @throws ApiError
     */
    public static postUserLogin(
        requestBody: AuthRequest,
    ): CancelablePromise<(SuccessResponse & {
        data?: AuthResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized - Invalid credentials`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * User logout
     * Logs out a user and invalidates their session
     * @param requestBody
     * @returns SuccessResponse Logout successful
     * @throws ApiError
     */
    public static postUserLogout(
        requestBody: {
            /**
             * The access token to invalidate
             */
            accessToken: string;
        },
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Refresh access tokens
     * Refreshes the access token using a valid refresh token
     * @param requestBody
     * @returns any Token refresh successful
     * @throws ApiError
     */
    public static postUserRefresh(
        requestBody: {
            /**
             * The refresh token
             */
            refreshToken: string;
        },
    ): CancelablePromise<(SuccessResponse & {
        data?: AuthResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized - Invalid refresh token`,
                500: `Internal Server Error`,
            },
        });
    }
}
