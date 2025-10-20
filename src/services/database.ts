// Database abstraction layer - makes migration to Firebase easier
// All database operations go through this service
import { supabase } from "@/integrations/supabase/client";

// Types for easy migration
export type User = {
  id: string;
  username: string;
  name: string;
  contact?: string;
  folder_path?: string;
  selection_limit?: number;
  is_finalized?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
};

export type Photo = {
  id: string;
  file_name: string;
  folder_path: string;
  full_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
  created_at?: string;
};

export type Selection = {
  id: string;
  user_id: string;
  photo_id: string;
  category?: string;
  status?: string;
  selected_at?: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  overall_rating?: number;
  selection_experience?: number;
  photo_quality?: number;
  comments?: string;
  is_publishable?: boolean;
  created_at?: string;
};

export type ActivityLog = {
  id: string;
  user_id?: string;
  action: string;
  details?: any;
  ip_address?: string;
  created_at?: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: any;
  updated_at?: string;
};

// Database service - all operations centralized here
export const db = {
  // Users
  users: {
    getAll: async () => {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as User[];
    },
    getById: async (id: string) => {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) throw error;
      return data as User;
    },
    create: async (user: Partial<User>) => {
      const { data, error } = await supabase.from('users').insert([user as any]).select().single();
      if (error) throw error;
      return data as User;
    },
    update: async (id: string, updates: Partial<User>) => {
      const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as User;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // Photos
  photos: {
    getAll: async () => {
      const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Photo[];
    },
    getByFolder: async (folderPath: string) => {
      const { data, error } = await supabase.from('photos').select('*').eq('folder_path', folderPath);
      if (error) throw error;
      return data as Photo[];
    },
  },

  // Selections
  selections: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase.from('selections').select('*').eq('user_id', userId);
      if (error) throw error;
      return data as Selection[];
    },
    create: async (selection: Partial<Selection>) => {
      const { data, error } = await supabase.from('selections').insert([selection as any]).select().single();
      if (error) throw error;
      return data as Selection;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('selections').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // Feedback
  feedback: {
    getAll: async () => {
      const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Feedback[];
    },
    getByUser: async (userId: string) => {
      const { data, error } = await supabase.from('feedback').select('*').eq('user_id', userId);
      if (error) throw error;
      return data as Feedback[];
    },
    create: async (feedback: Partial<Feedback>) => {
      const { data, error } = await supabase.from('feedback').insert([feedback as any]).select().single();
      if (error) throw error;
      return data as Feedback;
    },
  },

  // Activity Logs
  logs: {
    getAll: async () => {
      const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as ActivityLog[];
    },
    create: async (log: Partial<ActivityLog>) => {
      const { data, error } = await supabase.from('activity_logs').insert([log as any]).select().single();
      if (error) throw error;
      return data as ActivityLog;
    },
  },

  // Site Settings
  settings: {
    get: async (key: string) => {
      const { data, error } = await supabase.from('site_settings').select('*').eq('key', key).maybeSingle();
      if (error) throw error;
      return data as SiteSetting | null;
    },
    set: async (key: string, value: any) => {
      const { data, error } = await supabase.from('site_settings').upsert({ key, value }).select().single();
      if (error) throw error;
      return data as SiteSetting;
    },
    getAll: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data as SiteSetting[];
    },
  },

  // Admin Settings
  adminSettings: {
    get: async (key: string) => {
      const { data, error } = await supabase.from('admin_settings').select('*').eq('key', key).maybeSingle();
      if (error) throw error;
      return data;
    },
    set: async (key: string, value: any) => {
      const { data, error } = await supabase.from('admin_settings').upsert({ key, value }).select().single();
      if (error) throw error;
      return data;
    },
    getAll: async () => {
      const { data, error } = await supabase.from('admin_settings').select('*');
      if (error) throw error;
      return data;
    },
  },

  // Auth
  auth: {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    getCurrentUser: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  },
};
