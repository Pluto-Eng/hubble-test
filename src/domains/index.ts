// Domain-driven exports for the application
// This provides a clean interface for importing domain-specific functionality

// Core domains
export * from './auth';
export * from './accounts';
export * from './loans';
export * from './files';
export * from './organizations';
export * from './users';

// Shared utilities
export * from './shared/types';
export * from './shared/errors';
export * from './shared/api';