"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';

export default function TestUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('Not authenticated');
        
        setCurrentUser(user);
        
        // Try to fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) {
          console.error('Users error:', usersError);
          throw usersError;
        }
        
        setUsers(usersData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchUsers();
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Users Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Current User</h2>
          <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Users ({users.length})</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{user.first_name} {user.last_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Role: {user.role}</span>
                    <span>Status: {user.approval_status}</span>
                    <span>ID: {user.id}</span>
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