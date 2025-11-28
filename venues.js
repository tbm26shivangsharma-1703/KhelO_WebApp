// venues.js - Venues and facilities functions

// ==========================================
// GET ALL VENUES
// ==========================================
async function getVenues(filters = {}) {
  try {
    let query = supabase
      .from('venues')
      .select(`
        *,
        sports_facilities (*)
      `)
      .eq('is_active', true)
    
    // Apply city filter
    if (filters.city) {
      query = query.eq('city', filters.city)
    }
    
    // Apply search filter
    if (filters.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Filter by sport type if specified
    let venues = data
    if (filters.sport) {
      venues = data.filter(venue => 
        venue.sports_facilities?.some(f => f.sport_type === filters.sport)
      )
    }
    
    console.log(`✅ Found ${venues.length} venues`)
    return venues
    
  } catch (error) {
    console.error('❌ Get venues error:', error.message)
    return []
  }
}

// ==========================================
// GET SINGLE VENUE BY ID
// ==========================================
async function getVenueById(venueId) {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        sports_facilities (*),
        reviews (
          *,
          profiles (full_name, avatar_url)
        )
      `)
      .eq('id', venueId)
      .single()
    
    if (error) throw error
    
    console.log('✅ Venue loaded:', data.name)
    return data
    
  } catch (error) {
    console.error('❌ Get venue error:', error.message)
    return null
  }
}

// ==========================================
// GET FACILITIES FOR A VENUE
// ==========================================
async function getFacilitiesByVenue(venueId) {
  try {
    const { data, error } = await supabase
      .from('sports_facilities')
      .select('*')
      .eq('venue_id', venueId)
      .eq('is_available', true)
    
    if (error) throw error
    
    console.log(`✅ Found ${data.length} facilities`)
    return data
    
  } catch (error) {
    console.error('❌ Get facilities error:', error.message)
    return []
  }
}

// ==========================================
// DISPLAY VENUES ON PAGE
// ==========================================
async function displayVenues(containerId, filters = {}) {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error('Container not found:', containerId)
    return
  }
  
  // Show loading
  container.innerHTML = '<p class="text-center py-8">Loading venues...</p>'
  
  // Fetch venues
  const venues = await getVenues(filters)
  
  if (venues.length === 0) {
    container.innerHTML = '<p class="text-center py-8">No venues found</p>'
    return
  }
  
  // Build HTML
  let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
  
  venues.forEach(venue => {
    const imageUrl = venue.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
    const amenities = venue.amenities?.slice(0, 3).join(', ') || 'No amenities listed'
    
    html += `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <img src="${imageUrl}" alt="${venue.name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-xl font-bold mb-2">${venue.name}</h3>
          <p class="text-gray-600 text-sm mb-2">${venue.city}</p>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-yellow-500">★</span>
            <span class="font-semibold">${venue.rating}</span>
            <span class="text-gray-500 text-sm">(${venue.total_reviews} reviews)</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">${amenities}</p>
          <button 
            onclick="viewVenueDetails('${venue.id}')"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            View Details
          </button>
        </div>
      </div>
    `
  })
  
  html += '</div>'
  container.innerHTML = html
}

// ==========================================
// VIEW VENUE DETAILS (Navigation helper)
// ==========================================
function viewVenueDetails(venueId) {
  window.location.href = `/venue-details.html?id=${venueId}`
}