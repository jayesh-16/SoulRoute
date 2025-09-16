"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Types for peer support
export interface ForumCategory {
  id: string;
  title: string;
  description: string;
  category_type: string;
  icon: string;
  color_class: string;
  post_count: number;
  moderator_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  content: string;
  status: string;
  is_pinned: boolean;
  is_answered: boolean;
  is_anonymous: boolean;
  like_count: number;
  reply_count: number;
  view_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  category?: ForumCategory;
  author?: any;
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_anonymous: boolean;
  like_count: number;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
  author?: any;
}

export interface PeerVolunteer {
  id: string;
  user_id: string;
  display_name: string;
  role: string;
  specialization: string;
  year_level: string;
  bio?: string;
  rating: number;
  sessions_helped: number;
  is_online: boolean;
  status: string;
  training_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PeerConnection {
  id: string;
  student_id: string;
  volunteer_id: string;
  status: string;
  topic: string;
  description?: string;
  scheduled_time?: string;
  meeting_link?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  volunteer?: PeerVolunteer;
}

// Forum Categories Actions
export async function getForumCategories(): Promise<{ data: ForumCategory[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum categories:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getForumCategories:', error);
    return { data: null, error: 'Failed to fetch forum categories' };
  }
}

// Forum Posts Actions
export async function getForumPosts(categoryId?: string, limit = 10): Promise<{ data: ForumPost[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('forum_posts')
      .select('*, category:forum_categories(*)')
      .eq('status', 'active')
      .order('is_pinned', { ascending: false })
      .order('last_activity_at', { ascending: false })
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching forum posts:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getForumPosts:', error);
    return { data: null, error: 'Failed to fetch forum posts' };
  }
}

export async function createForumPost(postData: {
  category_id: string;
  title: string;
  content: string;
  is_anonymous?: boolean;
}): Promise<{ data: ForumPost | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        ...postData,
        author_id: user.id,
        is_anonymous: postData.is_anonymous || false
      })
      .select('*, category:forum_categories(*)')
      .single();

    if (error) {
      console.error('Error creating forum post:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/peer-support');
    return { data, error: null };
  } catch (error) {
    console.error('Error in createForumPost:', error);
    return { data: null, error: 'Failed to create forum post' };
  }
}

export async function getForumPost(postId: string): Promise<{ data: ForumPost | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Increment view count
    const { data: currentPost } = await supabase
      .from('forum_posts')
      .select('view_count')
      .eq('id', postId)
      .single();
    
    if (currentPost) {
      await supabase
        .from('forum_posts')
        .update({ view_count: currentPost.view_count + 1 })
        .eq('id', postId);
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, category:forum_categories(*), reply_count')
      .eq('id', postId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching forum post:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getForumPost:', error);
    return { data: null, error: 'Failed to fetch forum post' };
  }
}

// Forum Replies Actions
export async function getForumReplies(postId: string): Promise<{ data: ForumReply[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('is_solution', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum replies:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getForumReplies:', error);
    return { data: null, error: 'Failed to fetch forum replies' };
  }
}

export async function createForumReply(replyData: {
  post_id: string;
  content: string;
  is_anonymous?: boolean;
}): Promise<{ data: ForumReply | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        ...replyData,
        author_id: user.id,
        is_anonymous: replyData.is_anonymous || false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating forum reply:', error);
      return { data: null, error: error.message };
    }

    // Update reply count and last activity in forum_posts table
    const { data: currentPost } = await supabase
      .from('forum_posts')
      .select('reply_count')
      .eq('id', replyData.post_id)
      .single();

    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ 
        reply_count: (currentPost?.reply_count || 0) + 1,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', replyData.post_id);

    if (updateError) {
      console.error('Error updating post reply count:', updateError);
    }

    revalidatePath('/peer-support');
    return { data, error: null };
  } catch (error) {
    console.error('Error in createForumReply:', error);
    return { data: null, error: 'Failed to create forum reply' };
  }
}

// Peer Volunteers Actions
export async function getPeerVolunteers(): Promise<{ data: PeerVolunteer[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('peer_volunteers')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .order('sessions_helped', { ascending: false });

    if (error) {
      console.error('Error fetching peer volunteers:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getPeerVolunteers:', error);
    return { data: null, error: 'Failed to fetch peer volunteers' };
  }
}

export async function createPeerVolunteer(volunteerData: {
  display_name: string;
  role: string;
  specialization: string;
  year_level: string;
  bio?: string;
}): Promise<{ data: PeerVolunteer | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('peer_volunteers')
      .insert({
        ...volunteerData,
        user_id: user.id,
        status: 'training'
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating peer volunteer:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/peer-support');
    return { data, error: null };
  } catch (error) {
    console.error('Error in createPeerVolunteer:', error);
    return { data: null, error: 'Failed to create peer volunteer profile' };
  }
}

// Peer Connections Actions
export async function createPeerConnection(connectionData: {
  volunteer_id: string;
  topic: string;
  description?: string;
  scheduled_time?: string;
}): Promise<{ data: PeerConnection | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('peer_connections')
      .insert({
        ...connectionData,
        student_id: user.id,
        status: 'pending'
      })
      .select(`
        *,
        volunteer:peer_volunteers!peer_connections_volunteer_id_fkey(*)
      `)
      .single();

    if (error) {
      console.error('Error creating peer connection:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/peer-support');
    return { data, error: null };
  } catch (error) {
    console.error('Error in createPeerConnection:', error);
    return { data: null, error: 'Failed to create peer connection' };
  }
}

export async function getUserPeerConnections(): Promise<{ data: PeerConnection[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('peer_connections')
      .select(`
        *,
        volunteer:peer_volunteers!peer_connections_volunteer_id_fkey(*)
      `)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user peer connections:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserPeerConnections:', error);
    return { data: null, error: 'Failed to fetch peer connections' };
  }
}

// Like/Unlike Actions
export async function togglePostLike(postId: string): Promise<{ data: boolean | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike the post
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unliking post:', error);
        return { data: null, error: error.message };
      }

      revalidatePath('/peer-support');
      return { data: false, error: null }; // false = unliked
    } else {
      // Like the post
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });

      if (error) {
        console.error('Error liking post:', error);
        return { data: null, error: error.message };
      }

      revalidatePath('/peer-support');
      return { data: true, error: null }; // true = liked
    }
  } catch (error) {
    console.error('Error in togglePostLike:', error);
    return { data: null, error: 'Failed to toggle post like' };
  }
}

export async function toggleReplyLike(replyId: string): Promise<{ data: boolean | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Check if user already liked this reply
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike the reply
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('reply_id', replyId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unliking reply:', error);
        return { data: null, error: error.message };
      }

      revalidatePath('/peer-support');
      return { data: false, error: null }; // false = unliked
    } else {
      // Like the reply
      const { error } = await supabase
        .from('post_likes')
        .insert({
          reply_id: replyId,
          user_id: user.id
        });

      if (error) {
        console.error('Error liking reply:', error);
        return { data: null, error: error.message };
      }

      revalidatePath('/peer-support');
      return { data: true, error: null }; // true = liked
    }
  } catch (error) {
    console.error('Error in toggleReplyLike:', error);
    return { data: null, error: 'Failed to toggle reply like' };
  }
}

// Report Actions
export async function reportContent(reportData: {
  reported_post_id?: string;
  reported_reply_id?: string;
  reported_user_id?: string;
  reason: string;
  description?: string;
}): Promise<{ data: any | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('peer_reports')
      .insert({
        ...reportData,
        reporter_id: user.id,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating report:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in reportContent:', error);
    return { data: null, error: 'Failed to submit report' };
  }
}
