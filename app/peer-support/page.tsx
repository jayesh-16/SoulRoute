"use client";

import { useState, useEffect } from "react";
import { 
  getForumCategories, 
  getForumPosts, 
  getPeerVolunteers,
  createForumPost,
  createPeerConnection,
  togglePostLike,
  type ForumCategory,
  type ForumPost,
  type PeerVolunteer
} from "@/lib/actions/peer-support";
import { CreatePostModal } from "@/components/peer-support/create-post-modal";
import { VolunteerConnectionModal } from "@/components/peer-support/volunteer-connection-modal";
import { PostDetailModal } from "@/components/peer-support/post-detail-modal";
import { useRealtimePosts } from "@/hooks/use-realtime-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Users,
  Shield,
  UserCheck,
  User,
  Clock,
  Star,
  MessageCircle,
  Send,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Award,
  BookOpen,
  Eye,
  MoreHorizontal,
  Pin,
  Lock,
  Unlock,
  Heart,
  CheckCircle
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { RoleBasedSidebar } from "@/components/role-based-sidebar";


// Page Header
const PeerSupportHeader = () => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
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
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Peer Support Platform
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Moderated support forum with trained student volunteers
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  BookOpen,
  Heart,
  Users,
  Calendar
};

// Forum Category Card Component
const CategoryCard = ({ category, onClick }: { category: any; onClick: () => void }) => {
  // Map icon string to actual component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'Heart':
        return Heart;
      case 'Users':
        return Users;
      case 'Calendar':
        return Calendar;
      default:
        return BookOpen; // fallback icon
    }
  };
  
  const Icon = getIconComponent(category.icon);
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 md:space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${category.color_class || 'bg-blue-100 text-blue-600'}`}
            >
              <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{category.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.post_count} posts</span>
                    <span className="sm:hidden">{category.post_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">{new Date(category.updated_at).toLocaleDateString()}</span>
                    <span className="sm:hidden text-xs">{new Date(category.updated_at).toLocaleDateString().split('/')[0]}/{new Date(category.updated_at).toLocaleDateString().split('/')[2]}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Moderated
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Post Card Component
const PostCard = ({ post }: { post: any }) => {
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="w-10 h-10 border-2 border-blue-300 shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {post.is_pinned && <Pin className="w-4 h-4 text-blue-600" />}
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  {post.is_answered && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Answered</Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <span>by {post.is_anonymous ? 'Anonymous' : 'Student'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{timeAgo(post.created_at)}</span>
                    <span className="hidden sm:inline">•</span>
                    <Badge variant="outline" className="text-xs">{post.category?.title}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                    <button 
                      onClick={(e) => {
                        console.log('🔍 DEBUG: Like button clicked, stopping propagation');
                        e.stopPropagation();
                        // onLike(post.id); // TODO: Implement like functionality
                      }}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{post.like_count}</span>
                    </button>
                    <div 
                      className="flex items-center space-x-1 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        console.log('🔍 DEBUG: Comment icon clicked');
                        e.stopPropagation();
                        const modalTrigger = document.getElementById(`modal-trigger-${post.id}`);
                        console.log('🔍 DEBUG: Modal trigger found:', modalTrigger);
                        if (modalTrigger) {
                          modalTrigger.click();
                        }
                      }}
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{post.reply_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Volunteer Card Component
const VolunteerCard = ({ volunteer, onConnect }: { volunteer: any; onConnect: (volunteerId: string) => void }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <Avatar className="w-16 h-16 border-2 border-blue-300 shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
              </Avatar>
              {volunteer.is_online && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{volunteer.display_name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{volunteer.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <p className="text-sm text-blue-600 font-medium mb-1">{volunteer.role}</p>
              <p className="text-sm text-gray-600 mb-2">{volunteer.specialization}</p>
              <p className="text-xs text-gray-500 mb-3">{volunteer.year_level}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>{volunteer.sessions_helped} helped</span>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <VolunteerConnectionModal 
                    volunteer={volunteer} 
                    onConnectionCreated={() => {}}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Peer Support Component
export default function PeerSupportPage() {
  const [activeTab, setActiveTab] = useState<'forum' | 'volunteers' | 'guidelines'>('forum');
  const [categories, setCategories] = useState<any[]>([]);
  const [initialPosts, setInitialPosts] = useState<any[]>([]);
  const realtimePosts = useRealtimePosts(initialPosts);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, postsResult, volunteersResult] = await Promise.all([
        getForumCategories(),
        getForumPosts(),
        getPeerVolunteers()
      ]);

      if (categoriesResult.error) {
        console.error('Error loading categories:', categoriesResult.error);
      } else {
        setCategories(categoriesResult.data || []);
      }

      if (postsResult.error) {
        console.error('Error loading posts:', postsResult.error);
      } else {
        setInitialPosts(postsResult.data || []);
      }

      if (volunteersResult.error) {
        console.error('Error loading volunteers:', volunteersResult.error);
      } else {
        setVolunteers(volunteersResult.data || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const result = await togglePostLike(postId);
      if (result.error) {
        console.error('Error toggling like:', result.error);
      } else {
        // Refresh posts to get updated like counts
        const postsResult = await getForumPosts();
        if (postsResult.data) {
          setInitialPosts(postsResult.data);
        }
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleConnectVolunteer = async (volunteerId: string) => {
    try {
      const result = await createPeerConnection({
        volunteer_id: volunteerId,
        topic: 'General Support',
        description: 'Requesting peer support connection'
      });
      
      if (result.error) {
        console.error('Error creating connection:', result.error);
        alert('Failed to create connection. Please try again.');
      } else {
        alert('Connection request sent successfully!');
      }
    } catch (err) {
      console.error('Error connecting to volunteer:', err);
      alert('Failed to create connection. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peer support platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <RoleBasedSidebar />
      
      {/* Main Layout */}
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        {/* Main Content */}
        <motion.div 
          className="flex-1 p-4 md:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PeerSupportHeader />
          
          {/* Tab Navigation */}
          <motion.div 
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-xl p-1">
              {['forum', 'volunteers', 'guidelines'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 capitalize text-sm sm:text-base ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab === 'forum' && <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />}
                  {tab === 'volunteers' && <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />}
                  {tab === 'guidelines' && <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />}
                  {tab}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Content Area */}
          <motion.div 
            className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'forum' && (
                <motion.div
                  key="forum"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Forum Categories */}
                  <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Support Categories</h2>
                      <CreatePostModal 
                        categories={categories} 
                        onPostCreated={loadData}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CategoryCard category={category} onClick={() => console.log('Category clicked:', category.title)} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Posts */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Discussions</h2>
                    <div className="space-y-3 md:space-y-4">
                      {realtimePosts.length > 0 ? (
                        realtimePosts.map((post: any, index: number) => (
                          <motion.div
                            key={post.id}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <PostDetailModal 
                              postId={post.id}
                              onReplyAdded={() => {
                                console.log('🔍 DEBUG: Reply added, refreshing posts data');
                                loadData(); // Refresh posts to get updated reply counts
                              }}
                              trigger={
                                <div 
                                  onClick={() => {
                                    console.log('🔍 DEBUG: Modal trigger div clicked for post:', post.id);
                                  }}
                                  className="cursor-pointer w-full"
                                >
                                  <PostCard post={post} />
                                </div>
                              }
                            />
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No posts yet. Be the first to start a discussion!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'volunteers' && (
                <motion.div
                  key="volunteers"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Trained Student Volunteers</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {volunteers.length > 0 ? (
                      volunteers.map((volunteer, index) => (
                        <motion.div
                          key={volunteer.id}
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <VolunteerCard volunteer={volunteer} onConnect={handleConnectVolunteer} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No volunteers available at the moment.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'guidelines' && (
                <motion.div
                  key="guidelines"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Guidelines</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                          <Shield className="w-6 h-6 mr-2" />
                          Safety First
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li>• All conversations are moderated by trained volunteers</li>
                          <li>• Personal information should never be shared</li>
                          <li>• Report any concerning behavior immediately</li>
                          <li>• Crisis situations require professional help</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                          <Heart className="w-6 h-6 mr-2" />
                          Respectful Communication
                        </h3>
                        <ul className="space-y-2 text-sm text-green-800">
                          <li>• Be kind and supportive to all members</li>
                          <li>• Listen without judgment</li>
                          <li>• Respect different perspectives and experiences</li>
                          <li>• Use inclusive and appropriate language</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                          <Users className="w-6 h-6 mr-2" />
                          Peer Support Principles
                        </h3>
                        <ul className="space-y-2 text-sm text-purple-800">
                          <li>• Share experiences, not advice</li>
                          <li>• Focus on emotional support</li>
                          <li>• Encourage professional help when needed</li>
                          <li>• Maintain confidentiality</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-lg rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                          <Flag className="w-6 h-6 mr-2" />
                          Reporting System
                        </h3>
                        <ul className="space-y-2 text-sm text-orange-800">
                          <li>• Report inappropriate content or behavior</li>
                          <li>• Contact moderators for urgent concerns</li>
                          <li>• Use anonymous reporting when needed</li>
                          <li>• Help maintain a safe community space</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}