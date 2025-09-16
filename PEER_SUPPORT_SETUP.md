# Peer Support System Setup Guide

## Overview
The SoulRoute peer support system is now fully implemented with real-time forum functionality, volunteer connections, and comprehensive database integration.

## Features Implemented

### ✅ Core Features
- **Forum Categories**: Pre-defined support categories with moderation
- **Real-time Posts**: Live forum posts with instant updates
- **Volunteer System**: Trained student volunteers with ratings and specializations
- **Connection Requests**: Students can connect with volunteers for 1-on-1 support
- **Post Interactions**: Like/unlike posts and replies
- **Anonymous Posting**: Option to post anonymously for privacy
- **Reporting System**: Content moderation and reporting tools

### ✅ Technical Implementation
- **Database Schema**: Complete PostgreSQL schema with RLS policies
- **Real-time Updates**: Supabase real-time subscriptions for live updates
- **Type Safety**: Full TypeScript integration with proper types
- **UI Components**: Modern, accessible UI with Framer Motion animations
- **Security**: Row Level Security policies for data protection

## Database Setup

### 1. Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Run Database Schema
Execute the peer support schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database/peer_support_schema.sql
-- This will create all necessary tables, functions, and policies
```

### 3. Sample Data (Optional)
To test the system, you can add sample data:

```sql
-- Insert sample forum categories
INSERT INTO forum_categories (title, description, category_type, icon, color_class) VALUES
('Academic Stress & Pressure', 'Support for exam anxiety, academic workload, and study challenges', 'academic', 'BookOpen', 'bg-blue-100 text-blue-600'),
('Anxiety & Depression', 'Peer support for mental health challenges and coping strategies', 'mental_health', 'Heart', 'bg-red-100 text-red-600'),
('Relationship Issues', 'Support for friendship, family, and romantic relationship concerns', 'social', 'Users', 'bg-green-100 text-green-600'),
('Life Transitions', 'Adjusting to college life, career changes, and major life events', 'life_changes', 'Calendar', 'bg-purple-100 text-purple-600');

-- Insert sample volunteer (replace user_id with actual user ID)
INSERT INTO peer_volunteers (user_id, display_name, role, specialization, year_level, bio, rating, sessions_helped, status) VALUES
('your-user-id-here', 'Sarah Kumar', 'Senior Peer Counselor', 'Academic Stress & Time Management', '4th Year Psychology', 'I understand the pressures of academic life and am here to help you develop healthy coping strategies.', 4.9, 156, 'active');
```

## Usage Guide

### For Students

#### Creating Posts
1. Navigate to Peer Support → Forum tab
2. Click "New Post" button
3. Select appropriate category
4. Write your post (option to post anonymously)
5. Submit - post appears instantly for all users

#### Connecting with Volunteers
1. Go to Peer Support → Volunteers tab
2. Browse available volunteers by specialization
3. Click "Connect" on preferred volunteer
4. Fill out connection request form
5. Volunteer will be notified and reach out

#### Engaging with Posts
- Click on any post to view full discussion
- Like posts and replies
- Add your own replies (anonymous option available)
- Report inappropriate content

### For Volunteers

#### Managing Connections
- Receive notifications for new connection requests
- Access student information and support topics
- Schedule meetings and provide ongoing support

#### Forum Moderation
- Monitor posts in specialized categories
- Respond to student questions
- Report concerning content to administrators

## Real-time Features

### Live Updates
- New posts appear instantly without page refresh
- Like counts update in real-time
- Reply notifications for active discussions

### Subscription Management
- Automatic cleanup of real-time subscriptions
- Optimized performance with selective updates
- Error handling for connection issues

## Security & Privacy

### Data Protection
- Row Level Security (RLS) on all tables
- User-based access control
- Anonymous posting options
- Secure volunteer verification

### Content Moderation
- Reporting system for inappropriate content
- Volunteer moderation capabilities
- Admin oversight and controls

## File Structure

```
components/peer-support/
├── create-post-modal.tsx       # New post creation form
├── post-detail-modal.tsx       # Full post view with replies
└── volunteer-connection-modal.tsx # Volunteer connection requests

lib/actions/
└── peer-support.ts            # All database operations

hooks/
└── use-realtime-posts.ts      # Real-time post subscriptions

database/
└── peer_support_schema.sql    # Complete database schema

app/peer-support/
└── page.tsx                   # Main peer support interface
```

## Testing Checklist

### Basic Functionality
- [ ] Forum categories load correctly
- [ ] Can create new posts
- [ ] Posts appear in real-time
- [ ] Can like/unlike posts
- [ ] Anonymous posting works
- [ ] Volunteer list displays
- [ ] Connection requests work

### Real-time Features
- [ ] New posts appear without refresh
- [ ] Like counts update instantly
- [ ] Multiple browser tabs sync
- [ ] Subscription cleanup works

### Security
- [ ] RLS policies prevent unauthorized access
- [ ] Anonymous posts hide user identity
- [ ] Reporting system functions
- [ ] Volunteer verification works

## Troubleshooting

### Common Issues

1. **Posts not loading**: Check Supabase connection and RLS policies
2. **Real-time not working**: Verify WebSocket connection and subscriptions
3. **Permission errors**: Ensure user authentication and proper roles
4. **UI not responsive**: Check Tailwind CSS classes and responsive design

### Debug Steps
1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Test database queries in Supabase SQL editor
4. Validate environment variables

## Next Steps

### Potential Enhancements
- Push notifications for new messages
- Advanced search and filtering
- Volunteer training modules
- Analytics and reporting dashboard
- Mobile app integration
- Crisis intervention protocols

The peer support system is now fully functional and ready for production use. All core features are implemented with proper security, real-time updates, and a modern user interface.
