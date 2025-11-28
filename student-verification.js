// student-verification.js - Student verification functions

// ==========================================
// SUBMIT STUDENT VERIFICATION
// ==========================================
async function submitStudentVerification(formData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Please login first')
    }
    
    const userId = user.id
    
    // Upload ID card front
    const frontFile = formData.id_card_front
    const frontFileName = `${userId}/id_front_${Date.now()}.${frontFile.name.split('.').pop()}`
    
    const { error: frontUploadError } = await supabase.storage
      .from('student-ids')
      .upload(frontFileName, frontFile)
    
    if (frontUploadError) throw frontUploadError
    
    const { data: { publicUrl: frontUrl } } = supabase.storage
      .from('student-ids')
      .getPublicUrl(frontFileName)
    
    // Upload ID card back (if provided)
    let backUrl = null
    if (formData.id_card_back) {
      const backFile = formData.id_card_back
      const backFileName = `${userId}/id_back_${Date.now()}.${backFile.name.split('.').pop()}`
      
      const { error: backUploadError } = await supabase.storage
        .from('student-ids')
        .upload(backFileName, backFile)
      
      if (backUploadError) throw backUploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('student-ids')
        .getPublicUrl(backFileName)
      
      backUrl = publicUrl
    }
    
    // Upload bonafide (if provided)
    let bonafideUrl = null
    if (formData.bonafide) {
      const bonafideFile = formData.bonafide
      const bonafideFileName = `${userId}/bonafide_${Date.now()}.${bonafideFile.name.split('.').pop()}`
      
      const { error: bonafideUploadError } = await supabase.storage
        .from('student-ids')
        .upload(bonafideFileName, bonafideFile)
      
      if (bonafideUploadError) throw bonafideUploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('student-ids')
        .getPublicUrl(bonafideFileName)
      
      bonafideUrl = publicUrl
    }
    
    // Create verification record
    const { data, error } = await supabase
      .from('student_verifications')
      .insert({
        user_id: userId,
        college_name: formData.college_name,
        batch: formData.batch,
        college_email: formData.college_email,
        id_card_front_url: frontUrl,
        id_card_back_url: backUrl,
        bonafide_url: bonafideUrl,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update profile
    await supabase
      .from('profiles')
      .update({
        college_name: formData.college_name,
        batch: formData.batch,
        college_email: formData.college_email
      })
      .eq('id', userId)
    
    console.log('✅ Verification submitted successfully')
    return { success: true, data: data }
    
  } catch (error) {
    console.error('❌ Submit verification error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// GET VERIFICATION STATUS
// ==========================================
async function getVerificationStatus() {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('student_verifications')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    return data
    
  } catch (error) {
    console.error('❌ Get verification status error:', error.message)
    return null
  }
}