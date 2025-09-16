"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  User, 
  Pin, 
  Clock,
  Flag,
  Loader2,
  XCircle
} from "lucide-react";
import { 
  getForumPost, 
  getForumReplies, 
  createForumReply,
  togglePostLike,
  toggleReplyLike,
  type ForumPost, 
  type ForumReply 
} from "@/lib/actions/peer-support";
import { motion } from "framer-motion";

interface PostDetailModalProps {
  postId: string;
  trigger: React.ReactNode;
  onReplyAdded?: () => void;
}

export function PostDetailModal({ postId, trigger, onReplyAdded }: PostDetailModalProps) {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Debug logging
  console.log('🔍 DEBUG: PostDetailModal rendered for postId:', postId);
  console.log('🔍 DEBUG: Modal open state:', open);

  const loadPostData = async () => {
    console.log('🔍 DEBUG: loadPostData called for postId:', postId);
    if (!postId) {
      console.log('🔍 DEBUG: No postId provided, returning');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 DEBUG: Fetching post and replies data...');
      const [postResult, repliesResult] = await Promise.all([
        getForumPost(postId),
        getForumReplies(postId)
      ]);

      console.log('🔍 DEBUG: Post result:', postResult);
      console.log('🔍 DEBUG: Replies result:', repliesResult);

      if (postResult.data) {
        setPost(postResult.data);
        console.log('🔍 DEBUG: Post data set:', postResult.data);
      } else {
        console.log('🔍 DEBUG: No post data received');
      }
      if (repliesResult.data) {
        setReplies(repliesResult.data);
        console.log('🔍 DEBUG: Replies data set:', repliesResult.data);
      } else {
        console.log('🔍 DEBUG: No replies data received');
      }
    } catch (error) {
      console.error("🔍 DEBUG: Error loading post data:", error);
    } finally {
      setLoading(false);
      console.log('🔍 DEBUG: Loading finished');
    }
  };

  useEffect(() => {
    console.log('🔍 DEBUG: useEffect triggered - open:', open, 'postId:', postId);
    if (open) {
      console.log('🔍 DEBUG: Modal is open, loading post data...');
      loadPostData();
    }
  }, [open, postId]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !post) return;

    setReplyLoading(true);
    try {
      const result = await createForumReply({
        post_id: post.id,
        content: replyText.trim(),
        is_anonymous: isAnonymous
      });

      if (result.data) {
        setReplies(prev => [...prev, result.data!]);
        setReplyText("");
        setIsAnonymous(false);
        
        // Update local post reply count
        setPost(prev => prev ? {
          ...prev,
          reply_count: prev.reply_count + 1
        } : null);
        
        // Update reply count in parent component
        if (onReplyAdded) {
          onReplyAdded();
        }
      } else {
        alert("Failed to post reply. Please try again.");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    
    try {
      const result = await togglePostLike(post.id);
      if (result.data !== null) {
        setPost(prev => prev ? {
          ...prev,
          like_count: result.data ? prev.like_count + 1 : prev.like_count - 1
        } : null);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    try {
      const result = await toggleReplyLike(replyId);
      if (result.data !== null) {
        setReplies(prev => prev.map(reply => 
          reply.id === replyId 
            ? { ...reply, like_count: result.data ? reply.like_count + 1 : reply.like_count - 1 }
            : reply
        ));
      }
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const getDisplayName = (author: any, isAnonymous: boolean) => {
    if (isAnonymous) return "Anonymous Student";
    return "Student"; // Simplified - no user data lookup needed
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      console.log('🔍 DEBUG: Dialog open state changing from', open, 'to', newOpen);
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild onClick={() => console.log('🔍 DEBUG: DialogTrigger clicked')}>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-white border border-blue-200 shadow-2xl rounded-2xl relative fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <XCircle className="w-6 h-6 text-gray-600 group-hover:text-red-500" />
        </button>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-black">Loading discussion...</span>
          </div>
        ) : post ? (
          <>
            <DialogHeader className="border-b border-blue-100 pb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {post.is_pinned && <Pin className="w-5 h-5 text-blue-500" />}
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      {post.title}
                    </DialogTitle>
                    {post.is_answered && (
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-3 py-1 rounded-full">✓ Answered</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="font-medium">by {getDisplayName(null, post.is_anonymous)}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{getTimeAgo(post.created_at)}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <Badge className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2 py-1">{post.category?.title}</Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Post Content */}
              <div className="relative bg-gradient-to-r from-blue-200 via-blue-300 to-purple-300 p-0.5 rounded-xl">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">{post.content}</p>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-200">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={handleLikePost}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>{post.like_count}</span>
                        <span className="text-sm">Likes</span>
                      </button>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post?.reply_count || 0}</span>
                        <span className="text-sm">Replies</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 font-medium">
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    💬 Replies
                  </h3>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                    {post?.reply_count || 0} {(post?.reply_count || 0) === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
                
                {(post?.reply_count || 0) === 0 ? (
                  <div className="text-center py-12 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                    <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold text-lg mb-2">No replies yet</p>
                    <p className="text-gray-600">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply, index) => (
                      <motion.div
                        key={reply.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative bg-gradient-to-r from-blue-200 via-blue-300 to-purple-300 p-0.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="bg-white rounded-xl p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <span className="font-bold text-gray-900">
                                  {getDisplayName(null, reply.is_anonymous)}
                                </span>
                                <span className="text-xs text-gray-500 bg-blue-100 px-3 py-1 rounded-full font-medium">
                                  {getTimeAgo(reply.created_at)}
                                </span>
                                {reply.is_solution && (
                                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-3 py-1 rounded-full font-medium">✓ Solution</Badge>
                                )}
                              </div>
                              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                              </div>
                              <div className="flex items-center space-x-6">
                                <button 
                                  onClick={() => handleLikeReply(reply.id)}
                                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{reply.like_count}</span>
                                  <span className="text-sm">Like</span>
                                </button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500 p-0 h-auto font-medium">
                                  <Flag className="w-4 h-4 mr-2" />
                                  <span className="text-sm">Report</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  ✍️ Share Your Thoughts
                </h4>
                <form onSubmit={handleReplySubmit} className="space-y-5">
                  <div className="relative">
                    <Label htmlFor="reply" className="text-sm font-bold text-gray-900 mb-3 block">
                      💬 Your Reply
                    </Label>
                    <Textarea
                      id="reply"
                      placeholder="Share your thoughts, experiences, or support... Be respectful and constructive! 💙"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[120px] resize-none border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white p-4 text-gray-900 font-medium"
                      maxLength={1000}
                    />
                    <div className="absolute bottom-4 right-4">
                      <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                        {replyText.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-white rounded-lg p-4 border border-blue-200">
                    <Checkbox
                      id="anonymous-reply"
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      className="border-2 border-blue-400 data-[state=checked]:bg-blue-500"
                    />
                    <Label htmlFor="anonymous-reply" className="text-sm font-medium text-gray-900 cursor-pointer flex items-center">
                      🎭 Post anonymously
                      <span className="text-xs text-gray-600 ml-2">(Your identity will be hidden)</span>
                    </Label>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <p className="text-sm text-gray-600 font-medium">
                      💡 Be supportive and respectful in your reply
                    </p>
                    <Button
                      type="submit"
                      disabled={replyLoading || !replyText.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replyLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Posting Reply...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Post Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-black">Post not found or failed to load.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
