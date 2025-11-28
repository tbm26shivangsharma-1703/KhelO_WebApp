// auth.js - Authentication functions
// This file adds login/signup functionality WITHOUT affecting existing code

console.log('✅ auth.js loaded')

// ==========================================
// SIGN UP WITH EMAIL
// ==========================================
async function signUpWithEmail(email, password, fullName, userType) {
  try {
    console.log('🔄 Creating account for:', email)
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType
        }
      }
    })
    
    if (authError) throw authError
    
    console.log('✅ Auth user created:', authData.user.id)
    
    // 2. Create profile in database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          user_type: userType
        })
      
      if (profileError) throw profileError
      
      console.log('✅ Profile created in database')
    }
    
    return { success: true, data: authData, message: 'Account created! Check your email for verification.' }
    
  } catch (error) {
    console.error('❌ Sign up error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// LOGIN WITH EMAIL
// ==========================================
async function loginWithEmail(email, password) {
  try {
    console.log('🔄 Logging in:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (error) throw error
    
    console.log('✅ Login successful:', data.user.email)
    return { success: true, data: data, user: data.user }
    
  } catch (error) {
    console.error('❌ Login error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// GOOGLE SIGN IN
// ==========================================
async function signInWithGoogle() {
  try {
    console.log('🔄 Initiating Google sign-in...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html'
      }
    })
    
    if (error) throw error
    
    console.log('✅ Redirecting to Google...')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Google sign-in error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// LOGOUT
// ==========================================
async function logout() {
  try {
    console.log('🔄 Logging out...')
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    console.log('✅ Logged out successfully')
    window.location.href = '/index.html'
    
  } catch (error) {
    console.error('❌ Logout error:', error.message)
  }
}

// ==========================================
// GET CURRENT USER
// ==========================================
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    if (user) {
      console.log('✅ Current user:', user.email)
    } else {
      console.log('ℹ️ No user logged in')
    }
    
    return user
    
  } catch (error) {
    console.error('❌ Get user error:', error.message)
    return null
  }
}

// ==========================================
// GET CURRENT PROFILE
// ==========================================
async function getCurrentProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    
    console.log('✅ Profile loaded:', data)
    return data
    
  } catch (error) {
    console.error('❌ Get profile error:', error.message)
    return null
  }
}

// ==========================================
// FORGOT PASSWORD
// ==========================================
async function forgotPassword(email) {
  try {
    console.log('🔄 Sending password reset email to:', email)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html'
    })
    
    if (error) throw error
    
    console.log('✅ Password reset email sent')
    return { success: true, message: 'Password reset link sent to your email' }
    
  } catch (error) {
    console.error('❌ Forgot password error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// CHECK AUTH STATE (Auto-run on page load)
// ==========================================
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🔄 Checking authentication state...')
  
  const user = await getCurrentUser()
  
  if (user) {
    const profile = await getCurrentProfile()
    
    // Store in window for easy access
    window.currentUser = user
    window.currentProfile = profile
    
    // Update UI if user info div exists
    const userInfoDiv = document.getElementById('user-info')
    if (userInfoDiv && profile) {
      userInfoDiv.innerHTML = `
        <span>Welcome, ${profile.full_name || user.email}</span>
        <button onclick="logout()" class="ml-4 text-red-600">Logout</button>
      `
    }
  }
})