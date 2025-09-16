-- Seed data for peer support system
-- Run this after the main peer_support_schema.sql

-- Insert forum categories
INSERT INTO forum_categories (title, description, category_type, icon, color_class, is_active) VALUES
('Academic Stress & Pressure', 'Support for exam anxiety, academic workload, and study challenges', 'academic_stress', 'BookOpen', 'bg-blue-100 text-blue-600', true),
('Anxiety & Depression', 'Peer support for mental health challenges and coping strategies', 'anxiety_depression', 'Heart', 'bg-red-100 text-red-600', true),
('Relationship Issues', 'Support for friendship, family, and romantic relationship concerns', 'relationships', 'Users', 'bg-green-100 text-green-600', true),
('Life Transitions', 'Adjusting to college life, career changes, and major life events', 'life_transitions', 'Calendar', 'bg-purple-100 text-purple-600', true),
('General Support', 'General peer support and open discussions', 'general', 'BookOpen', 'bg-gray-100 text-gray-600', true);

-- Note: To add sample volunteers and posts, you'll need actual user IDs from your auth.users table
-- Replace 'sample-user-id' with real user IDs from your system

-- Sample data is commented out to avoid permission errors with fake user IDs
-- Once you have real authenticated users, you can create posts and volunteer profiles through the UI
-- Or uncomment and replace the sample-user-id values with real user IDs from auth.users

-- Function to update post counts (will be called by triggers)
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_categories 
        SET post_count = post_count + 1,
            updated_at = NOW()
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_categories 
        SET post_count = GREATEST(0, post_count - 1),
            updated_at = NOW()
        WHERE id = OLD.category_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update category post counts
DROP TRIGGER IF EXISTS trigger_update_category_post_count ON forum_posts;
CREATE TRIGGER trigger_update_category_post_count
    AFTER INSERT OR DELETE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_category_post_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE forum_posts 
            SET like_count = like_count + 1,
                updated_at = NOW()
            WHERE id = NEW.post_id;
        ELSIF NEW.reply_id IS NOT NULL THEN
            UPDATE forum_replies 
            SET like_count = like_count + 1,
                updated_at = NOW()
            WHERE id = NEW.reply_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE forum_posts 
            SET like_count = GREATEST(0, like_count - 1),
                updated_at = NOW()
            WHERE id = OLD.post_id;
        ELSIF OLD.reply_id IS NOT NULL THEN
            UPDATE forum_replies 
            SET like_count = GREATEST(0, like_count - 1),
                updated_at = NOW()
            WHERE id = OLD.reply_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update like counts
DROP TRIGGER IF EXISTS trigger_update_like_counts ON post_likes;
CREATE TRIGGER trigger_update_like_counts
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_counts();

-- Function to update reply counts
CREATE OR REPLACE FUNCTION update_reply_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_posts 
        SET reply_count = reply_count + 1,
            last_activity_at = NOW(),
            updated_at = NOW()
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_posts 
        SET reply_count = GREATEST(0, reply_count - 1),
            updated_at = NOW()
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update reply counts
DROP TRIGGER IF EXISTS trigger_update_reply_counts ON forum_replies;
CREATE TRIGGER trigger_update_reply_counts
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_reply_counts();

-- Note: RLS policies are already created in the main peer_support_schema.sql file
-- This seed file only adds data and additional functions/triggers

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_last_activity ON forum_posts(last_activity_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON forum_replies(created_at);

CREATE INDEX IF NOT EXISTS idx_peer_volunteers_user_id ON peer_volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_peer_volunteers_status ON peer_volunteers(status);
CREATE INDEX IF NOT EXISTS idx_peer_volunteers_rating ON peer_volunteers(rating DESC);

CREATE INDEX IF NOT EXISTS idx_peer_connections_student_id ON peer_connections(student_id);
CREATE INDEX IF NOT EXISTS idx_peer_connections_volunteer_id ON peer_connections(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_peer_connections_status ON peer_connections(status);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_reply_id ON post_likes(reply_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Success message
SELECT 'Peer support database setup completed successfully!' as message;
