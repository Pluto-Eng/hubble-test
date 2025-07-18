/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents a loan asset or investment
 */
export type LoanAsset = {
    /**
     * The unique identifier for the loan asset
     */
    readonly id?: string;
    /**
     * The ID of the associated loan application
     */
    loanApplicationId: string;
    /**
     * Fund name or identifier
     */
    fund: string;
    /**
     * Investor name or identifier
     */
    investor: string;
    /**
     * Contact phone number
     */
    phone?: string;
    /**
     * Date when the asset was originated
     */
    dateOrigin?: string;
    /**
     * Total number of units
     */
    units?: number;
    /**
     * Number of units pledged
     */
    unitsPledged?: number;
    /**
     * Number of units called
     */
    unitsCalled?: number;
    /**
     * Number of units invested
     */
    unitsInvested?: number;
    /**
     * Value per unit
     */
    unitValue?: number;
    /**
     * Currency of the unit value
     */
    unitCurrency?: LoanAsset.unitCurrency;
    /**
     * Timestamp when the loan asset was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the loan asset was last updated
     */
    readonly updatedAt?: string;
};
export namespace LoanAsset {
    /**
     * Currency of the unit value
     */
    export enum unitCurrency {
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

