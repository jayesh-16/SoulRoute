import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated', authError }, { status: 401 });
    }
    
    // Check if support_tickets table exists by querying it
    const { data: tickets, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('count()', { count: 'exact', head: true });
    
    if (ticketsError) {
      return NextResponse.json({ 
        error: 'Failed to query support_tickets table', 
        details: ticketsError.message,
        code: ticketsError.code
      }, { status: 500 });
    }
    
    // Get user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, approval_status')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      return NextResponse.json({ 
        error: 'Failed to fetch user data', 
        details: userError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Database connection successful', 
      user: {
        id: user.id,
        email: user.email,
        role: userData?.role,
        approval_status: userData?.approval_status
      },
      ticketCount: tickets?.length || 0
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}