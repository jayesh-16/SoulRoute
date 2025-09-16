"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, CheckCircle, MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createForumPost } from "@/lib/actions/peer-support";

interface ForumCategory {
  id: string;
  title: string;
  color_class?: string;
}

interface CreatePostModalProps {
  categories: ForumCategory[];
  onPostCreated: () => void;
}

export function CreatePostModal({ categories, onPostCreated }: CreatePostModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const result = await createForumPost({
        title: title.trim(),
        content: content.trim(),
        category_id: category,
        is_anonymous: isAnonymous
      });

      if (result.error) {
        console.error("Error creating post:", result.error);
        alert("Failed to create post. Please try again.");
      } else {
        // Show success popup
        setShowSuccess(true);
        
        // Auto-hide success popup and close modal after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
          // Reset form
          setTitle("");
          setContent("");
          setCategory("");
          setIsAnonymous(false);
          setOpen(false);
          onPostCreated();
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Removed handleInputChange as we're using individual state variables now

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border border-blue-200 shadow-2xl rounded-2xl relative fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
        
        <DialogHeader className="pb-6 border-b border-blue-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center">
            <MessageSquare className="w-7 h-7 mr-3 text-blue-500" />
            Create New Post
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center mt-3 text-base">
            Share your thoughts, ask questions, or start a meaningful discussion
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[calc(85vh-200px)] overflow-y-auto scrollbar-hide px-6">
          <form onSubmit={handleSubmit} className="space-y-8 mt-6 pb-6">
          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-bold text-gray-900 flex items-center">
              📝 Post Title
            </Label>
            <Input
              id="title"
              placeholder="What's on your mind? Write a clear, descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm p-4 text-gray-900 font-medium h-12"
              maxLength={200}
            />
            <div className="text-right">
              <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-bold text-gray-900 flex items-center">
                📂 Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm text-gray-900 h-12">
                  <SelectValue placeholder="Choose a category for your post" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-blue-200 shadow-xl rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-gray-900 hover:bg-blue-50 focus:bg-blue-100 rounded-lg py-3">
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <Label htmlFor="content" className="text-sm font-bold text-gray-900 flex items-center">
              💭 Your Message
            </Label>
            <div className="relative">
              <Textarea
                id="content"
                placeholder="Share your thoughts, experiences, or questions... Be authentic and supportive! 💙"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm p-4 text-gray-900 font-medium"
                maxLength={2000}
              />
              <div className="absolute bottom-4 right-4">
                <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                  {content.length}/2000
                </span>
              </div>
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="border-2 border-blue-400 data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="anonymous" className="text-sm font-medium text-gray-900 cursor-pointer flex items-center">
              🎭 Post anonymously
              <span className="text-xs text-gray-600 ml-2">(Your identity will be hidden from other users)</span>
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6">
            <p className="text-sm text-gray-600 font-medium">
              💡 Be respectful and supportive in your post
            </p>
            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim() || !category}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
          </form>
        </div>
        
        {/* Success Popup Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 max-w-sm mx-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-black mb-2"
                >
                  🎉 Post Created Successfully!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm"
                >
                  Your discussion post has been shared with the community. Thank you for contributing! 💙
                </motion.p>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 2 }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
