# Ticket System for SoulRoute

## Overview

The ticket system replaces the traditional booking system with a more flexible and efficient approach to connecting students with counselors. Students create support tickets describing their needs, and counselors can claim tickets based on their expertise and availability.

## Key Features

### 🎫 For Students

- **Create Support Tickets**: Submit detailed requests for counseling sessions
- **Priority Levels**: Set urgency from low priority to crisis
- **Session Preferences**: Choose between video, audio, chat, or in-person sessions
- **Category Selection**: Specify concern types (anxiety, depression, stress, etc.)
- **Real-time Updates**: Track ticket status from open to scheduled

### 👨‍⚕️ For Counselors

- **Claim System**: Browse and claim tickets that match their expertise
- **Flexible Scheduling**: Set session times after claiming tickets
- **Meeting Links**: Provide video/audio session links automatically
- **Workload Management**: Control how many tickets to handle

### 🔐 Security & Privacy

- **Row Level Security**: Database-level access control
- **Role-based Permissions**: Students, counselors, and admins have appropriate access
- **Confidential Information**: All ticket details are private and secure

## Database Schema

### Support Tickets Table

```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    counselor_id UUID NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category ticket_category NOT NULL,
    urgency ticket_urgency NOT NULL,
    status ticket_status DEFAULT 'open',
    session_mode session_mode NOT NULL,
    scheduled_time TIMESTAMPTZ NULL,
    meeting_link TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Custom Enums

- **ticket_category**: anxiety, depression, stress, relationships, academic, other
- **ticket_urgency**: low, medium, high, crisis
- **ticket_status**: open, claimed, scheduled, completed, closed
- **session_mode**: video, audio, chat, in-person

## Workflow

### Student Journey

1. **Create Ticket**: Fill out form with concern details, urgency, and preferences
2. **Wait for Claim**: Ticket becomes visible to qualified counselors
3. **Get Notification**: Receive update when counselor claims ticket
4. **Session Scheduled**: Counselor sets time and provides meeting details
5. **Attend Session**: Join via provided link or meet in-person

### Counselor Journey

1. **Browse Tickets**: View open tickets matching their expertise
2. **Claim Ticket**: Take ownership of a student's request
3. **Schedule Session**: Set convenient time for both parties
4. **Provide Access**: Generate meeting links for virtual sessions
5. **Conduct Session**: Meet with student via chosen mode

### Admin Oversight

- **Full Visibility**: Monitor all tickets across the system
- **Crisis Management**: Immediate access to high-priority tickets
- **Analytics**: Track response times and counselor workload
- **Quality Control**: Ensure proper handling of student requests

## API Actions

### `createTicket(formData)`

Creates a new support ticket for the authenticated student.

### `claimTicket(ticketId)`

Allows counselors to claim ownership of an open ticket.

### `scheduleSession(ticketId, scheduledTime, meetingLink?)`

Enables counselors to schedule sessions and provide meeting details.

### `getTickets()`

Retrieves tickets based on user role:

- Students: Their own tickets
- Counselors: Open tickets + their claimed tickets
- Admins: All tickets

## UI Components

### Ticket Card

- **Dynamic Layouts**: Irregular grid patterns for visual interest
- **Status Badges**: Color-coded priority and status indicators
- **Session Icons**: Visual representation of preferred meeting mode
- **Action Buttons**: Context-sensitive options (claim, schedule, join)

### Create Ticket Form

- **Form Validation**: Zod schema validation for data integrity
- **Category Selection**: Dropdown for concern types
- **Urgency Levels**: Visual indicators for priority
- **Session Preferences**: Options for meeting format

### Navigation Updates

- **Sidebar**: Ticket icon replaces calendar/booking references
- **Breadcrumbs**: Updated paths from /booking to /tickets
- **Menu Items**: Consistent labeling across all pages

## Setup Instructions

### 1. Database Setup

Run one of the SQL scripts to create necessary tables and policies:

**Option A: Simple Setup (Recommended)**

```bash
# Execute the simple setup script (no complex triggers)
psql -f database/simple_ticket_setup.sql
```

**Option B: Full Setup (Advanced)**

```bash
# Execute the full setup script with all features
psql -f database/create_ticket_system_fixed.sql
```

**Note**: If you encounter the error "missing FROM-clause entry for table 'old'", use the simple setup script instead.

### 2. Environment Variables

Ensure Supabase credentials are properly configured:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Navigation Updates

All navigation components have been updated to reference `/tickets` instead of `/booking`.

## Benefits Over Traditional Booking

### ✅ Advantages

- **Better Matching**: Counselors choose tickets they're qualified for
- **Flexible Timing**: No rigid appointment slots
- **Detailed Context**: Students provide comprehensive concern descriptions
- **Crisis Prioritization**: Urgent cases get immediate attention
- **Reduced No-shows**: Students are more invested when counselors claim their specific request

### 🔄 Migration Path

The old booking system (`/booking`) remains available during transition. Once confirmed working, the booking route can be deprecated.

## Future Enhancements

### Planned Features

- **Automatic Matching**: AI-based counselor-ticket matching
- **Real-time Notifications**: Push notifications for status updates
- **Session Notes**: Post-session documentation system
- **Recurring Sessions**: Option for ongoing counseling relationships
- **Rating System**: Student feedback on counselor interactions

### Integration Opportunities

- **Calendar Systems**: Sync with external calendar applications
- **Communication Tools**: Integrated chat and video calling
- **Analytics Dashboard**: Detailed reporting for administrators
- **Mobile App**: Native mobile experience for ticket management

## Technical Notes

### Performance Optimizations

- **Database Indexes**: Optimized queries for ticket filtering
- **Row Level Security**: Database-level access control
- **Caching Strategy**: Server-side caching for frequently accessed data
- **Real-time Updates**: Supabase subscriptions for live status changes

### Error Handling

- **Form Validation**: Client and server-side validation
- **Network Resilience**: Graceful handling of connection issues
- **User Feedback**: Clear error messages and success notifications
- **Fallback UI**: Degraded experience when features unavailable

This ticket system provides a more personalized, efficient, and secure way for students to connect with mental health counselors while maintaining the professional quality and privacy standards required for mental health services.
