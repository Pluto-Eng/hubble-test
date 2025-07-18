/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Authentication response
 */
export type AuthResponse = {
    /**
     * JWT access token
     */
    accessToken?: string;
    /**
     * JWT refresh token
     */
    refreshToken?: string;
    /**
     * JWT ID token
     */
    idToken?: string;
    /**
     * Token expiration time in seconds
     */
    expiresIn?: number;
    /**
     * Token type
     */
    tokenType?: string;
};

