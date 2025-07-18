/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a loan income source
 */
export type LoanIncome = {
    /**
     * The unique identifier for the loan income
     */
    readonly id?: string;
    /**
     * The ID of the associated loan application
     */
    loanApplicationId: string;
    /**
     * Contact phone number
     */
    phone?: string;
    /**
     * Income source name or description
     */
    name: string;
    /**
     * Income amount
     */
    amount: number;
    /**
     * Currency of the income amount
     */
    currency: LoanIncome.currency;
    /**
     * The year this income applies to
     */
    year?: number;
    /**
     * The period frequency of this income
     */
    period?: LoanIncome.period;
    /**
     * Timestamp when the loan income was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the loan income was last updated
     */
    readonly updatedAt?: string;
};
export namespace LoanIncome {
    /**
     * Currency of the income amount
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
    /**
     * The period frequency of this income
     */
    export enum period {
        MONTHLY = 'MONTHLY',
        QUARTERLY = 'QUARTERLY',
        YEARLY = 'YEARLY',
    }
}

