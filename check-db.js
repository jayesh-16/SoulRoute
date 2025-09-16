const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'SET' : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test if we can connect to the database by checking if the users table exists
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('Failed to connect to users table:', error);
      return;
    }
    
    console.log('✓ Successfully connected to users table');
    
    // Test if support_tickets table exists
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('count()', { count: 'exact', head: true });
    
    if (ticketsError) {
      console.error('✗ support_tickets table does not exist or is not accessible:', ticketsError.message);
      console.log('You may need to run the database setup script');
    } else {
      console.log('✓ support_tickets table exists');
    }
    
    // Test if the custom enums exist
    const enumTest = await supabase.rpc('ticket_category', {});
    
    if (enumTest.error) {
      console.log('Enums may not be set up yet');
    } else {
      console.log('Enums are set up');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();