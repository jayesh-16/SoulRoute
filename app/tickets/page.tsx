"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Clock,
  Shield,
  UserCheck,
  User,
  CheckCircle,
  Video,
  Users,
  BookOpen,
  Plus,
  AlertTriangle,
  Calendar as CalendarIcon,
  ExternalLink,
  MessageCircle,
  Mic,
  MapPin,
  TicketIcon,
  Search,
  Filter,
  X,
  Eye,
  XCircle,
  RotateCcw,
  Send
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { RoleBasedSidebar } from "@/components/role-based-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTicket, claimTicket, unclaimTicket, scheduleSession, closeTicket, sendMessage, getTicketMessages, getTickets } from "@/lib/actions/tickets";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";

// Validation Schema
const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(['anxiety', 'depression', 'stress', 'relationships', 'academic', 'other']),
  urgency: z.enum(['low', 'medium', 'high', 'crisis']),
  session_mode: z.enum(['video', 'audio', 'chat', 'in-person'])
});

type TicketFormData = z.infer<typeof ticketSchema>;

// Message Schema
const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty")
});

type MessageFormData = z.infer<typeof messageSchema>;


export default function TicketsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'claimed' | 'scheduled'>('all');
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [activeChatTicket, setActiveChatTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user role first
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          setUserRole(userData.role);
        }
      }
      
      const ticketData = await getTickets();
      setTickets(ticketData);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to load tickets:', error);
      setError(`Failed to load tickets: ${error.message || error}`);
      setLoading(false);
    }
  };

  const loadMessages = async (ticketId: string) => {
    try {
      const messageData = await getTicketMessages(ticketId);
      setMessages(messageData);
      setActiveChatTicket(ticketId);
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      setError(`Failed to load messages: ${error.message || error}`);
    }
  };

  const handleCreateTicket = async (data: TicketFormData) => {
    try {
      await createTicket(data);
      setShowCreateForm(false);
      loadTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Failed to create ticket');
    }
  };

  const handleClaimTicket = async (ticketId: string) => {
    try {
      await claimTicket(ticketId);
      // Redirect counselor to the chat page for this ticket
      router.push(`/tickets/${ticketId}/chat`);
    } catch (error) {
      console.error('Failed to claim ticket:', error);
      setError('Failed to claim ticket');
    }
  };

  const handleUnclaimTicket = async (ticketId: string) => {
    try {
      await unclaimTicket(ticketId);
      loadTickets();
    } catch (error) {
      console.error('Failed to unclaim ticket:', error);
      setError('Failed to unclaim ticket');
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      await closeTicket(ticketId);
      loadTickets();
    } catch (error) {
      console.error('Failed to close ticket:', error);
      setError('Failed to close ticket');
    }
  };

  const handleScheduleSession = async (ticketId: string) => {
    // Generate a Google Meet link
    const meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`;
    const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    try {
      await scheduleSession(ticketId, scheduledTime, meetingLink);
      loadTickets();
    } catch (error) {
      console.error('Failed to schedule session:', error);
      setError('Failed to schedule session');
    }
  };

  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage({ ticket_id: ticketId, message: newMessage });
      setNewMessage('');
      loadMessages(ticketId); // Refresh messages
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesTab = activeTab === 'open' 
      ? ['open', 'claimed', 'scheduled'].includes(ticket.status)
      : ['completed', 'closed'].includes(ticket.status);
    return matchesSearch && matchesStatus && matchesTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <RoleBasedSidebar />
        <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <RoleBasedSidebar />
        <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center max-w-md">
              <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Troubleshooting Steps:</h3>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Ensure you're logged in with an approved account</li>
                  <li>Check that the database tables are properly set up</li>
                  <li>Verify your database connection</li>
                </ul>
              </div>
              <Button onClick={loadTickets} className="bg-blue-600 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */ }
      <RoleBasedSidebar />
      
      {/* Main Content */ }
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        <motion.div 
          className="flex-1 p-4 md:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */ }
          <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                      <TicketIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Support Ticket Center
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Create tickets and connect with counselors • Secure & Confidential</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Badge className="bg-yellow-100 text-yellow-700 border-0 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{filteredTickets.length} {activeTab === 'open' ? 'Open' : 'Closed'}</span>
                    <span className="sm:hidden">{filteredTickets.length}</span>
                  </Badge>
                  {/* Create Ticket button in header for students */}
                  {userRole === 'student' && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-3 sm:px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">New Ticket</span>
                        <span className="sm:hidden">New</span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl">
            {/* Search and Filter Section */ }
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Search & Filter Tickets</h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Find and filter support tickets</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-sm opacity-30 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative bg-white rounded-xl" style={{ 
                        border: '3px solid transparent',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #1e3a8a, #60a5fa, #8b5cf6, #3b82f6)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'content-box, border-box'
                      }}>
                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4 sm:w-5 sm:h-5 z-10" />
                        <Input
                          placeholder="Search for tickets by title or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-0 bg-transparent rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800 placeholder-gray-500 font-medium text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                        <Button
                          variant={filterStatus === 'all' ? 'default' : 'ghost'}
                          onClick={() => setFilterStatus('all')}
                          className={`w-full sm:w-auto rounded-xl px-4 sm:px-6 py-3 sm:py-3 font-semibold transition-all duration-300 shadow-md text-sm sm:text-base ${
                            filterStatus === 'all' 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-2 border-blue-500 transform scale-105' 
                              : 'border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg'
                          }`}
                        >
                          <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">All Tickets</span>
                          <span className="sm:hidden">All</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                        <Button
                          variant={filterStatus === 'open' ? 'default' : 'ghost'}
                          onClick={() => setFilterStatus('open')}
                          className={`w-full sm:w-auto rounded-xl px-4 sm:px-6 py-3 sm:py-3 font-semibold transition-all duration-300 shadow-md text-sm sm:text-base ${
                            filterStatus === 'open' 
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg border-2 border-green-500 transform scale-105' 
                              : 'border-2 border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50 hover:shadow-lg'
                          }`}
                        >
                          <TicketIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Open
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                        <Button
                          variant={filterStatus === 'claimed' ? 'default' : 'ghost'}
                          onClick={() => setFilterStatus('claimed')}
                          className={`w-full sm:w-auto rounded-xl px-4 sm:px-6 py-3 sm:py-3 font-semibold transition-all duration-300 shadow-md text-sm sm:text-base ${
                            filterStatus === 'claimed' 
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border-2 border-purple-500 transform scale-105' 
                              : 'border-2 border-purple-200 text-purple-600 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg'
                          }`}
                        >
                          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Claimed
                        </Button>
                      </motion.div>
                    </div>
                    {/* Only show Create Ticket button to students */}
                    {userRole === 'student' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => setShowCreateForm(true)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base"
                        >
                          <Plus className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Create Ticket</span>
                          <span className="sm:hidden">Create</span>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subnavbar for Open/Closed Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('open')}
                      className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-all duration-300 text-sm sm:text-base ${
                        activeTab === 'open'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <TicketIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />
                      <span className="hidden sm:inline">Open Tickets ({filteredTickets.filter(t => ['open', 'claimed', 'scheduled'].includes(t.status)).length})</span>
                      <span className="sm:hidden">Open ({filteredTickets.filter(t => ['open', 'claimed', 'scheduled'].includes(t.status)).length})</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('closed')}
                      className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-all duration-300 text-sm sm:text-base ${
                        activeTab === 'closed'
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />
                      <span className="hidden sm:inline">Closed Tickets ({filteredTickets.filter(t => ['completed', 'closed'].includes(t.status)).length})</span>
                      <span className="sm:hidden">Closed ({filteredTickets.filter(t => ['completed', 'closed'].includes(t.status)).length})</span>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Counter */ }
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Showing <span className="font-bold text-blue-600">{filteredTickets.length}</span> {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
                    {searchTerm && (
                      <span className="ml-1">
                        for "<span className="font-semibold text-gray-800">{searchTerm}</span>"
                      </span>
                    )}
                    {filterStatus !== 'all' && (
                      <span className="ml-1">
                        with <span className="font-semibold text-gray-800 capitalize">{filterStatus}</span> status
                      </span>
                    )}
                  </p>
                </div>
                {filteredTickets.length > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    Requires Action
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Tickets Grid */ }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <TicketCard 
                    ticket={ticket} 
                    userRole={userRole}
                    onClaim={handleClaimTicket}
                    onUnclaim={handleUnclaimTicket}
                    onSchedule={handleScheduleSession}
                    onClose={handleCloseTicket}
                    onOpenChat={loadMessages}
                    formatDate={formatDate}
                    router={router}
                  />
                </motion.div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-8 sm:py-12"
              >
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                  <CardContent className="p-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No tickets found</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Create your first support ticket to get started'}
                    </p>
                    {/* Only show Create Ticket button to students */}
                    {!searchTerm && userRole === 'student' && (
                      <Button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        Create Ticket
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Create Ticket Modal */ }
      {showCreateForm && (
        <CreateTicketForm 
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {/* Chat Modal */ }
      {activeChatTicket && (
        <ChatModal 
          ticket={tickets.find(t => t.id === activeChatTicket)}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          onClose={() => setActiveChatTicket(null)}
          formatDate={formatDate}
        />
      )}

      {/* Floating Create Ticket Button for Students */}
      {userRole === 'student' && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.5 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            </motion.div>
          </Button>
          
          {/* Tooltip */}
          <motion.div
            className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            initial={{ x: 10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
          >
            Create New Ticket
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Ticket Card Component
const TicketCard = ({ ticket, userRole, onClaim, onUnclaim, onSchedule, onClose, onOpenChat, formatDate, router }: { 
  ticket: any; 
  userRole: string;
  onClaim: (ticketId: string) => void;
  onUnclaim: (ticketId: string) => void;
  onSchedule: (ticketId: string) => void;
  onClose: (ticketId: string) => void;
  onOpenChat: (ticketId: string) => void;
  formatDate: (dateString: string) => string;
  router: any;
}) => {
  // Urgency Badge Component
  const UrgencyBadge = ({ urgency }: { urgency: string }) => {
    const urgencyConfig = {
      low: { color: "bg-green-100 text-green-800", label: "Low Priority" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium Priority" },
      high: { color: "bg-orange-100 text-orange-800", label: "High Priority" },
      crisis: { color: "bg-red-100 text-red-800", label: "Crisis" }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.low;

    return (
      <Badge className={`${config.color} rounded-full px-3 py-1`}>
        {urgency === 'crisis' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      open: { color: "bg-blue-100 text-blue-800", label: "Open" },
      claimed: { color: "bg-purple-100 text-purple-800", label: "Claimed" },
      scheduled: { color: "bg-indigo-100 text-indigo-800", label: "Scheduled" },
      in_progress: { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      closed: { color: "bg-gray-100 text-gray-800", label: "Closed" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;

    return (
      <Badge className={`${config.color} rounded-full px-3 py-1`}>
        {config.label}
      </Badge>
    );
  };

  // Session Mode Icon Component
  const SessionModeIcon = ({ mode }: { mode: string }) => {
    const icons = {
      video: Video,
      audio: Mic,
      chat: MessageCircle,
      'in-person': MapPin
    };

    const Icon = icons[mode as keyof typeof icons] || Video;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              ticket.urgency === 'crisis' 
                ? 'bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300' 
                : ticket.urgency === 'high'
                ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300'
                : ticket.urgency === 'medium'
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300'
                : 'bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300'
            }`}>
              {ticket.urgency === 'crisis' && <AlertTriangle className="w-6 h-6 text-red-600" />}
              {ticket.urgency === 'high' && <AlertTriangle className="w-6 h-6 text-orange-600" />}
              {ticket.urgency === 'medium' && <Clock className="w-6 h-6 text-yellow-600" />}
              {ticket.urgency === 'low' && <CheckCircle className="w-6 h-6 text-green-600" />}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {ticket.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={ticket.status} />
                <UrgencyBadge urgency={ticket.urgency} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">{ticket.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <SessionModeIcon mode={ticket.session_mode} />
            <span className="capitalize">{ticket.session_mode}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(ticket.created_at)}</span>
          </div>
        </div>

        {ticket.scheduled_time && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                {formatDate(ticket.scheduled_time)}
              </span>
            </div>
            {ticket.meeting_link && (
              <a 
                href={ticket.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Join Session</span>
              </a>
            )}
          </div>
        )}

        {/* Show claim button only to counselors when ticket is open */ }
        {userRole === 'counselor' && ticket.status === 'open' && (
          <div className="pt-4">
            <Button
              onClick={() => onClaim(ticket.id)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Claim Ticket
            </Button>
          </div>
        )}

        {/* Show unclaim and schedule buttons only to counselors when ticket is claimed */ }
        {userRole === 'counselor' && ticket.status === 'claimed' && ticket.counselor_id && (
          <div className="pt-4 space-y-3">
            <Button
              onClick={() => onUnclaim(ticket.id)}
              variant="ghost"
              className="w-full border border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Unclaim Ticket
            </Button>
            <Button
              onClick={() => router.push(`/tickets/${ticket.id}/chat`)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with Student
            </Button>
            <Button
              onClick={() => onSchedule(ticket.id)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        )}

        {/* Show close button for counselors when ticket is scheduled */ }
        {userRole === 'counselor' && ticket.status === 'scheduled' && (
          <div className="pt-4">
            <Button
              onClick={() => onClose(ticket.id)}
              variant="ghost"
              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Close Ticket
            </Button>
          </div>
        )}

        {/* Show waiting message for students when ticket is not yet claimed */ }
        {userRole === 'student' && ticket.status === 'open' && (
          <div className="pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-yellow-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Yet to be claimed</span>
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                Someone will get with you soon 🙏
              </p>
            </div>
          </div>
        )}

        {/* Show claimed message for students when ticket is claimed but not scheduled */ }
        {userRole === 'student' && ticket.status === 'claimed' && (
          <div className="pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <UserCheck className="w-5 h-5" />
                <span className="font-medium">Ticket Claimed</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                A counselor will schedule a session with you soon ✨
              </p>
              <Button 
                onClick={() => router.push(`/tickets/${ticket.id}/chat`)}
                className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Counselor
              </Button>
            </div>
          </div>
        )}

        {/* Show scheduled message for students when ticket is scheduled */ }
        {userRole === 'student' && ticket.status === 'scheduled' && (
          <div className="pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CalendarIcon className="w-5 h-5" />
                <span className="font-medium">Session Scheduled</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your session is scheduled. Check the details above.
              </p>
              <Button 
                onClick={() => router.push(`/tickets/${ticket.id}/chat`)}
                className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View Session Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Chat Modal Component
const ChatModal = ({ ticket, messages, newMessage, setNewMessage, onSendMessage, onClose, formatDate }: { 
  ticket: any;
  messages: any[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (ticketId: string) => void;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col"
        style={{ border: '12px solid', borderImageSource: 'linear-gradient(to right, #1e3a8a, #60a5fa)', borderImageSlice: 1 }}
      >
        {/* Header */ }
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Chat for Ticket</h3>
            <p className="text-sm text-gray-500">{ticket.title}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Container */ }
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}>
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {message.sender?.first_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.sender?.first_name} {message.sender?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.created_at)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {message.sender?.role}
                  </Badge>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-800">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */ }
        <div className="flex items-center space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage(ticket.id);
              }
            }}
          />
          <Button 
            onClick={() => onSendMessage(ticket.id)}
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Create Ticket Form Component
const CreateTicketForm = ({ onClose, onSubmit }: { 
  onClose: () => void; 
  onSubmit: (data: TicketFormData) => void; 
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema)
  });

  const handleFormSubmit = async (data: TicketFormData) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
        style={{ border: '12px solid', borderImageSource: 'linear-gradient(to right, #1e3a8a, #60a5fa)', borderImageSlice: 1 }}
      >
        {/* Close button */ }
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
          type="button"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Support Ticket</h2>
          <p className="text-gray-600">Describe your concern and we'll connect you with the right counselor.</p>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */ }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              {...register('title')}
              placeholder="Brief description of your concern"
              className="rounded-xl w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */ }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              {...register('description')}
              placeholder="Please provide more details about what you're experiencing..."
              rows={4}
              className="rounded-xl w-full resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category and Urgency */ }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select onValueChange={(value) => setValue('category', value as 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other')}>
                <SelectTrigger className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="depression">Depression</SelectItem>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency *
              </label>
              <Select onValueChange={(value) => setValue('urgency', value as 'low' | 'medium' | 'high' | 'crisis')}>
                <SelectTrigger className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="crisis">Crisis - Immediate Help Needed</SelectItem>
                </SelectContent>
              </Select>
              {errors.urgency && (
                <p className="text-red-500 text-sm mt-1">{errors.urgency.message}</p>
              )}
            </div>
          </div>

          {/* Session Mode */ }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Session Mode *
            </label>
            <Select onValueChange={(value) => setValue('session_mode', value as 'video' | 'audio' | 'chat' | 'in-person')}>
              <SelectTrigger className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900">
                <SelectValue placeholder="How would you like to meet?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="audio">Audio Call</SelectItem>
                <SelectItem value="chat">Text Chat</SelectItem>
                <SelectItem value="in-person">In-Person Meeting</SelectItem>
              </SelectContent>
            </Select>
            {errors.session_mode && (
              <p className="text-red-500 text-sm mt-1">{errors.session_mode.message}</p>
            )}
          </div>

          {/* Form Actions */ }
          <div className="flex space-x-4 pt-6">
            <Button 
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="flex-1 rounded-full border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};