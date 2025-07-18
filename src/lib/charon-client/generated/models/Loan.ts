/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A loan
 */
export type Loan = {
    /**
     * The unique identifier for the loan
     */
    readonly id?: string;
    /**
     * The ID of the associated account
     */
    accountId: string;
    /**
     * Loan name or identifier
     */
    name: string;
    /**
     * Associated loan application ID
     */
    loanApplicationId?: string;
    /**
     * Current status of the loan
     */
    status?: Loan.status;
    /**
     * Opening balance of the loan
     */
    balanceOpen?: number;
    /**
     * Current outstanding balance
     */
    balanceCurrent?: number;
    /**
     * Currency of the loan amounts
     */
    currency?: Loan.currency;
    /**
     * Date when the loan was opened
     */
    dateOpen?: string;
    /**
     * Date when the loan was closed
     */
    dateClose?: string;
    /**
     * Timestamp when the loan was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the loan was last updated
     */
    readonly updatedAt?: string;
};
export namespace Loan {
    /**
     * Current status of the loan
     */
    export enum status {
        OPEN = 'open',
        DEFAULTED = 'defaulted',
        CLOSED = 'closed',
    }
    /**
     * Currency of the loan amounts
     */
    export enum currency {
        USD = 'USD',
        EUR = 'EUR',
        GBP = 'GBP',
        JPY = 'JPY',
        AUD = 'AUD',
        CAD = 'CAD',
        CHF = 'CHF',
        CNY = 'CNY',
        SEK = 'SEK',
        NZD = 'NZD',
    }
}

