/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A loan application
 */
export type LoanApplication = {
    /**
     * The unique identifier for the loan application
     */
    readonly id?: string;
    /**
     * The ID of the associated account
     */
    accountId: string;
    /**
     * Current status of the loan application
     */
    status?: LoanApplication.status;
    /**
     * Name or title of the loan application
     */
    name: string;
    /**
     * Employment status of the applicant
     */
    employmentStatus?: LoanApplication.employmentStatus;
    /**
     * Total income amount
     */
    incomeTotalAmount?: number;
    /**
     * Currency of the total income
     */
    incomeTotalCurrency?: LoanApplication.incomeTotalCurrency;
    /**
     * Total value of assets
     */
    assetTotalValue?: number;
    /**
     * Currency of the total asset value
     */
    assetTotalCurrency?: LoanApplication.assetTotalCurrency;
    /**
     * Requested loan amount
     */
    loanAmount?: number;
    /**
     * Currency of the requested loan
     */
    loanCurrency?: LoanApplication.loanCurrency;
    /**
     * Interest rate for the loan
     */
    loanInterestRate?: number;
    /**
     * Interest calculation period
     */
    loanInterestPeriod?: LoanApplication.loanInterestPeriod;
    /**
     * Date when the application was opened
     */
    openDate?: string;
    /**
     * Date when the application was closed
     */
    closeDate?: string;
    /**
     * Timestamp when the loan application was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the loan application was last updated
     */
    readonly updatedAt?: string;
};
export namespace LoanApplication {
    /**
     * Current status of the loan application
     */
    export enum status {
        DRAFT = 'draft',
        PENDING = 'pending',
        APPROVED = 'approved',
        DECLINED = 'declined',
        CLOSED = 'closed',
    }
    /**
     * Employment status of the applicant
     */
    export enum employmentStatus {
        EMPLOYED = 'employed',
        SELF_EMPLOYED = 'self-employed',
        UNEMPLOYED = 'unemployed',
        RETIRED = 'retired',
        STUDENT = 'student',
        OTHER = 'other',
    }
    /**
     * Currency of the total income
     */
    export enum incomeTotalCurrency {
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
     * Currency of the total asset value
     */
    export enum assetTotalCurrency {
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
     * Currency of the requested loan
     */
    export enum loanCurrency {
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
     * Interest calculation period
     */
    export enum loanInterestPeriod {
        DAYS = 'days',
        WEEKS = 'weeks',
        MONTHS = 'months',
        QUARTERS = 'quarters',
        YEARS = 'years',
    }
}

