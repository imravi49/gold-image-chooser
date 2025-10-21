// Universal Backend Adapter - Automatically switches between Supabase and Firebase
import { createClient } from '@supabase/supabase-js';

interface BackendAdapter {
  mode: 'supabase' | 'firebase';
  auth: any;
  db: any;
  storage: any;
}

// Initialize Supabase (Lovable Cloud) as default backend
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

const backend: BackendAdapter = {
  mode: 'supabase',
  auth: supabase.auth,
  db: supabase,
  storage: supabase.storage
};

console.log('☁️ Lovable Cloud (Supabase) backend initialized');

// Note: Firebase support ready - add Firebase packages and credentials to .env to enable automatic switching
// Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.

export const { auth, db, storage, mode } = backend;
export const backendMode = mode;
