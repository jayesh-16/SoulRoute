# Setup Instructions for Enhanced Ticket System

## Prerequisites

- Supabase project
- Next.js application with Supabase integration
- Database access credentials

## Database Setup

1. **Apply the new schema:**

   - Copy the contents of `database/ticket_system_with_chat.sql`
   - Paste and run it in your Supabase SQL Editor

2. **Verify the tables were created:**

   ```sql
   -- Check if tables exist
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('support_tickets', 'ticket_messages');

   -- Check if enums were created
   SELECT typname
   FROM pg_type
   WHERE typname IN ('ticket_status', 'ticket_category', 'ticket_urgency', 'session_mode');
   ```

## Application Setup

1. **Deploy updated files:**

   - Copy `lib/actions/tickets.ts` to your project
   - Copy `app/tickets/page.tsx` to your project
   - Make sure all imports are correctly resolved

2. **Install dependencies (if not already installed):**
   ```bash
   npm install lucide-react framer-motion @hookform/resolvers zod
   ```

## Testing the Implementation

1. **Test as a Student:**

   - Create a new ticket
   - Verify ticket appears in the list
   - Check that only appropriate actions are visible
   - Test chat functionality

2. **Test as a Counselor:**

   - Claim an open ticket
   - Unclaim a claimed ticket
   - Schedule a session with Google Meet link
   - Close a ticket
   - Communicate with student via chat

3. **Test as an Admin:**
   - View all tickets
   - Close tickets
   - Verify proper access controls

## Troubleshooting

### Common Issues:

1. **Database Errors:**

   - Ensure the `users` table exists with proper columns
   - Check that foreign key relationships are correctly defined
   - Verify RLS policies are applied

2. **Authentication Issues:**

   - Confirm Supabase client is properly configured
   - Check environment variables for Supabase URL and keys
   - Ensure users have proper roles assigned

3. **UI Issues:**
   - Verify all components are imported correctly
   - Check that Tailwind CSS is properly configured
   - Ensure all icons are available from lucide-react

### Useful Queries for Debugging:

```sql
-- Check ticket data
SELECT * FROM support_tickets LIMIT 5;

-- Check message data
SELECT * FROM ticket_messages LIMIT 5;

-- Check user roles
SELECT id, email, role, approval_status FROM users LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policy WHERE polname LIKE '%ticket%';
```

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Notes

- All database operations use Row Level Security
- Users can only access data they're authorized to view
- Messages are isolated to specific tickets
- Proper input validation is implemented on both client and server

## Performance Considerations

- Indexes are created on frequently queried columns
- Pagination can be added for large datasets
- Consider adding caching for frequently accessed data
