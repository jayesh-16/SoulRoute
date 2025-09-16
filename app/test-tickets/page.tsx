"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';

export default function TestTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!currentUser) throw new Error('Not authenticated');
        
        setUser(currentUser);
        
        // Check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (userError) {
          console.error('User error:', userError);
          throw new Error('User not found in users table');
        }
        
        console.log('User data:', userData);
        
        // Try to fetch tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*');
        
        if (ticketsError) {
          console.error('Tickets error:', ticketsError);
          throw ticketsError;
        }
        
        setTickets(ticketsData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-800 mb-4">{error}</p>
          <pre className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            {JSON.stringify(tickets, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Tickets Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">User Info</h2>
          <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tickets ({tickets.length})</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-600">No tickets found</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Status: {ticket.status}</span>
                    <span>Urgency: {ticket.urgency}</span>
                    <span>Category: {ticket.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}