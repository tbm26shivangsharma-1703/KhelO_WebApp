// supabase-config.js

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM SUPABASE
const SUPABASE_URL = 'https://xujiqssuhxzsfembyfrf.supabase.co'
const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amlxc3N1aHh6c2ZlbWJ5ZnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzgyNjQsImV4cCI6MjA3OTcxNDI2NH0.JA7wLHnl5BvKdJoj8Q61nuepV-5ZHJ7nBP0hGv3Al_w'
// Create Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test connection
async function testConnection() {
  console.log('🔄 Testing Supabase connection...')
  
  const { data, error } = await supabase.from('venues').select('*').limit(1)
  
  if (error) {
    console.error('❌ Supabase connection failed:', error)
    alert('Database connection error! Check console.')
  } else {
    console.log('✅ Supabase connected successfully!')
    console.log('✅ Sample venue:', data)
  }
}

// Test on page load
testConnection()

console.log('✅ Supabase config loaded')