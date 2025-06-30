-- AIBOS v5 Database Schema
-- Create tables for dashboard data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approvals table
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
    approver_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data for testing dashboard

-- Insert sample users
INSERT INTO users (email, name) VALUES
    ('john@example.com', 'John Doe'),
    ('jane@example.com', 'Jane Smith'),
    ('bob@example.com', 'Bob Johnson'),
    ('alice@example.com', 'Alice Brown');

-- Insert sample transactions
INSERT INTO transactions (user_id, amount, type, status, description) VALUES
    ((SELECT id FROM users WHERE email = 'john@example.com'), 1200.00, 'income', 'approved', 'Invoice #1234'),
    ((SELECT id FROM users WHERE email = 'jane@example.com'), 2500.00, 'income', 'approved', 'Payment from Client'),
    ((SELECT id FROM users WHERE email = 'bob@example.com'), -200.00, 'expense', 'approved', 'Refund'),
    ((SELECT id FROM users WHERE email = 'alice@example.com'), 800.00, 'income', 'pending', 'Invoice #1233'),
    ((SELECT id FROM users WHERE email = 'john@example.com'), 1500.00, 'income', 'approved', 'Consulting Fee'),
    ((SELECT id FROM users WHERE email = 'jane@example.com'), 3000.00, 'income', 'approved', 'Project Payment'),
    ((SELECT id FROM users WHERE email = 'bob@example.com'), -150.00, 'expense', 'pending', 'Office Supplies'),
    ((SELECT id FROM users WHERE email = 'alice@example.com'), 900.00, 'income', 'approved', 'Service Fee');

-- Insert sample approvals
INSERT INTO approvals (transaction_id, status, approver_name) VALUES
    ((SELECT id FROM transactions WHERE description = 'Invoice #1234'), 'approved', 'Manager A'),
    ((SELECT id FROM transactions WHERE description = 'Payment from Client'), 'approved', 'Manager B'),
    ((SELECT id FROM transactions WHERE description = 'Refund'), 'approved', 'Manager A'),
    ((SELECT id FROM transactions WHERE description = 'Invoice #1233'), 'pending', NULL),
    ((SELECT id FROM transactions WHERE description = 'Consulting Fee'), 'approved', 'Manager C'),
    ((SELECT id FROM transactions WHERE description = 'Project Payment'), 'approved', 'Manager A'),
    ((SELECT id FROM transactions WHERE description = 'Office Supplies'), 'pending', NULL),
    ((SELECT id FROM transactions WHERE description = 'Service Fee'), 'approved', 'Manager B');

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_transaction_id ON approvals(transaction_id); 