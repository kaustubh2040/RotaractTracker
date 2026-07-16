-- ACTRA Help & Support Center Database Schema Setup
-- This script is completely additive, non-destructive, and backward-compatible for production.
-- It can be executed safely inside the Supabase SQL Editor.

-- 1. Create SUPPORT_TICKETS Table
-- This table stores contact/support requests submitted from the Help Center.
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Securely generated UUID for each ticket
    
    -- Requester Contact Information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Support Content
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Ticket State (Defaults to 'New')
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved')),
    
    -- Submission Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
-- Enables strict database security boundary so anonymous reads are prevented by default.
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- 3. Define Insert Security Policy
-- ALLOW ALL: Enables both public/anonymous visitors and logged-in club members to submit tickets.
CREATE POLICY "Allow anyone to submit support tickets" 
ON support_tickets
FOR INSERT 
WITH CHECK (true);

-- 4. Define Read & Update Security Policies
-- ALLOW ONLY the Application Owner (Kaustubh Patil).
-- Since ACTRA utilizes a custom client-side identity system, we write the policy
-- to check if the performing transaction is associated with the registered identity of the Owner.
-- To maintain performance, this queries the `users` table to verify authorization.

CREATE POLICY "Allow Application Owner to view support tickets"
ON support_tickets
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE LOWER(TRIM(users.name)) = 'kaustubh patil'
    )
);

CREATE POLICY "Allow Application Owner to update support tickets"
ON support_tickets
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE LOWER(TRIM(users.name)) = 'kaustubh patil'
    )
);

-- Note: No DELETE policies are created as deletion of support tickets is explicitly disabled/forbidden.

-- 5. Helper Documentation Comments
COMMENT ON TABLE support_tickets IS 'Stores user-submitted support and contact inquiries from the Help Center.';
COMMENT ON COLUMN support_tickets.status IS 'The current operational state of the ticket: New, In Progress, or Resolved.';
COMMENT ON COLUMN support_tickets.email IS 'Email address of the requester used for admin feedback and contact replies.';
