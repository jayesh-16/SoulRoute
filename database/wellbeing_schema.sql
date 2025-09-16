-- Wellbeing Assessment Database Schema
-- This schema supports mental health screening assessments and results tracking

-- Create enum types for assessment categories (with IF NOT EXISTS handling)
DO $$ BEGIN
    CREATE TYPE assessment_type AS ENUM ('phq9', 'gad7', 'pss10', 'ghq12');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE overall_category AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRISIS_ALERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Wellbeing sessions table - tracks individual assessment sessions
CREATE TABLE IF NOT EXISTS wellbeing_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_status session_status DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    overall_category overall_category,
    safety_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment responses table - stores individual question responses
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES wellbeing_sessions(id) ON DELETE CASCADE,
    assessment_type assessment_type NOT NULL,
    question_index INTEGER NOT NULL,
    response_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment scores table - stores calculated scores for each assessment
CREATE TABLE IF NOT EXISTS assessment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES wellbeing_sessions(id) ON DELETE CASCADE,
    assessment_type assessment_type NOT NULL,
    raw_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (ROUND((raw_score::DECIMAL / max_score::DECIMAL) * 100, 2)) STORED,
    category VARCHAR(50) NOT NULL,
    severity_level INTEGER NOT NULL, -- 0=minimal, 1=mild, 2=moderate, 3=severe, 4=crisis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one score per assessment type per session
    UNIQUE(session_id, assessment_type)
);

-- Assessment recommendations table - stores personalized recommendations
CREATE TABLE IF NOT EXISTS assessment_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES wellbeing_sessions(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'immediate', 'counseling', 'resources', 'self_help'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1, -- 1=highest, 5=lowest
    action_url VARCHAR(500),
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellbeing trends table - tracks changes over time
CREATE TABLE IF NOT EXISTS wellbeing_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type assessment_type NOT NULL,
    session_id UUID NOT NULL REFERENCES wellbeing_sessions(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    trend_direction VARCHAR(20), -- 'improving', 'stable', 'declining'
    compared_to_session_id UUID REFERENCES wellbeing_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wellbeing_sessions_user_id ON wellbeing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_wellbeing_sessions_status ON wellbeing_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_wellbeing_sessions_completed_at ON wellbeing_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session_id ON assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_type ON assessment_responses(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_session_id ON assessment_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_type ON assessment_scores(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_recommendations_session_id ON assessment_recommendations(session_id);
CREATE INDEX IF NOT EXISTS idx_wellbeing_trends_user_id ON wellbeing_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_wellbeing_trends_type ON wellbeing_trends(assessment_type);

-- Row Level Security (RLS) Policies
ALTER TABLE wellbeing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_trends ENABLE ROW LEVEL SECURITY;

-- Students can only access their own wellbeing data
DROP POLICY IF EXISTS "Students can view own wellbeing sessions" ON wellbeing_sessions;
CREATE POLICY "Students can view own wellbeing sessions" ON wellbeing_sessions
    FOR SELECT USING (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'student'
        )
    );

DROP POLICY IF EXISTS "Students can insert own wellbeing sessions" ON wellbeing_sessions;
CREATE POLICY "Students can insert own wellbeing sessions" ON wellbeing_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'student'
        )
    );

DROP POLICY IF EXISTS "Students can update own wellbeing sessions" ON wellbeing_sessions;
CREATE POLICY "Students can update own wellbeing sessions" ON wellbeing_sessions
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'student'
        )
    );

-- Assessment responses policies (students only)
DROP POLICY IF EXISTS "Students can view own assessment responses" ON assessment_responses;
CREATE POLICY "Students can view own assessment responses" ON assessment_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions ws
            JOIN users u ON ws.user_id = u.id
            WHERE ws.id = assessment_responses.session_id 
            AND ws.user_id = auth.uid()
            AND u.role = 'student'
        )
    );

DROP POLICY IF EXISTS "Students can insert own assessment responses" ON assessment_responses;
CREATE POLICY "Students can insert own assessment responses" ON assessment_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions ws
            JOIN users u ON ws.user_id = u.id
            WHERE ws.id = assessment_responses.session_id 
            AND ws.user_id = auth.uid()
            AND u.role = 'student'
        )
    );

