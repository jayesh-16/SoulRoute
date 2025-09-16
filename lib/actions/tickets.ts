"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Add debugging function
const debugLog = (message: string, data?: any) => {
  console.log(`[Tickets Actions] ${message}`, data || '');
};

export type TicketFormData = {
  title: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  session_mode: 'video' | 'audio' | 'chat' | 'in-person';
};

export type MessageFormData = {
  ticket_id: string;
  message: string;
};

export async function createTicket(formData: TicketFormData) {
  debugLog("createTicket called with data:", formData);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  debugLog("User from auth:", user);
  
  if (!user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Verify user is a student and approved
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, approval_status')
    .eq('id', user.id)
    .single();

  debugLog("User data fetch result:", { userData, userError });

  if (userError) {
    console.error('Error fetching user data:', userError);
    throw new Error('Failed to verify user: ' + userError.message);
  }

  if (userData.role !== 'student') {
    throw new Error('Only students can create tickets');
  }

  if (userData.approval_status !== 'approved') {
    throw new Error('User account is not approved');
  }

  const { error } = await supabase
    .from('support_tickets')
    .insert({
      student_id: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      urgency: formData.urgency,
      session_mode: formData.session_mode,
      status: 'open'
    });

  debugLog("Ticket insert result:", error);

  if (error) {
    console.error('Error creating ticket:', error);
    throw new Error('Failed to create ticket: ' + error.message);
  }

  revalidatePath('/tickets');
  debugLog("Ticket created successfully");
  return { success: true };
}

export async function claimTicket(ticketId: string) {
  debugLog("claimTicket called with ticketId:", ticketId);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  debugLog("User from auth:", user);
  
  if (!user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Check if user is a counselor
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  debugLog("User data fetch result:", { userData, userError });

  if (userError) {
    console.error('Error fetching user role:', userError);
    throw new Error('Failed to fetch user role');
  }

  if (userData?.role !== 'counselor') {
    throw new Error('Only counselors can claim tickets');
  }

  const { error } = await supabase
    .from('support_tickets')
    .update({
      counselor_id: user.id,
      status: 'claimed',
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .eq('status', 'open') // Only allow claiming open tickets
    .is('counselor_id', null); // Ensure ticket is not already claimed

  debugLog("Ticket claim result:", error);

  if (error) {
    console.error('Error claiming ticket:', error);
    throw new Error('Failed to claim ticket: ' + error.message);
  }

  revalidatePath('/tickets');
  revalidatePath('/counselor');
  debugLog("Ticket claimed successfully");
  return { success: true };
}

export async function unclaimTicket(ticketId: string) {
  debugLog("unclaimTicket called with ticketId:", ticketId);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  debugLog("User from auth:", user);
  
  if (!user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Check if user is a counselor
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  debugLog("User data fetch result:", { userData, userError });

  if (userError) {
    console.error('Error fetching user role:', userError);
    throw new Error('Failed to fetch user role');
  }

  if (userData?.role !== 'counselor') {
    throw new Error('Only counselors can unclaim tickets');
  }

  const { error } = await supabase
    .from('support_tickets')
    .update({
      counselor_id: null,
      status: 'open',
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .eq('counselor_id', user.id); // Only allow unclaiming own claimed tickets

  debugLog("Ticket unclaim result:", error);

  if (error) {
    console.error('Error unclaiming ticket:', error);
    throw new Error('Failed to unclaim ticket: ' + error.message);
  }

  revalidatePath('/tickets');
  revalidatePath('/counselor');
  debugLog("Ticket unclaimed successfully");
  return { success: true };
}

export async function closeTicket(ticketId: string) {
  debugLog("closeTicket called with ticketId:", ticketId);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  debugLog("User from auth:", user);
  
  if (!user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Check user role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  debugLog("User data fetch result:", { userData, userError });

  if (userError) {
    console.error('Error fetching user role:', userError);
    throw new Error('Failed to fetch user role');
  }

  // Only counselors or admins can close tickets
  if (userData?.role !== 'counselor' && userData?.role !== 'admin') {
    throw new Error('Only counselors or admins can close tickets');
  }

  const { error } = await supabase
    .from('support_tickets')
    .update({
      status: 'closed',
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .neq('status', 'closed'); // Don't allow closing already closed tickets

  debugLog("Ticket close result:", error);

  if (error) {
    console.error('Error closing ticket:', error);
    throw new Error('Failed to close ticket: ' + error.message);
  }

  revalidatePath('/tickets');
  revalidatePath('/counselor');
  debugLog("Ticket closed successfully");
  return { success: true };
}

export async function scheduleSession(ticketId: string, scheduledTime: string, meetingLink?: string) {
  debugLog("scheduleSession called with:", { ticketId, scheduledTime, meetingLink });
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  debugLog("User from auth:", user);
  
  if (!user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  const { error } = await supabase
    .from('support_tickets')
    .update({
      scheduled_time: scheduledTime,
      meeting_link: meetingLink,
      status: 'scheduled',
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .eq('counselor_id', user.id); // Only the assigned counselor can schedule

  debugLog("Session schedule result:", error);

  if (error) {
    console.error('Error scheduling session:', error);
    throw new Error('Failed to schedule session: ' + error.message);
  }

  revalidatePath('/tickets');
  revalidatePath('/counselor');
  debugLog("Session scheduled successfully");
  return { success: true };
}

export async function sendMessage(formData: MessageFormData) {
  debugLog("sendMessage called with data:", formData);
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  debugLog("User from auth:", { user, authError });
  
  if (authError || !user) {
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Verify user is part of the ticket
  const { data: ticketData, error: ticketError } = await supabase
    .from('support_tickets')
    .select('student_id, counselor_id')
    .eq('id', formData.ticket_id)
    .single();

  debugLog("Ticket data fetch result:", { ticketData, ticketError });

  if (ticketError) {
    console.error('Error fetching ticket:', ticketError);
    throw new Error('Failed to fetch ticket: ' + ticketError.message);
  }

  // Check if user is either the student or counselor for this ticket
  if (user.id !== ticketData.student_id && user.id !== ticketData.counselor_id) {
    throw new Error('You are not authorized to send messages for this ticket');
  }

  const { error } = await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: formData.ticket_id,
      sender_id: user.id,
      message: formData.message
    });

  debugLog("Message insert result:", error);

  if (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message: ' + error.message);
  }

  revalidatePath('/tickets');
  debugLog("Message sent successfully");
  return { success: true };
}

export async function getTicketMessages(ticketId: string) {
  debugLog("getTicketMessages called with ticketId:", ticketId);
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  debugLog("User from auth:", { user, authError });
  
  if (authError || !user) {
    console.error('Auth error:', authError);
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Verify user is part of the ticket
  const { data: ticketData, error: ticketError } = await supabase
    .from('support_tickets')
    .select('student_id, counselor_id')
    .eq('id', ticketId)
    .single();

  debugLog("Ticket data fetch result:", { ticketData, ticketError });

  if (ticketError) {
    console.error('Error fetching ticket:', ticketError);
    throw new Error('Failed to fetch ticket: ' + ticketError.message);
  }

  // Check if user is either the student or counselor for this ticket
  if (user.id !== ticketData.student_id && user.id !== ticketData.counselor_id) {
    throw new Error('You are not authorized to view messages for this ticket');
  }

  // Fetch messages for this ticket
  const { data: messages, error } = await supabase
    .from('ticket_messages')
    .select(`
      id,
      message,
      created_at,
      sender:users(first_name, last_name, role)
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  debugLog("Messages fetch result:", { messages, error });

  if (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages: ' + error.message);
  }

  debugLog("Messages fetched successfully, count:", messages?.length || 0);
  return messages || [];
}

export async function getTickets() {
  debugLog("getTickets called");
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  debugLog("User from auth:", { user, authError });
  
  if (authError || !user) {
    console.error('Auth error:', authError);
    debugLog("No user found, redirecting to login");
    redirect('/login');
  }

  // Get user role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  debugLog("User data fetch result:", { userData, userError });

  if (userError) {
    console.error('Error fetching user role:', userError);
    throw new Error('Failed to fetch user role: ' + userError.message);
  }

  // Fetch tickets with student and counselor information
  // Using separate queries instead of joins to avoid foreign key relationship issues
  let query = supabase
    .from('support_tickets')
    .select('*');

  // Filter based on user role
  if (userData?.role === 'student') {
    query = query.eq('student_id', user.id);
  } else if (userData?.role === 'counselor') {
    // Counselors see all open tickets and their claimed tickets
    query = query.or(`status.eq.open,counselor_id.eq.${user.id}`);
  }
  // Admin sees all tickets by default

  const { data: tickets, error } = await query.order('created_at', { ascending: false });

  debugLog("Tickets fetch result:", { tickets, error });

  if (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Failed to fetch tickets: ' + error.message);
  }

  // If we have tickets, fetch the associated user information separately
  if (tickets && tickets.length > 0) {
    // Get unique student and counselor IDs
    const studentIds = [...new Set(tickets.map(ticket => ticket.student_id).filter(Boolean))];
    const counselorIds = [...new Set(tickets.map(ticket => ticket.counselor_id).filter(Boolean))];
    const allUserIds = [...studentIds, ...counselorIds];

    if (allUserIds.length > 0) {
      // Fetch user information for all students and counselors
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', allUserIds);

      debugLog("Users data fetch result:", { usersData, usersError });

      if (!usersError && usersData) {
        // Create maps for quick lookup
        const userMap = new Map(usersData.map(user => [user.id, user]));

        // Add user information to tickets
        const result = tickets.map(ticket => ({
          ...ticket,
          student: userMap.get(ticket.student_id) || null,
          counselor: ticket.counselor_id ? userMap.get(ticket.counselor_id) || null : null
        }));
        
        debugLog("Tickets with user data prepared, count:", result.length);
        return result;
      }
    }
  }

  debugLog("Tickets fetched successfully, count:", tickets?.length || 0);
  return tickets || [];
}