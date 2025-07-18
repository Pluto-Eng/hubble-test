/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A file reference document
 */
export type FileRef = {
    /**
     * The unique identifier for the file reference
     */
    readonly id?: string;
    /**
     * The ID of the entity this file is associated with
     */
    documentableId: string;
    /**
     * The type of entity this file is associated with
     */
    documentableType: string;
    /**
     * Original filename
     */
    filename?: string;
    /**
     * MIME type of the file
     */
    fileContentType?: string;
    /**
     * File path or location
     */
    filepath?: string;
    /**
     * Type of document
     */
    documentType?: string;
    /**
     * File status
     */
    status?: FileRef.status;
    /**
     * File size in bytes
     */
    size?: number;
    /**
     * File encoding
     */
    encoding?: string;
    /**
     * AWS S3 bucket name
     */
    awsBucket?: string;
    /**
     * AWS S3 object key
     */
    awsKey?: string;
    /**
     * Timestamp when the file was created
     */
    readonly createdAt?: string;
    /**
     * Timestamp when the file was last updated
     */
    readonly updatedAt?: string;
};
export namespace FileRef {
    /**
     * File status
     */
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