-- Assessment scores policies
DROP POLICY IF EXISTS "Users can view own assessment scores" ON assessment_scores;
CREATE POLICY "Users can view own assessment scores" ON assessment_scores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions 
            WHERE wellbeing_sessions.id = assessment_scores.session_id 
            AND wellbeing_sessions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own assessment scores" ON assessment_scores;
CREATE POLICY "Users can insert own assessment scores" ON assessment_scores
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions 
            WHERE wellbeing_sessions.id = assessment_scores.session_id 
            AND wellbeing_sessions.user_id = auth.uid()
        )
    );

-- Assessment recommendations policies
DROP POLICY IF EXISTS "Users can view own recommendations" ON assessment_recommendations;
CREATE POLICY "Users can view own recommendations" ON assessment_recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions 
            WHERE wellbeing_sessions.id = assessment_recommendations.session_id 
            AND wellbeing_sessions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own recommendations" ON assessment_recommendations;
CREATE POLICY "Users can insert own recommendations" ON assessment_recommendations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM wellbeing_sessions 
            WHERE wellbeing_sessions.id = assessment_recommendations.session_id 
            AND wellbeing_sessions.user_id = auth.uid()
        )
    );

-- Wellbeing trends policies
DROP POLICY IF EXISTS "Users can view own trends" ON wellbeing_trends;
CREATE POLICY "Users can view own trends" ON wellbeing_trends
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trends" ON wellbeing_trends;
CREATE POLICY "Users can insert own trends" ON wellbeing_trends
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Counselors and admins can view all wellbeing data (for support purposes)
DROP POLICY IF EXISTS "Counselors can view all wellbeing sessions" ON wellbeing_sessions;
CREATE POLICY "Counselors can view all wellbeing sessions" ON wellbeing_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('counselor', 'admin')
        )
    );

DROP POLICY IF EXISTS "Counselors can view all assessment data" ON assessment_responses;
CREATE POLICY "Counselors can view all assessment data" ON assessment_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('counselor', 'admin')
        )
    );

DROP POLICY IF EXISTS "Counselors can view all scores" ON assessment_scores;
CREATE POLICY "Counselors can view all scores" ON assessment_scores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('counselor', 'admin')
        )
    );

DROP POLICY IF EXISTS "Counselors can view all recommendations" ON assessment_recommendations;
CREATE POLICY "Counselors can view all recommendations" ON assessment_recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('counselor', 'admin')
        )
    );

DROP POLICY IF EXISTS "Counselors can view all trends" ON wellbeing_trends;
CREATE POLICY "Counselors can view all trends" ON wellbeing_trends
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('counselor', 'admin')
        )
    );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_wellbeing_sessions_updated_at ON wellbeing_sessions;
CREATE TRIGGER update_wellbeing_sessions_updated_at 
    BEFORE UPDATE ON wellbeing_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user can take assessment (1-week cooldown)
CREATE OR REPLACE FUNCTION can_take_assessment(user_uuid UUID) 
RETURNS BOOLEAN AS $$
DECLARE
    last_assessment_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check if user is a student
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_uuid AND role = 'student'
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Get the most recent completed assessment
    SELECT MAX(completed_at) INTO last_assessment_date
    FROM wellbeing_sessions 
    WHERE user_id = user_uuid 
    AND session_status = 'completed'
    AND completed_at IS NOT NULL;
    
    -- If no previous assessment, allow
    IF last_assessment_date IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Check if 7 days have passed
    RETURN (NOW() - last_assessment_date) >= INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Function to get days until next assessment
CREATE OR REPLACE FUNCTION days_until_next_assessment(user_uuid UUID) 
RETURNS INTEGER AS $$
DECLARE
    last_assessment_date TIMESTAMP WITH TIME ZONE;
    days_remaining INTEGER;
BEGIN
    -- Get the most recent completed assessment
    SELECT MAX(completed_at) INTO last_assessment_date
    FROM wellbeing_sessions 
    WHERE user_id = user_uuid 
    AND session_status = 'completed'
    AND completed_at IS NOT NULL;
    
    -- If no previous assessment, can take immediately
    IF last_assessment_date IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate days remaining
    days_remaining := 7 - EXTRACT(DAY FROM (NOW() - last_assessment_date))::INTEGER;
    
    -- Return 0 if cooldown period has passed
    IF days_remaining <= 0 THEN
        RETURN 0;
    END IF;
    
    RETURN days_remaining;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate overall category based on individual scores
