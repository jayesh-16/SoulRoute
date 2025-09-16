"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";
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
  Send,
  Bot,
  MoreVertical,
  Paperclip,
  Smile,
  LogOut
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { getTicketMessages, sendMessage, scheduleSession } from "@/lib/actions/tickets";
import Link from "next/link";
import { RoleBasedSidebar } from "@/components/role-based-sidebar";


export default function TicketChatPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use() to fix the direct access warning
const unwrappedParams = params as { id: string };
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add debugging function
  const debugLog = (message: string, data?: any) => {
    console.log(`[TicketChatPage] ${message}`, data || '');
  };

  useEffect(() => {
    debugLog("Component mounted with ticket ID:", unwrappedParams.id);
    loadTicketData();
    loadMessages();
  }, [unwrappedParams.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadTicketData = async () => {
    debugLog("Starting loadTicketData");
    try {
      const supabase = await createClient();
      debugLog("Supabase client created");
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      debugLog("Auth check result:", { user, authError });
      
      if (authError || !user) {
        debugLog("No user found, redirecting to login");
        router.push('/login');
        return;
      }

      // Get user role
      debugLog("Fetching user role for user ID:", user.id);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      debugLog("User data fetch result:", { userData, userError });
      
      if (userError) {
        throw new Error(`Failed to fetch user role: ${userError.message}`);
      }

      if (userData) {
        setUserRole(userData.role);
        debugLog("User role set to:", userData.role);
      }

      // Get ticket data
      debugLog("Fetching ticket data for ticket ID:", unwrappedParams.id);
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select(`
          *,
          student:users!support_tickets_student_id_fkey(first_name, last_name, email),
          counselor:users!support_tickets_counselor_id_fkey(first_name, last_name, email)
        `)
        .eq('id', unwrappedParams.id)
        .single();

      debugLog("Ticket data fetch result:", { ticketData, ticketError });

      if (ticketError) {
        // Try a simpler query to see if the issue is with the joins
        debugLog("Trying simpler ticket query without joins");
        const { data: simpleTicketData, error: simpleTicketError } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('id', unwrappedParams.id)
          .single();
        
        debugLog("Simple ticket query result:", { simpleTicketData, simpleTicketError });
        
        if (simpleTicketError) {
          throw new Error(`Failed to fetch ticket: ${simpleTicketError.message}`);
        }
        
        // If simple query works, try to get user data separately
        if (simpleTicketData) {
          debugLog("Fetching student data for student ID:", simpleTicketData.student_id);
          const { data: studentData, error: studentError } = await supabase
            .from('users')
            .select('first_name, last_name, email')
            .eq('id', simpleTicketData.student_id)
            .single();
          
          debugLog("Student data fetch result:", { studentData, studentError });
          
          let counselorData = null;
          if (simpleTicketData.counselor_id) {
            debugLog("Fetching counselor data for counselor ID:", simpleTicketData.counselor_id);
            const { data: counselorResult, error: counselorError } = await supabase
              .from('users')
              .select('first_name, last_name, email')
              .eq('id', simpleTicketData.counselor_id)
              .single();
            
            debugLog("Counselor data fetch result:", { counselorResult, counselorError });
            if (!counselorError && counselorResult) {
              counselorData = counselorResult;
            }
          }
          
          // Combine the data
          const combinedTicketData = {
            ...simpleTicketData,
            student: studentData || null,
            counselor: counselorData
          };
          
          setTicket(combinedTicketData);
        }
      } else {
        // Original query worked
        if (!ticketData) {
          throw new Error('Ticket not found');
        }
        setTicket(ticketData);
        debugLog("Ticket data set successfully");
      }

      // If counselor just claimed the ticket, show scheduler
      if (userData?.role === 'counselor' && ticket?.status === 'claimed' && !ticket?.scheduled_time) {
        debugLog("Showing scheduler for counselor");
        setShowScheduler(true);
      }
      
      setLoading(false);
      debugLog("Loading completed successfully");
    } catch (err: any) {
      debugLog("Error in loadTicketData:", err);
      console.error('Error loading ticket:', err);
      setError(`${err.message || 'Failed to load ticket'} - Please check console for details`);
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    debugLog("Starting loadMessages for ticket ID:", unwrappedParams.id);
    try {
      const messageData = await getTicketMessages(unwrappedParams.id);
      debugLog("Messages loaded:", messageData);
      setMessages(messageData);
    } catch (err: any) {
      debugLog("Error in loadMessages:", err);
      console.error('Error loading messages:', err);
      setError(`${err.message || 'Failed to load messages'} - Please check console for details`);
    }
  };

  const handleSendMessage = async () => {
    debugLog("Sending message:", newMessage);
    if (!newMessage.trim()) {
      debugLog("Message is empty, skipping send");
      return;
    }
    
    try {
      await sendMessage({ ticket_id: unwrappedParams.id, message: newMessage });
      debugLog("Message sent successfully");
      setNewMessage('');
      loadMessages(); // Refresh messages
    } catch (err: any) {
      debugLog("Error sending message:", err);
      console.error('Error sending message:', err);
      setError(`${err.message || 'Failed to send message'} - Please check console for details`);
    }
  };

  const handleScheduleSession = async () => {
    debugLog("Scheduling session with time:", scheduledTime);
    if (!scheduledTime) {
      setError('Please select a scheduled time');
      return;
    }
    
    setIsScheduling(true);
    try {
      // Generate a Google Meet link if not provided
      const meetLink = meetingLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`;
      debugLog("Generated meeting link:", meetLink);
      
      await scheduleSession(unwrappedParams.id, scheduledTime, meetLink);
      debugLog("Session scheduled successfully");
      setShowScheduler(false);
      loadTicketData(); // Refresh ticket data
    } catch (err: any) {
      debugLog("Error scheduling session:", err);
      console.error('Error scheduling session:', err);
      setError(`${err.message || 'Failed to schedule session'} - Please check console for details`);
    } finally {
      setIsScheduling(false);
    }
  };

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
    debugLog("Rendering loading state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RoleBasedSidebar />
        <div className="lg:ml-20 flex min-h-screen pb-16 lg:pb-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chat...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    debugLog("Rendering error state:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RoleBasedSidebar />
        <div className="lg:ml-20 flex flex-col h-screen pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 pb-0">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-4 sm:mb-6 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-700"></div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Button onClick={() => router.push('/tickets')} variant="ghost" size="icon" className="rounded-xl hover:bg-red-50">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </Button>
                      
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center border-2 border-red-300 shadow-md">
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        
                        <div>
                          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                            Error Loading Chat
                          </h1>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <strong>Debug Info:</strong><br/>
                      Ticket ID: {unwrappedParams.id}<br/>
                      User Role: {userRole || 'Not set'}<br/>
                      Ticket Data: {ticket ? 'Loaded' : 'Not loaded'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    debugLog("Rendering ticket not found state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RoleBasedSidebar />
        <div className="lg:ml-20 flex min-h-screen pb-16 lg:pb-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <X className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">The requested ticket could not be found.</p>
              <Button onClick={() => router.push('/tickets')} className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                Back to Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  debugLog("Rendering chat page with ticket:", ticket);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <RoleBasedSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-20 flex min-h-screen pb-16 lg:pb-0">
        <motion.div 
          className="flex-1 p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-4 sm:mb-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Link href="/tickets">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </Button>
                      </motion.div>
                    </Link>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="relative"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.div>
                      
                      <div>
                        <motion.h1 
                          className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="hidden sm:inline">Ticket #{ticket.id} - {ticket.title}</span>
                          <span className="sm:hidden">#{ticket.id}</span>
                        </motion.h1>
                        <motion.p 
                          className="text-xs sm:text-sm text-gray-500"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {ticket.status === 'claimed' ? 'Session Active' : 'Waiting for counselor'} • Priority: {ticket.priority}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full bg-white border border-gray-200 shadow-lg rounded-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <CardContent className="h-full flex flex-col p-4 sm:p-6">
                {/* Ticket Info Banner */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        ticket.status === 'open' ? 'bg-yellow-400' :
                        ticket.status === 'claimed' ? 'bg-blue-400' :
                        ticket.status === 'resolved' ? 'bg-green-400' :
                        'bg-gray-400'
                      }`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">{ticket.title}</h3>
                        <p className="text-xs text-gray-600 hidden sm:block">{ticket.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {ticket.counselor && (
                        <div className="flex items-center text-xs text-blue-600">
                          <UserCheck className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          {ticket.counselor.first_name}
                        </div>
                      )}
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 transparent'
                }}>
                  <AnimatePresence>
                    {/* Show bot message for students when ticket is claimed but not scheduled */}
                    {userRole === 'student' && ticket.status === 'claimed' && !ticket.scheduled_time && (
                      <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4"
                      >
                        {/* Bot Avatar */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-green-300 bg-gradient-to-br from-green-100 to-emerald-200 shadow-md flex items-center justify-center">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                        </motion.div>
                        
                        {/* Bot Message Content */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="max-w-xs sm:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 text-gray-800"
                        >
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-semibold text-green-700">
                              SoulRoute Bot
                            </span>
                            <span className="text-xs opacity-80 text-green-600">
                              System Message
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            🎉 Great news! Your ticket has been claimed by a counselor. They're currently setting up a session for you. Please check back soon for the scheduled time and meeting link. This usually takes just a few minutes.
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {messages.length === 0 && !(userRole === 'student' && ticket.status === 'claimed' && !ticket.scheduled_time) ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
                        <div className="relative">
                          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 blur-lg animate-pulse"></div>
                          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-full">
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: [0, -5, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            >
                              <MessageSquare className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500" />
                            </motion.div>
                          </div>
                        </div>
                        <motion.h4 
                          className="text-lg sm:text-xl font-semibold text-gray-700 mt-4 sm:mt-6 mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                          initial={{ opacity: 0.8, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                          No messages yet
                        </motion.h4>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xs">Start the conversation by sending a message below</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`flex ${message.sender?.role === 'student' ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}
                          >
                            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-3 sm:p-4 rounded-2xl shadow-sm ${
                              message.sender?.role === 'student'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                                {message.message}
                              </p>
                              <p className={`text-xs mt-2 ${
                                message.sender?.role === 'student' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <motion.div 
                  className="border-t border-gray-200 pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message here..."
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black placeholder-gray-500"
                      />
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Scheduler for Counselors */}
      {userRole === 'counselor' && ticket.status === 'claimed' && !ticket.scheduled_time && (
        <motion.div 
          className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 w-auto sm:w-full sm:max-w-md lg:max-w-lg z-50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="bg-white shadow-2xl rounded-xl border-2 border-purple-200 w-full">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 sm:p-4 rounded-t-xl">
              <CardTitle className="flex items-center space-x-2 text-white text-sm sm:text-base">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Schedule Session</span>
              </CardTitle>
            </div>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-gray-600 text-xs sm:text-sm">Set up a meeting time</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm px-2 sm:px-3 py-1"
                >
                  {showScheduler ? 'Cancel' : 'Schedule'}
                </Button>
              </div>
              
              {showScheduler && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Scheduled Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="rounded-lg sm:rounded-xl w-full border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900 shadow-sm text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Meeting Link (Optional)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="rounded-lg sm:rounded-xl w-full border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm text-sm"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleScheduleSession}
                    disabled={isScheduling}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-md transition-all duration-200 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    {isScheduling ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Schedule Session
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}