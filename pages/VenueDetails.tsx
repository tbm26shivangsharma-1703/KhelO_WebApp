
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Check, Info, Clock, Calendar as CalendarIcon, Star, User, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DEFAULT_VENUE_IMAGE } from '../constants';

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00"
];

export const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { venues, user, setBookingDraft, getUnavailableSlots } = useApp();
  const navigate = useNavigate();

  const venue = venues.find(v => v.id === id);
  const [selectedFacility, setSelectedFacility] = useState(venue?.facilities[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Set default facility if needed when venue loads
  useEffect(() => {
    if (venue && !selectedFacility && venue.facilities.length > 0) {
      setSelectedFacility(venue.facilities[0].id);
    }
  }, [venue, selectedFacility]);

  // Fetch unavailable slots when dependencies change
  useEffect(() => {
    const fetchAvailability = async () => {
      if (venue && selectedFacility) {
        setLoadingSlots(true);
        // Clear previous slots selection when changing facility/date
        setSelectedSlots([]);
        
        const slots = await getUnavailableSlots(venue.id, selectedFacility, selectedDate);
        setUnavailableSlots(slots);
        setLoadingSlots(false);
      }
    };
    
    fetchAvailability();
  }, [selectedFacility, selectedDate, venue, getUnavailableSlots]);

  if (!venue) return <div>Venue not found</div>;

  const currentFacility = venue.facilities.find(f => f.id === selectedFacility);
  const images = venue.images && venue.images.length > 0 ? venue.images : [DEFAULT_VENUE_IMAGE];

  const toggleSlot = (time: string) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter(s => s !== time));
    } else {
      setSelectedSlots([...selectedSlots, time].sort());
    }
  };

  const calculateTotal = () => {
    if (!currentFacility) return 0;
    let total = selectedSlots.length * currentFacility.pricePerHour;
    // Apply visual logic only here, actual calculation in Checkout
    return total;
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (selectedSlots.length === 0) return;

    setBookingDraft({
      venue,
      facilityId: selectedFacility,
      date: selectedDate,
      slots: selectedSlots
    });
    navigate('/checkout');
  };

  // Image Navigation
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Review Stars Helper
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
    ));
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Interactive Image Gallery Header */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-900 group">
        <img 
          src={images[currentImageIndex]} 
          alt={venue.name} 
          className="w-full h-full object-cover transition-opacity duration-300" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_VENUE_IMAGE;
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="pointer-events-auto">
              <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
              <div className="flex items-center gap-2 mt-2 opacity-90">
                <MapPin size={18} />
                <span>{venue.address}, {venue.city}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 pointer-events-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectImage(idx)}
                    className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-primary' : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <ImageIcon size={12} />
            <span>{currentImageIndex + 1} / {images.length}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Venue</h2>
              <div className="relative">
                <p className="text-gray-600 leading-relaxed text-sm">
                    {venue.description}
                    <br/><br/>
                    What if you get 8 sports at one arena in Gurgaon? Yes, Gallant Play brings you 8 sports at one centre in Gurgaon - with all turfs INJURY FREE! So, stay fit nd healthy by playing sports at Gallant Play Arena South City! The Turf's Waiting for you...
                </p>
                <button className="text-primary text-sm font-medium mt-2 hover:underline">See Less</button>
              </div>
            </section>

            <section>
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                 AMENITIES <button className="text-sm font-medium text-primary">View All</button>
               </h2>
               <div className="grid grid-cols-2 gap-4">
                  {venue.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                       <div className="w-6 flex justify-center"><Check size={18} className="text-gray-400" /></div>
                       <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                  {/* Hardcoded extras to match design if needed, or stick to data */}
                  <div className="flex items-center gap-2 text-gray-700">
                       <div className="w-6 flex justify-center"><Check size={18} className="text-gray-400" /></div>
                       <span className="text-sm">Drinking Water</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                       <div className="w-6 flex justify-center"><Check size={18} className="text-gray-400" /></div>
                       <span className="text-sm">Seating Area</span>
                  </div>
               </div>
            </section>
            
            <section>
               <h2 className="text-xl font-bold text-gray-900 mb-4">ADDRESS</h2>
               <div className="flex flex-col md:flex-row gap-6">
                 <div className="flex-1">
                   <p className="text-gray-800 font-medium mb-4">{venue.address}</p>
                   <div className="mb-2">
                     <h4 className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">NEAREST METRO</h4>
                     <p className="text-gray-800">Huda City Centre (0.8KM)</p>
                   </div>
                 </div>
                 <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                    {/* Placeholder map */}
                    <img 
                      src="https://maps.googleapis.com/maps/api/staticmap?center=28.4595,77.0266&zoom=14&size=400x300&sensor=false&key=YOUR_API_KEY" 
                      alt="Map" 
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => {
                         (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Map+View";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <MapPin className="text-red-500 drop-shadow-md" size={32} fill="currentColor" />
                    </div>
                 </div>
               </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-primary"/> BOOK A SLOT
              </h2>

              {/* Facility Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {venue.facilities.map(facility => (
                    <div 
                      key={facility.id}
                      onClick={() => setSelectedFacility(facility.id)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedFacility === facility.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900">{facility.name || facility.sport}</h3>
                       </div>
                       <p className="text-gray-500 text-sm mb-4">₹ {facility.pricePerHour} onwards</p>
                       <button className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-wide ${
                          selectedFacility === facility.id 
                          ? 'bg-primary text-white' 
                          : 'bg-teal-50 text-primary hover:bg-primary hover:text-white transition-colors'
                       }`}>
                          BOOK
                       </button>
                    </div>
                  ))}
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {dates.map((date) => {
                    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    return (
                      <button
                        key={date.toString()}
                        onClick={() => { setSelectedDate(date); }}
                        className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-lg border transition-colors ${
                          isSelected ? 'bg-secondary text-white border-secondary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs">{format(date, 'EEE')}</span>
                        <span className="text-lg font-bold">{format(date, 'd')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                <p className="text-xs text-gray-500 mb-3">Select multiple slots to book a longer session.</p>
                
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-sm text-gray-500">Checking availability...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedSlots.includes(time);
                      const isBooked = unavailableSlots.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => toggleSlot(time)}
                          className={`py-2 text-sm font-medium rounded-md border transition-all ${
                            isBooked 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100'
                              : isSelected
                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {time}
                          {isBooked && <span className="block text-[10px] font-normal">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </section>

             {/* Reviews Section */}
             <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">User Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="text-xl font-bold">{venue.rating}</span>
                    <span className="text-sm text-gray-500">({venue.reviews?.length || 0} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {venue.reviews && venue.reviews.length > 0 ? (
                    venue.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User size={16} className="text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900">{review.userName}</span>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this venue!
                    </div>
                  )}
                </div>
            </section>
            
            <div className="flex justify-between text-sm text-primary font-medium pt-4 border-t">
               <button>Cancellation Policy</button>
               <button>Reschedule Policy</button>
            </div>
          </div>

          {/* Right Column: Booking Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Facility</span>
                  <span className="font-medium text-gray-900">{currentFacility?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">{format(selectedDate, 'dd MMM yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Selected Slots</span>
                   <span className="font-medium text-gray-900">{selectedSlots.length} hours</span>
                </div>
                {selectedSlots.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Slots: {selectedSlots.join(', ')}</div>
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between mb-6">
                <div>
                   <span className="text-sm text-gray-500">Total Amount</span>
                   <div className="text-3xl font-bold text-gray-900">₹{calculateTotal()}</div>
                </div>
              </div>

              {selectedSlots.length === 0 ? (
                <button disabled className="w-full py-3 px-4 bg-gray-200 text-gray-500 font-bold rounded-lg cursor-not-allowed">
                  Select Slots
                </button>
              ) : (
                <button 
                  onClick={handleBookNow}
                  className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg transition-all"
                >
                  Proceed to Pay
                </button>
              )}

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                 <Info size={14} className="mt-0.5 flex-shrink-0" />
                 <p>Cancellation allowed up to 4 hours before the slot time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
