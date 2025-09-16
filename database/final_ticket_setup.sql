-- Final Ticket System Setup with Proper Foreign Key Relationships
-- Run this script in your Supabase SQL Editor

-- First, ensure the users table exists with the required role column
-- (This should already exist from your previous setup)

-- Drop existing types if they exist (in case of conflicts)
DROP TYPE IF EXISTS ticket_category CASCADE;
DROP TYPE IF EXISTS ticket_urgency CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS session_mode CASCADE;

-- Create custom enums for ticket system
CREATE TYPE ticket_category AS ENUM ('anxiety', 'depression', 'stress', 'relationships', 'academic', 'other');
CREATE TYPE ticket_urgency AS ENUM ('low', 'medium', 'high', 'crisis');
CREATE TYPE ticket_status AS ENUM ('open', 'claimed', 'scheduled', 'completed', 'closed');
CREATE TYPE session_mode AS ENUM ('video', 'audio', 'chat', 'in-person');

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS support_tickets CASCADE;

-- Create support_tickets table with proper foreign key constraints
CREATE TABLE support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    counselor_id UUID NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category ticket_category NOT NULL,
    urgency ticket_urgency NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    session_mode session_mode NOT NULL,
    scheduled_time TIMESTAMPTZ NULL,
    meeting_link TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Foreign key constraints referencing the custom users table
    CONSTRAINT fk_support_tickets_student FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_support_tickets_counselor FOREIGN KEY (counselor_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_student_id ON support_tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_counselor_id ON support_tickets(counselor_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_urgency ON support_tickets(urgency);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own tickets
CREATE POLICY "Students can view own tickets" ON support_tickets
    FOR SELECT USING (
        auth.uid() = student_id
    );

-- Policy: Students can create tickets
CREATE POLICY "Students can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (
        auth.uid() = student_id AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'student' 
            AND approval_status = 'approved'
        )
    );

-- Policy: Students can update their own tickets
CREATE POLICY "Students can update own tickets" ON support_tickets
    FOR UPDATE USING (
        auth.uid() = student_id
    ) WITH CHECK (
        auth.uid() = student_id
    );

-- Policy: Counselors can view all open tickets and their assigned tickets
CREATE POLICY "Counselors can view relevant tickets" ON support_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'counselor' 
            AND approval_status = 'approved'
        ) AND (
            status = 'open' OR 
            counselor_id = auth.uid()
        )
    );

-- Policy: Counselors can claim open tickets
CREATE POLICY "Counselors can claim tickets" ON support_tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'counselor' 
            AND approval_status = 'approved'
        ) AND
        status = 'open' AND
        counselor_id IS NULL
    ) WITH CHECK (
        counselor_id = auth.uid() AND
        status = 'claimed'
    );

-- Policy: Counselors can update their assigned tickets
CREATE POLICY "Counselors can update assigned tickets" ON support_tickets
    FOR UPDATE USING (
        counselor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'counselor' 
            AND approval_status = 'approved'
        )
    );

-- Policy: Admins can view all tickets
CREATE POLICY "Admins can view all tickets" ON support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON support_tickets TO authenticated;
GRANT ALL ON support_tickets TO service_role;

-- Verify the setup
SELECT 'Ticket system setup completed successfully!' as status;