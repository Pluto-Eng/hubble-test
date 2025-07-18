-- Hubble Test Database Initialization
-- Complete schema matching Charon API and OpenAPI specification

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ORGANIZATION-RELATED TABLES
-- =============================================================================

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('admin', 'client')) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    domain VARCHAR(255),
    contact_email VARCHAR(255),
    contact_name VARCHAR(100),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Issuers table
CREATE TABLE issuers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    contact_email VARCHAR(255),
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Servicers table
CREATE TABLE servicers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    contact_email VARCHAR(255),
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fund Managers table
CREATE TABLE fund_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    contact_email VARCHAR(255),
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Funds table
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
    issuer_id UUID REFERENCES issuers(id),
    fund_manager_id UUID REFERENCES fund_managers(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Providers table
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    contact_email VARCHAR(255),
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- USER AND ACCOUNT TABLES
-- =============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) DEFAULT 'individual' CHECK (type IN ('individual', 'manager', 'admin')),
    name_given VARCHAR(100) NOT NULL,
    name_middle VARCHAR(100),
    name_family VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    sec_id VARCHAR(20) CHECK (sec_id ~ '^[A-Z0-9]{8,20}$'),
    cognito_username VARCHAR(128),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_family VARCHAR(100) NOT NULL,
    name_given VARCHAR(100) NOT NULL,
    name_middle VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    sec_id VARCHAR(255),
    type VARCHAR(20) CHECK (type IN ('individual', 'business')) DEFAULT 'individual',
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Account Grants table
CREATE TABLE user_account_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    grant_type VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, account_id)
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    addressable_id UUID NOT NULL,
    addressable_type VARCHAR(50) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    address_type VARCHAR(50) DEFAULT 'primary',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- LOAN-RELATED TABLES
-- =============================================================================

