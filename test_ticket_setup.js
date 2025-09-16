// Test script to verify ticket system setup
// Run this in a Node.js environment with Supabase client installed

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSetup() {
  console.log('Testing Ticket System Setup...');
  
  // Test 1: Check if tables exist
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ support_tickets table not accessible:', error.message);
    } else {
      console.log('✅ support_tickets table exists and accessible');
    }
  } catch (err) {
    console.log('❌ Error accessing support_tickets table:', err.message);
  }
  
  try {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ ticket_messages table not accessible:', error.message);
    } else {
      console.log('✅ ticket_messages table exists and accessible');
    }
  } catch (err) {
    console.log('❌ Error accessing ticket_messages table:', err.message);
  }
  
  // Test 2: Check if enums exist
  try {
    const { data, error } = await supabase
      .rpc('get_enums')
      .ilike('typname', '%ticket%');
    
    if (error) {
      console.log('❌ Error checking enums:', error.message);
    } else {
      const hasTicketStatus = data.some(e => e.typname === 'ticket_status');
      const hasTicketCategory = data.some(e => e.typname === 'ticket_category');
      const hasTicketUrgency = data.some(e => e.typname === 'ticket_urgency');
      const hasSessionMode = data.some(e => e.typname === 'session_mode');
      
      console.log(hasTicketStatus ? '✅ ticket_status enum exists' : '❌ ticket_status enum missing');
      console.log(hasTicketCategory ? '✅ ticket_category enum exists' : '❌ ticket_category enum missing');
      console.log(hasTicketUrgency ? '✅ ticket_urgency enum exists' : '❌ ticket_urgency enum missing');
      console.log(hasSessionMode ? '✅ session_mode enum exists' : '❌ session_mode enum missing');
    }
  } catch (err) {
    console.log('❌ Error checking enums:', err.message);
  }
  
  // Test 3: Check RLS policies
  try {
    const { data, error } = await supabase
      .rpc('get_policies')
      .ilike('tablename', '%ticket%');
    
    if (error) {
      console.log('❌ Error checking RLS policies:', error.message);
    } else {
      const ticketPolicies = data.filter(p => p.tablename === 'support_tickets');
      const messagePolicies = data.filter(p => p.tablename === 'ticket_messages');
      
      console.log(`✅ Found ${ticketPolicies.length} policies for support_tickets`);
      console.log(`✅ Found ${messagePolicies.length} policies for ticket_messages`);
    }
  } catch (err) {
    console.log('❌ Error checking RLS policies:', err.message);
  }
  
  console.log('Test completed.');
}

// Helper function to get enums (you would need to create this RPC in Supabase)
// This is just for illustration - you would need to create the actual RPC function
supabase.rpc = function(name, params = {}) {
  if (name === 'get_enums') {
    return supabase
      .from('pg_type')
      .select('typname')
      .ilike('typname', params.typname || '%');
  }
  
  if (name === 'get_policies') {
    return supabase
      .from('pg_policy')
      .select('tablename, policyname')
      .ilike('tablename', params.tablename || '%');
  }
  
  return supabase.rpc(name, params);
};

// Run the test
testSetup().catch(console.error);