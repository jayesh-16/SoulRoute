-- Create custom enums for ticket system
CREATE TYPE ticket_category AS ENUM ('anxiety', 'depression', 'stress', 'relationships', 'academic', 'other');
CREATE TYPE ticket_urgency AS ENUM ('low', 'medium', 'high', 'crisis');
CREATE TYPE ticket_status AS ENUM ('open', 'claimed', 'scheduled', 'completed', 'closed');
CREATE TYPE session_mode AS ENUM ('video', 'audio', 'chat', 'in-person');

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

-- Create RLS policies for support_tickets
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

-- Policy: Students can update their own tickets (limited fields)
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

-- Create indexes for better performance
CREATE INDEX idx_support_tickets_student_id ON support_tickets(student_id);
CREATE INDEX idx_support_tickets_counselor_id ON support_tickets(counselor_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_urgency ON support_tickets(urgency);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to restrict student updates to certain fields only
CREATE OR REPLACE FUNCTION restrict_student_ticket_updates()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user is a student
    IF EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'student'
    ) THEN
        -- Students can only update title, description, urgency, and session_mode
        -- Preserve original values for restricted fields
        NEW.status = OLD.status;
        NEW.counselor_id = OLD.counselor_id;
        NEW.scheduled_time = OLD.scheduled_time;
        NEW.meeting_link = OLD.meeting_link;
        NEW.notes = OLD.notes;
        NEW.created_at = OLD.created_at;
        NEW.student_id = OLD.student_id;
        NEW.id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for student update restrictions
CREATE TRIGGER restrict_student_updates_trigger
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION restrict_student_ticket_updates();