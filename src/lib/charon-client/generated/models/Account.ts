/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A system account
 */
export type Account = {
    /**
     * The unique identifier for the account
     */
    readonly id?: string;
    /**
     * Family name (last name)
     */
    nameFamily: string;
    /**
     * Given name (first name)
     */
    nameGiven: string;
    /**
     * Middle name
     */
    nameMiddle?: string;
    /**
     * Email address
     */
    email: string;
    /**
     * Phone number
     */
    phone?: string;
    /**
     * Security identifier
     */
    secId?: string;
    /**
     * Account type
     */
    type?: Account.type;
    /**
     * Timestamp when the account was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the account was last updated
     */
    readonly updatedAt?: string;
};
export namespace Account {
    /**
     * Account type
     */
    export enum type {
        INDIVIDUAL = 'individual',
        BUSINESS = 'business',
    }
}

