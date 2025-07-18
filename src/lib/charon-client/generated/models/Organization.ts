/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * An organization in the system
 */
export type Organization = {
    /**
     * The unique identifier for the organization
     */
    readonly id?: string;
    /**
     * Organization name
     */
    name: string;
    /**
     * Organization type (admin for Pluto Credit, client for external organizations)
     */
    type: Organization.type;
    /**
     * Organization status
     */
    status?: Organization.status;
    /**
     * Email domain for automatic user-organization association
     */
    domain?: string;
    /**
     * Primary contact email for the organization
     */
    contactEmail?: string;
    /**
     * Primary contact person name
     */
    contactName?: string;
    /**
     * Organization-specific settings and configuration
     */
    settings?: Record<string, any>;
    /**
     * Timestamp when the organization was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the organization was last updated
     */
    readonly updatedAt?: string;
    /**
     * Timestamp when the organization was deleted
     */
    readonly deletedAt?: string;
};
export namespace Organization {
    /**
     * Organization type (admin for Pluto Credit, client for external organizations)
     */
    export enum type {
        ADMIN = 'admin',
        CLIENT = 'client',
    }
    /**
     * Organization status
     */
    export enum status {
        ACTIVE = 'active',
        SUSPENDED = 'suspended',
    }
}

