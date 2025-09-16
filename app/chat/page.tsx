"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send,
  Home,
  MessageSquare,
  Calendar,
  Bot,
  User,
  ArrowLeft,
  MoreVertical,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { RoleBasedSidebar } from "@/components/role-based-sidebar";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";

// Message interface
interface Message {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  created_at: string;
  session_id: string;
}

// Chat session interface
interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  last_message_at: string;
}


// Chat Header Component
const ChatHeader = () => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </Button>
                </motion.div>
              </Link>
              
              <div className="flex items-center space-x-3">
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    AI Mental Health Assistant
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Your compassionate AI companion • Online
                  </motion.p>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }: { message: Message }) => {
  const isAI = message.sender === 'ai';
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`flex items-start space-x-3 mb-4 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex-shrink-0"
      >
        <Avatar className={`w-10 h-10 border-2 ${isAI ? 'border-blue-300' : 'border-purple-300'} shadow-md`}>
          {isAI ? (
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-200">
              <Bot className="w-5 h-5 text-blue-600" />
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-200">
              <User className="w-5 h-5 text-purple-600" />
            </AvatarFallback>
          )}
        </Avatar>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-xl shadow-md ${
          isAI 
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-gray-800' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
        }`}
      >
        <div className="flex items-center space-x-2 mb-1.5">
          <span className={`text-xs font-semibold ${
            isAI ? 'text-blue-700' : 'text-blue-100'
          }`}>
            {isAI ? 'SoulRoute AI' : 'You'}
          </span>
          <span className={`text-xs ${
            isAI ? 'text-blue-600 opacity-80' : 'text-blue-100 opacity-80'
          }`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{message.message}</p>
      </motion.div>
    </motion.div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start space-x-3 mb-4"
    >
      <Avatar className="w-10 h-10 border-2 border-blue-300 shadow-md">
        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-200">
          <Bot className="w-5 h-5 text-blue-600" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-blue-700">AI is thinking</span>
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: dot * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Chat Component
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      await loadChatSessions(user.id);
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setLoading(false);
    }
  };

  const loadChatSessions = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChatSessions(sessions || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const createNewSession = async (userId: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: `Chat ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSessionId(session.id);
      setMessages([]);
      await loadChatSessions(userId);
      
      return session.id;
    } catch (error) {
      console.error('Error creating new session:', error);
      return null;
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId);
      setLoading(true);
      
      const response = await fetch(`/api/chat?sessionId=${sessionId}&userId=${userId}`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading session:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !userId) return;

    let sessionId: string = currentSessionId || '';
    
    // Create a new session if none exists
    if (!sessionId) {
      const newSessionId = await createNewSession(userId);
      if (!newSessionId) return;
      sessionId = newSessionId;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      created_at: new Date().toISOString(),
      session_id: sessionId
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          userId: userId
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          message: data.response,
          sender: 'ai',
          created_at: new Date().toISOString(),
          session_id: sessionId
        };

        setMessages(prev => [...prev, aiMessage]);
        await loadChatSessions(userId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'ai',
        created_at: new Date().toISOString(),
        session_id: sessionId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const supabase = createClient();
      await supabase.from('chat_sessions').delete().eq('id', sessionId);
      await supabase.from('chat_messages').delete().eq('session_id', sessionId);
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      
      await loadChatSessions(userId!);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <RoleBasedSidebar />
        <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
          <div className="flex-1 p-3 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chat...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <RoleBasedSidebar />
      
      {/* Main Content */}
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        {/* Chat Sessions Sidebar */}
        <motion.div 
          className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gray-50 border-r border-gray-200 p-3 sm:p-4 transition-all duration-300 ease-in-out hidden md:block`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-4">
            {!sidebarCollapsed && (
              <h3 className="text-lg font-semibold text-gray-800">Chat Sessions</h3>
            )}
            <div className="flex items-center space-x-2">
              {!sidebarCollapsed && (
                <Button
                  onClick={() => userId && createNewSession(userId)}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                size="sm"
                className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg shadow-sm"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Collapsed State */}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={() => userId && createNewSession(userId)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-12 h-12 p-0 shadow-md"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              {/* Divider */}
              <div className="w-8 h-px bg-gray-300"></div>
              
              {/* Recent sessions icons */}
              <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto w-full flex flex-col items-center">
                {chatSessions.slice(0, 6).map((session) => (
                  <div
                    key={session.id}
                    className={`w-12 h-12 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center shadow-sm border ${
                      currentSessionId === session.id 
                        ? 'bg-blue-500 text-white border-blue-600 shadow-md' 
                        : 'bg-white hover:bg-blue-50 text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => loadSession(session.id)}
                    title={session.title}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Expanded State */}
          {!sidebarCollapsed && (
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {chatSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    currentSessionId === session.id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => loadSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mobile Chat Sessions Toggle */}
        {sidebarCollapsed && (
          <div className="md:hidden fixed top-32 left-6 z-50">
            <Button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Mobile Chat Sessions Overlay */}
        {!sidebarCollapsed && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarCollapsed(true)} />
            <motion.div 
              className="absolute left-0 top-0 h-full w-80 bg-gray-50 border-r border-gray-200 p-4 shadow-xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chat Sessions</h3>
                <Button
                  onClick={() => userId && createNewSession(userId)}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {chatSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      currentSessionId === session.id 
                        ? 'bg-blue-100 border-2 border-blue-300' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      loadSession(session.id);
                      setSidebarCollapsed(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.last_message_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <motion.div 
          className="flex-1 p-3 sm:p-6 lg:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginLeft: sidebarCollapsed ? '0' : '0' }}
        >
          {/* Header */}
          <div className="relative">
            <ChatHeader />
          </div>
          
          {/* Chat Container */}
          <Card className="h-[calc(100vh-200px)] bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="h-full flex flex-col p-3 sm:p-4 lg:p-6">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 transparent'
              }}>
                {!currentSessionId ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center mb-6 border-2 border-blue-300 shadow-md">
                      <Bot className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                      Welcome to SoulRoute AI
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
                      I'm your compassionate mental health companion. Start a conversation by typing a message below, and I'll create a new chat session for us.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Tip:</strong> You can ask me about stress management, anxiety, mood tracking, or any mental health concerns you'd like to discuss.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </AnimatePresence>
                )}
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
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
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
                      disabled={!inputMessage.trim() || isTyping}
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
        </motion.div>
      </div>
    </div>
  );
}
