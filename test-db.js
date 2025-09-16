const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test if we can connect to the database
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection failed:', error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Users table exists');
    
    // Test if support_tickets table exists
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('count()', { count: 'exact', head: true });
    
    if (ticketsError) {
      console.error('support_tickets table does not exist or is not accessible:', ticketsError);
    } else {
      console.log('support_tickets table exists');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();