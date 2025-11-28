// bookings.js - Booking management functions

// ==========================================
// CHECK SLOT AVAILABILITY
// ==========================================
async function checkSlotAvailability(facilityId, date, selectedSlots) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('selected_slots')
      .eq('facility_id', facilityId)
      .eq('booking_date', date)
      .in('status', ['confirmed', 'pending'])
    
    if (error) throw error
    
    // Get all booked slots
    const bookedSlots = data?.flatMap(b => b.selected_slots) || []
    
    // Check for overlaps
    for (const newSlot of selectedSlots) {
      for (const bookedSlot of bookedSlots) {
        const newStart = newSlot.start
        const newEnd = newSlot.end
        const bookedStart = bookedSlot.start
        const bookedEnd = bookedSlot.end
        
        // Check overlap
        if (
          (newStart >= bookedStart && newStart < bookedEnd) ||
          (newEnd > bookedStart && newEnd <= bookedEnd) ||
          (newStart <= bookedStart && newEnd >= bookedEnd)
        ) {
          console.log('❌ Slot conflict detected')
          return { available: false, message: 'Some slots are already booked' }
        }
      }
    }
    
    console.log('✅ All slots available')
    return { available: true }
    
  } catch (error) {
    console.error('❌ Check availability error:', error.message)
    return { available: false, error: error.message }
  }
}

// ==========================================
// CREATE BOOKING
// ==========================================
async function createBooking(bookingData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Please login to make a booking')
    }
    
    // Check availability first
    const availabilityCheck = await checkSlotAvailability(
      bookingData.facility_id,
      bookingData.booking_date,
      bookingData.selected_slots
    )
    
    if (!availabilityCheck.available) {
      throw new Error(availabilityCheck.message || 'Slots not available')
    }
    
    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        facility_id: bookingData.facility_id,
        venue_id: bookingData.venue_id,
        booking_date: bookingData.booking_date,
        selected_slots: bookingData.selected_slots,
        total_hours: bookingData.total_hours,
        base_price: bookingData.base_price,
        discount_applied: bookingData.discount_applied || 0,
        final_price: bookingData.final_price,
        payment_method: bookingData.payment_method,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Booking created:', data.id)
    return { success: true, booking: data }
    
  } catch (error) {
    console.error('❌ Create booking error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
async function updatePaymentStatus(bookingId, transactionId) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        transaction_id: transactionId
      })
      .eq('id', bookingId)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Payment confirmed for booking:', bookingId)
    return { success: true, booking: data }
    
  } catch (error) {
    console.error('❌ Update payment error:', error.message)
    return { success: false, error: error.message }
  }
}

// ==========================================
// GET USER BOOKINGS
// ==========================================
async function getUserBookings() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Not logged in')
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        venues (name, city, address, images),
        sports_facilities (sport_type, facility_name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log(`✅ Found ${data.length} bookings`)
    return data
    
  } catch (error) {
    console.error('❌ Get bookings error:', error.message)
    return []
  }
}

// ==========================================
// CANCEL BOOKING
// ==========================================
async function cancelBooking(bookingId, reason) {
  try {
    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    if (fetchError) throw fetchError
    
    // Calculate refund based on cancellation policy
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.selected_slots[0].start}`)
    const now = new Date()
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    let refundAmount = 0
    if (hoursUntilBooking >= 24) {
      refundAmount = booking.final_price // 100% refund
    } else if (hoursUntilBooking >= 12) {
      refundAmount = booking.final_price * 0.5 // 50% refund
    }
    // else no refund
    
    // Update booking
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        refund_amount: refundAmount
      })
      .eq('id', bookingId)
      .select()
      .single()
    
    if (error) throw error
    
    console.log(`✅ Booking cancelled. Refund: ₹${refundAmount}`)
    return { success: true, refundAmount: refundAmount, booking: data }
    
  } catch (error) {
    console.error('❌ Cancel booking error:', error.message)
    return { success: false, error: error.message }
  }
}