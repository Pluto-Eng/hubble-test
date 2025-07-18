/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A system user
 */
export type User = {
    /**
     * The unique identifier for the user
     */
    readonly id?: string;
    /**
     * The type of user
     */
    type?: User.type;
    /**
     * Given name supporting international characters
     */
    nameGiven?: string;
    /**
     * Middle name supporting international characters
     */
    nameMiddle?: string;
    /**
     * Family name supporting international characters
     */
    nameFamily: string;
    /**
     * User's email address
     */
    email: string;
    /**
     * Phone number in international format
     */
    phone?: string;
    /**
     * SEC ID - 8-20 alphanumeric characters
     */
    secId?: string;
    /**
     * Cognito username identifier
     */
    readonly cognitoUsername?: string;
    /**
     * Timestamp when the user was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the user was last updated
     */
    readonly updatedAt?: string;
};
export namespace User {
    /**
     * The type of user
     */
    export enum type {
        INDIVIDUAL = 'individual',
        MANAGER = 'manager',
        ADMIN = 'admin',
    }
}