-- Loan Applications table
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    issuer_id UUID REFERENCES issuers(id),
    servicer_id UUID REFERENCES servicers(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'declined', 'closed')),
    name VARCHAR(100) NOT NULL,
    employment_status VARCHAR(20) CHECK (employment_status IN ('employed', 'self-employed', 'unemployed', 'retired', 'student', 'other')),
    income_total_amount DECIMAL(15,2),
    income_total_currency VARCHAR(3) CHECK (income_total_currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    asset_total_value DECIMAL(15,2),
    asset_total_currency VARCHAR(3) CHECK (asset_total_currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    loan_amount DECIMAL(15,2),
    loan_currency VARCHAR(3) CHECK (loan_currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    loan_interest_rate DECIMAL(5,2),
    loan_interest_period VARCHAR(10) CHECK (loan_interest_period IN ('days', 'weeks', 'months', 'quarters', 'years')),
    open_date DATE,
    close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan Assets table
CREATE TABLE loan_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    fund_id UUID REFERENCES funds(id),
    fund VARCHAR(100) NOT NULL,
    investor VARCHAR(100) NOT NULL,
    phone VARCHAR(100),
    date_origin DATE,
    units INTEGER DEFAULT 0,
    units_pledged INTEGER DEFAULT 0,
    units_called INTEGER DEFAULT 0,
    units_invested INTEGER DEFAULT 0,
    unit_value DECIMAL(15,2),
    unit_currency VARCHAR(3) CHECK (unit_currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan Incomes table
CREATE TABLE loan_incomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    phone VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    year INTEGER CHECK (year >= 2020),
    period VARCHAR(10) CHECK (period IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    loan_application_id UUID REFERENCES loan_applications(id),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'defaulted', 'closed')),
    balance_open DECIMAL(15,2),
    balance_current DECIMAL(15,2),
    currency VARCHAR(3) CHECK (currency IN ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD')),
    date_open DATE,
    date_close DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- FILE AND DOCUMENT TABLES
-- =============================================================================

-- File References table
CREATE TABLE file_refs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id),
    documentable_id UUID NOT NULL,
    documentable_type VARCHAR(100) NOT NULL,
    filename VARCHAR(255),
    file_content_type VARCHAR(100),
    filepath VARCHAR(500),
    document_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    size INTEGER,
    encoding VARCHAR(50),
    aws_bucket VARCHAR(255),
    aws_key VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_cognito_username ON users(cognito_username);

-- Account indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_email ON accounts(email);

-- Grant indexes
CREATE INDEX idx_user_account_grants_user_id ON user_account_grants(user_id);
CREATE INDEX idx_user_account_grants_account_id ON user_account_grants(account_id);

-- Address indexes
CREATE INDEX idx_addresses_addressable ON addresses(addressable_id, addressable_type);
CREATE INDEX idx_addresses_primary ON addresses(addressable_id, addressable_type, is_primary);

-- Loan Application indexes
CREATE INDEX idx_loan_applications_account_id ON loan_applications(account_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_issuer_id ON loan_applications(issuer_id);
CREATE INDEX idx_loan_applications_servicer_id ON loan_applications(servicer_id);

-- Loan Asset indexes
CREATE INDEX idx_loan_assets_loan_application_id ON loan_assets(loan_application_id);
CREATE INDEX idx_loan_assets_fund_id ON loan_assets(fund_id);

-- Loan Income indexes
CREATE INDEX idx_loan_incomes_loan_application_id ON loan_incomes(loan_application_id);

-- Loan indexes
CREATE INDEX idx_loans_account_id ON loans(account_id);
CREATE INDEX idx_loans_loan_application_id ON loans(loan_application_id);

-- File Reference indexes
CREATE INDEX idx_file_refs_documentable ON file_refs(documentable_id, documentable_type);
CREATE INDEX idx_file_refs_account_id ON file_refs(account_id);

-- Organization indexes
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_status ON organizations(status);

-- Fund indexes
CREATE INDEX idx_funds_issuer_id ON funds(issuer_id);
CREATE INDEX idx_funds_fund_manager_id ON funds(fund_manager_id);

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Insert sample organizations
INSERT INTO organizations (name, type, status, domain, contact_email, contact_name) VALUES
('Pluto Credit', 'admin', 'active', 'plutocredit.com', 'admin@plutocredit.com', 'Admin User'),
('Test Corporation', 'client', 'active', 'testcorp.com', 'contact@testcorp.com', 'John Smith'),
('Acme Financial', 'client', 'active', 'acmefinancial.com', 'admin@acmefinancial.com', 'Jane Doe');

-- Insert sample issuers
INSERT INTO issuers (name, type, status, contact_email, contact_name, phone) VALUES
('Pluto Credit Issuer', 'financial', 'active', 'issuer@plutocredit.com', 'Issuer Admin', '+1-555-0100'),
('Test Issuer Corp', 'financial', 'active', 'issuer@testcorp.com', 'Test Issuer', '+1-555-0101');

-- Insert sample servicers
INSERT INTO servicers (name, type, status, contact_email, contact_name, phone) VALUES
('Pluto Credit Servicer', 'financial', 'active', 'servicer@plutocredit.com', 'Servicer Admin', '+1-555-0200'),
('Test Servicer Corp', 'financial', 'active', 'servicer@testcorp.com', 'Test Servicer', '+1-555-0201');

-- Insert sample fund managers
INSERT INTO fund_managers (name, type, contact_email, contact_name, phone) VALUES
('Pluto Fund Management', 'investment', 'funds@plutocredit.com', 'Fund Manager', '+1-555-0300'),
('Test Fund Management', 'investment', 'funds@testcorp.com', 'Test Fund Manager', '+1-555-0301');

-- Insert sample funds
INSERT INTO funds (name, type, status, issuer_id, fund_manager_id, description) VALUES
('Pluto Growth Fund I', 'equity', 'active', 
 (SELECT id FROM issuers WHERE name = 'Pluto Credit Issuer'),
 (SELECT id FROM fund_managers WHERE name = 'Pluto Fund Management'),
 'Primary growth fund for technology investments'),
('Test Income Fund', 'fixed_income', 'active',
 (SELECT id FROM issuers WHERE name = 'Test Issuer Corp'),
 (SELECT id FROM fund_managers WHERE name = 'Test Fund Management'),
 'Income-generating fund for stable returns');

-- Insert sample users
INSERT INTO users (name_given, name_family, email, phone, type, organization_id) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'individual', (SELECT id FROM organizations WHERE name = 'Test Corporation')),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0124', 'manager', (SELECT id FROM organizations WHERE name = 'Test Corporation')),
('Admin', 'User', 'admin@plutocredit.com', '+1-555-0000', 'admin', (SELECT id FROM organizations WHERE name = 'Pluto Credit'));

-- Insert sample accounts
INSERT INTO accounts (name_given, name_family, email, phone, type, user_id) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'individual', (SELECT id FROM users WHERE email = 'john.doe@example.com')),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0124', 'individual', (SELECT id FROM users WHERE email = 'jane.smith@example.com'));

-- Insert sample user account grants
INSERT INTO user_account_grants (user_id, account_id, grant_type, permissions) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 (SELECT id FROM accounts WHERE email = 'john.doe@example.com'), 
 'owner', '{"read": true, "write": true, "delete": true}'),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 (SELECT id FROM accounts WHERE email = 'jane.smith@example.com'), 
 'owner', '{"read": true, "write": true, "delete": true}');

