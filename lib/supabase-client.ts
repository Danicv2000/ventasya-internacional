import { createClient } from '@supabase/supabase-js'

// Debug logging function
const logDebug = (message: string, data?: any) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '')
}

logDebug('Initializing Supabase client')

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

logDebug('Environment variables:', {
  supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
  supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'NOT SET'
})

// Validate environment variables
if (!supabaseUrl) {
  logDebug('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  logDebug('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

logDebug('Creating Supabase client instance')

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable debug logging for auth operations
    debug: true,
    // Auto-refresh session
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect auth changes
    detectSessionInUrl: true
  }
})

logDebug('Supabase client created successfully')

// Test connection
logDebug('Testing Supabase connection...')
supabase.rpc('now').then(
  result => logDebug('Connection test result:', result),
  error => logDebug('Connection test failed:', error)
)