CREATE OR REPLACE FUNCTION calculate_overall_category(
    phq9_score INTEGER DEFAULT NULL,
    gad7_score INTEGER DEFAULT NULL,
    pss10_score INTEGER DEFAULT NULL,
    ghq12_score INTEGER DEFAULT NULL
) RETURNS overall_category AS $$
DECLARE
    crisis_threshold INTEGER := 0;
    high_threshold INTEGER := 0;
    moderate_threshold INTEGER := 0;
BEGIN
    -- Check for crisis indicators (any severe score or safety concerns)
    IF (phq9_score IS NOT NULL AND phq9_score >= 20) OR  -- Severe depression
       (gad7_score IS NOT NULL AND gad7_score >= 15) OR  -- Severe anxiety
       (pss10_score IS NOT NULL AND pss10_score >= 35) OR -- Very high stress
       (ghq12_score IS NOT NULL AND ghq12_score >= 10) THEN -- Probable distress
        RETURN 'CRISIS_ALERT';
    END IF;
    
    -- Count moderate-to-severe scores
    IF phq9_score IS NOT NULL AND phq9_score >= 15 THEN high_threshold := high_threshold + 1; END IF;
    IF gad7_score IS NOT NULL AND gad7_score >= 10 THEN high_threshold := high_threshold + 1; END IF;
    IF pss10_score IS NOT NULL AND pss10_score >= 27 THEN high_threshold := high_threshold + 1; END IF;
    IF ghq12_score IS NOT NULL AND ghq12_score >= 7 THEN high_threshold := high_threshold + 1; END IF;
    
    -- Count mild-to-moderate scores
    IF phq9_score IS NOT NULL AND phq9_score >= 10 THEN moderate_threshold := moderate_threshold + 1; END IF;
    IF gad7_score IS NOT NULL AND gad7_score >= 5 THEN moderate_threshold := moderate_threshold + 1; END IF;
    IF pss10_score IS NOT NULL AND pss10_score >= 20 THEN moderate_threshold := moderate_threshold + 1; END IF;
    IF ghq12_score IS NOT NULL AND ghq12_score >= 4 THEN moderate_threshold := moderate_threshold + 1; END IF;
    
    -- Determine overall category
    IF high_threshold >= 2 THEN
        RETURN 'HIGH';
    ELSIF high_threshold >= 1 OR moderate_threshold >= 3 THEN
        RETURN 'MODERATE';
    ELSE
        RETURN 'LOW';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check for safety flags (suicidal ideation, etc.)
CREATE OR REPLACE FUNCTION check_safety_flag(
    phq9_responses INTEGER[] DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check PHQ-9 question 9 (suicidal ideation) - array index 9 (0-based)
    IF phq9_responses IS NOT NULL AND 
       array_length(phq9_responses, 1) >= 9 AND 
       phq9_responses[9] > 0 THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy access to complete session data
CREATE OR REPLACE VIEW wellbeing_session_summary AS
SELECT 
    ws.id,
    ws.user_id,
    ws.session_status,
    ws.started_at,
    ws.completed_at,
    ws.overall_category,
    ws.safety_flag,
    -- Aggregate scores
    json_object_agg(
        asco.assessment_type, 
        json_build_object(
            'score', asco.raw_score,
            'max_score', asco.max_score,
            'percentage', asco.percentage,
            'category', asco.category,
            'severity_level', asco.severity_level
        )
    ) FILTER (WHERE asco.assessment_type IS NOT NULL) as scores,
    -- Count recommendations by priority
    (SELECT COUNT(*) FROM assessment_recommendations ar WHERE ar.session_id = ws.id AND ar.is_urgent = true) as urgent_recommendations,
    (SELECT COUNT(*) FROM assessment_recommendations ar WHERE ar.session_id = ws.id) as total_recommendations
FROM wellbeing_sessions ws
LEFT JOIN assessment_scores asco ON ws.id = asco.session_id
WHERE ws.session_status = 'completed'
GROUP BY ws.id, ws.user_id, ws.session_status, ws.started_at, ws.completed_at, ws.overall_category, ws.safety_flag;