-- Insert sample addresses
INSERT INTO addresses (addressable_id, addressable_type, address_line_1, city, state, postal_code, country, address_type, is_primary) VALUES
((SELECT id FROM accounts WHERE email = 'john.doe@example.com'), 'Account', '123 Main St', 'New York', 'NY', '10001', 'USA', 'primary', true),
((SELECT id FROM accounts WHERE email = 'jane.smith@example.com'), 'Account', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA', 'primary', true);

-- Insert sample loan applications
INSERT INTO loan_applications (account_id, issuer_id, servicer_id, name, status, employment_status, income_total_amount, income_total_currency, asset_total_value, asset_total_currency, loan_amount, loan_currency, loan_interest_rate, loan_interest_period, open_date) VALUES
((SELECT id FROM accounts WHERE email = 'john.doe@example.com'), 
 (SELECT id FROM issuers WHERE name = 'Pluto Credit Issuer'),
 (SELECT id FROM servicers WHERE name = 'Pluto Credit Servicer'),
 'Home Improvement Loan', 'pending', 'self-employed', 85000.00, 'USD', 250000.00, 'USD', 50000.00, 'USD', 5.5, 'months', '2024-01-15'),
((SELECT id FROM accounts WHERE email = 'jane.smith@example.com'),
 (SELECT id FROM issuers WHERE name = 'Test Issuer Corp'),
 (SELECT id FROM servicers WHERE name = 'Test Servicer Corp'),
 'Business Expansion Loan', 'draft', 'employed', 95000.00, 'USD', 300000.00, 'USD', 75000.00, 'USD', 4.8, 'months', '2024-02-01');

-- Insert sample loan assets
INSERT INTO loan_assets (loan_application_id, fund_id, fund, investor, phone, date_origin, units, units_pledged, units_called, units_invested, unit_value, unit_currency) VALUES
((SELECT id FROM loan_applications WHERE name = 'Home Improvement Loan'),
 (SELECT id FROM funds WHERE name = 'Pluto Growth Fund I'),
 'Pluto Growth Fund I', 'ABC Investment LLC', '+1-555-0123', '2023-01-15', 1000, 800, 600, 600, 100.00, 'USD'),
((SELECT id FROM loan_applications WHERE name = 'Business Expansion Loan'),
 (SELECT id FROM funds WHERE name = 'Test Income Fund'),
 'Test Income Fund', 'XYZ Investment Corp', '+1-555-0124', '2023-02-01', 1500, 1200, 900, 900, 75.00, 'USD');

-- Insert sample loan incomes
INSERT INTO loan_incomes (loan_application_id, phone, name, amount, currency, year, period) VALUES
((SELECT id FROM loan_applications WHERE name = 'Home Improvement Loan'), '+1-555-0123', 'Salary - ABC Corp', 75000.00, 'USD', 2024, 'YEARLY'),
((SELECT id FROM loan_applications WHERE name = 'Business Expansion Loan'), '+1-555-0124', 'Salary - Tech Corp', 85000.00, 'USD', 2024, 'YEARLY');

-- Insert sample loans
INSERT INTO loans (account_id, loan_application_id, name, status, balance_open, balance_current, currency, date_open, date_close) VALUES
((SELECT id FROM accounts WHERE email = 'john.doe@example.com'),
 (SELECT id FROM loan_applications WHERE name = 'Home Improvement Loan'),
 'Personal Loan Q3', 'open', 50000.00, 45000.00, 'USD', '2024-01-15', '2027-01-15'),
((SELECT id FROM accounts WHERE email = 'jane.smith@example.com'),
 (SELECT id FROM loan_applications WHERE name = 'Business Expansion Loan'),
 'Business Loan Q1', 'open', 75000.00, 70000.00, 'USD', '2024-02-01', '2027-02-01');

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issuers_updated_at BEFORE UPDATE ON issuers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicers_updated_at BEFORE UPDATE ON servicers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fund_managers_updated_at BEFORE UPDATE ON fund_managers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON funds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_account_grants_updated_at BEFORE UPDATE ON user_account_grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON loan_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_assets_updated_at BEFORE UPDATE ON loan_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_incomes_updated_at BEFORE UPDATE ON loan_incomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_refs_updated_at BEFORE UPDATE ON file_refs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 