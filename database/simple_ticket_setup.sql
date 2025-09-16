-- Simple Ticket System Setup (No Complex Triggers)
-- Run this in your Supabase SQL Editor

-- Create custom enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_category') THEN
        CREATE TYPE ticket_category AS ENUM ('anxiety', 'depression', 'stress', 'relationships', 'academic', 'other');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_urgency') THEN
        CREATE TYPE ticket_urgency AS ENUM ('low', 'medium', 'high', 'crisis');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('open', 'claimed', 'scheduled', 'completed', 'closed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_mode') THEN
        CREATE TYPE session_mode AS ENUM ('video', 'audio', 'chat', 'in-person');
    END IF;
END $$;

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counselor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category ticket_category NOT NULL,
    urgency ticket_urgency NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    session_mode session_mode NOT NULL,
    scheduled_time TIMESTAMPTZ,
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own tickets
CREATE POLICY "Students can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = student_id);

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
    FOR UPDATE USING (auth.uid() = student_id);

-- Policy: Counselors can view open tickets and their assigned tickets
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

-- Policy: Counselors can update tickets (claim and manage)
CREATE POLICY "Counselors can update tickets" ON support_tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'counselor' 
            AND approval_status = 'approved'
        )
    );

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all tickets" ON support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_student_id ON support_tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_counselor_id ON support_tickets(counselor_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_urgency ON support_tickets(urgency);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Simple function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO support_tickets (student_id, title, description, category, urgency, session_mode)
-- VALUES 
-- (auth.uid(), 'Test Ticket', 'This is a test ticket for anxiety support', 'anxiety', 'medium', 'video');

SELECT 'Simple ticket system setup completed!' as message;