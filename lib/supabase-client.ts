import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable debug logging to prevent verbose console output
    debug: false,
    // Auto-refresh session
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect auth changes
    detectSessionInUrl: true
  }
})

// Test connection
// supabase.rpc('now').then(
//   result => console.log('Connection test result:', result),
//   error => console.error('Connection test failed:', error)
// )