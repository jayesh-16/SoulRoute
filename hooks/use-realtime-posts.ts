"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type ForumPost } from "@/lib/actions/peer-support";

export function useRealtimePosts(initialPosts: ForumPost[] = []) {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const supabase = createClient();

  useEffect(() => {
    // Set initial posts
    setPosts(initialPosts);

    // Subscribe to real-time changes
    const channel = supabase
      .channel('forum_posts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          console.log('New post inserted:', payload);
          // Add the new post to the beginning of the list
          setPosts(current => [payload.new as ForumPost, ...current]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          console.log('Post updated:', payload);
          // Update the specific post
          setPosts(current => 
            current.map(post => 
              post.id === payload.new.id ? { ...post, ...payload.new } as ForumPost : post
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          console.log('Post deleted:', payload);
          // Remove the deleted post
          setPosts(current => 
            current.filter(post => post.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialPosts, supabase]);

  return posts;
}

export function useRealtimePostLikes(postId: string, initialLikeCount: number = 0) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const supabase = createClient();

  useEffect(() => {
    setLikeCount(initialLikeCount);

    // Subscribe to like changes for this specific post
    const channel = supabase
      .channel(`post_likes_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        () => {
          setLikeCount(current => current + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        () => {
          setLikeCount(current => Math.max(0, current - 1));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, initialLikeCount, supabase]);

  return likeCount;
}
