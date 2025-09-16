export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'counselor'
          approval_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'counselor'
          approval_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'student' | 'counselor'
          approval_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          university: string | null
          year_of_study: string | null
          specialization: string | null
          license_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          university?: string | null
          year_of_study?: string | null
          specialization?: string | null
          license_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          university?: string | null
          year_of_study?: string | null
          specialization?: string | null
          license_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          student_id: string
          counselor_id: string | null
          title: string
          description: string
          category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other'
          urgency: 'low' | 'medium' | 'high' | 'crisis'
          status: 'open' | 'claimed' | 'scheduled' | 'completed' | 'closed'
          session_mode: 'video' | 'audio' | 'chat' | 'in-person'
          scheduled_time: string | null
          meeting_link: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          counselor_id?: string | null
          title: string
          description: string
          category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other'
          urgency: 'low' | 'medium' | 'high' | 'crisis'
          status?: 'open' | 'claimed' | 'scheduled' | 'completed' | 'closed'
          session_mode: 'video' | 'audio' | 'chat' | 'in-person'
          scheduled_time?: string | null
          meeting_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          counselor_id?: string | null
          title?: string
          description?: string
          category?: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other'
          urgency?: 'low' | 'medium' | 'high' | 'crisis'
          status?: 'open' | 'claimed' | 'scheduled' | 'completed' | 'closed'
          session_mode?: 'video' | 'audio' | 'chat' | 'in-person'
          scheduled_time?: string | null
          meeting_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'counselor'
      approval_status: 'pending' | 'approved' | 'rejected'
      ticket_category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'academic' | 'other'
      ticket_urgency: 'low' | 'medium' | 'high' | 'crisis'
      ticket_status: 'open' | 'claimed' | 'scheduled' | 'completed' | 'closed'
      session_mode: 'video' | 'audio' | 'chat' | 'in-person'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}