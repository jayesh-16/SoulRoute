-- Peer Support System Database Schema
-- Run this script in your Supabase SQL Editor after the main ticket system

-- Create custom enums for peer support
CREATE TYPE forum_category_type AS ENUM ('academic_stress', 'anxiety_depression', 'relationships', 'life_transitions', 'general');
CREATE TYPE post_status AS ENUM ('active', 'locked', 'archived', 'reported');
CREATE TYPE volunteer_status AS ENUM ('active', 'inactive', 'training', 'suspended');
CREATE TYPE connection_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- Forum Categories Table
CREATE TABLE forum_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_type forum_category_type NOT NULL,
    icon TEXT NOT NULL,
    color_class TEXT NOT NULL,
    moderator_ids UUID[] DEFAULT '{}',
    post_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Forum Posts Table
CREATE TABLE forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status post_status DEFAULT 'active' NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_answered BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Forum Replies Table
CREATE TABLE forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Peer Volunteers Table
CREATE TABLE peer_volunteers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL,
    specialization TEXT NOT NULL,
    year_level TEXT NOT NULL,
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    sessions_helped INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    status volunteer_status DEFAULT 'training' NOT NULL,
    training_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);

-- Peer Connections Table
CREATE TABLE peer_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES peer_volunteers(id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending' NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    scheduled_time TIMESTAMPTZ,
    meeting_link TEXT,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Post Likes Table
CREATE TABLE post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure user can only like a post or reply once
    UNIQUE(post_id, user_id),
    UNIQUE(reply_id, user_id),
    -- Ensure either post_id or reply_id is set, but not both
    CHECK ((post_id IS NOT NULL AND reply_id IS NULL) OR (post_id IS NULL AND reply_id IS NOT NULL))
);

-- Reports Table
CREATE TABLE peer_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reported_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    reported_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    moderator_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Forum Categories
CREATE POLICY "Anyone can view active forum categories" ON forum_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" ON forum_categories
    FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for Forum Posts
CREATE POLICY "Anyone can view active posts" ON forum_posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create posts" ON forum_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

CREATE POLICY "Authors can update own posts" ON forum_posts
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authenticated users can manage posts" ON forum_posts
    FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for Forum Replies
CREATE POLICY "Anyone can view replies to active posts" ON forum_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM forum_posts 
            WHERE forum_posts.id = forum_replies.post_id 
            AND forum_posts.status = 'active'
        )
    );

CREATE POLICY "Authenticated users can create replies" ON forum_replies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

CREATE POLICY "Authors can update own replies" ON forum_replies
    FOR UPDATE USING (author_id = auth.uid());

-- RLS Policies for Peer Volunteers
CREATE POLICY "Anyone can view active volunteers" ON peer_volunteers
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage own volunteer profile" ON peer_volunteers
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can manage volunteers" ON peer_volunteers
    FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for Peer Connections
CREATE POLICY "Users can view own connections" ON peer_connections
    FOR SELECT USING (
        student_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM peer_volunteers 
            WHERE peer_volunteers.id = peer_connections.volunteer_id 
            AND peer_volunteers.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can create connections" ON peer_connections
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND student_id = auth.uid());

CREATE POLICY "Participants can update connections" ON peer_connections
    FOR UPDATE USING (
        student_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM peer_volunteers 
            WHERE peer_volunteers.id = peer_connections.volunteer_id 
            AND peer_volunteers.user_id = auth.uid()
        )
    );

-- RLS Policies for Post Likes
CREATE POLICY "Users can view all likes" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON post_likes
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for Reports
CREATE POLICY "Users can view own reports" ON peer_reports
    FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Users can create reports" ON peer_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

CREATE POLICY "Authenticated users can manage reports" ON peer_reports
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_status ON forum_posts(status);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX idx_peer_connections_student_id ON peer_connections(student_id);
CREATE INDEX idx_peer_connections_volunteer_id ON peer_connections(volunteer_id);
CREATE INDEX idx_peer_volunteers_user_id ON peer_volunteers(user_id);
CREATE INDEX idx_peer_volunteers_status ON peer_volunteers(status);

-- Insert default forum categories
INSERT INTO forum_categories (title, description, category_type, icon, color_class, moderator_ids) VALUES
('Academic Stress & Pressure', 'Support for exam anxiety, academic workload, and study challenges', 'academic_stress', 'BookOpen', 'bg-blue-100 text-blue-600', '{}'),
('Anxiety & Depression', 'Peer support for mental health challenges and coping strategies', 'anxiety_depression', 'Heart', 'bg-red-100 text-red-600', '{}'),
('Relationship Issues', 'Support for friendship, family, and romantic relationship concerns', 'relationships', 'Users', 'bg-green-100 text-green-600', '{}'),
('Life Transitions', 'Adjusting to college life, career changes, and major life events', 'life_transitions', 'Calendar', 'bg-purple-100 text-purple-600', '{}');

-- Functions to update counters
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update category post count
        UPDATE forum_categories 
        SET post_count = post_count + 1,
            updated_at = NOW()
        WHERE id = NEW.category_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update category post count
        UPDATE forum_categories 
        SET post_count = GREATEST(post_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.category_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_reply_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update post reply count and last activity
        UPDATE forum_posts 
        SET reply_count = reply_count + 1,
            last_activity_at = NOW(),
            updated_at = NOW()
        WHERE id = NEW.post_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update post reply count
        UPDATE forum_posts 
        SET reply_count = GREATEST(reply_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.post_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            -- Update post like count
            UPDATE forum_posts 
            SET like_count = like_count + 1,
                updated_at = NOW()
            WHERE id = NEW.post_id;
        ELSIF NEW.reply_id IS NOT NULL THEN
            -- Update reply like count
            UPDATE forum_replies 
            SET like_count = like_count + 1,
                updated_at = NOW()
            WHERE id = NEW.reply_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            -- Update post like count
            UPDATE forum_posts 
            SET like_count = GREATEST(like_count - 1, 0),
                updated_at = NOW()
            WHERE id = OLD.post_id;
        ELSIF OLD.reply_id IS NOT NULL THEN
            -- Update reply like count
            UPDATE forum_replies 
            SET like_count = GREATEST(like_count - 1, 0),
                updated_at = NOW()
            WHERE id = OLD.reply_id;
        END IF;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_post_counts
    AFTER INSERT OR DELETE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER trigger_update_reply_counts
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_reply_counts();

CREATE TRIGGER trigger_update_like_counts
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_like_counts();
