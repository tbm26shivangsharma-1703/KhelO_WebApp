
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Check, Info, Clock, Calendar as CalendarIcon, Star, User } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DEFAULT_VENUE_IMAGE } from '../constants';

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00"
];

export const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { venues, user, setBookingDraft } = useApp();
  const navigate = useNavigate();

  const venue = venues.find(v => v.id === id);
  const [selectedFacility, setSelectedFacility] = useState(venue?.facilities[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  if (!venue) return <div>Venue not found</div>;

  const currentFacility = venue.facilities.find(f => f.id === selectedFacility);

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
      {/* Image Gallery Header */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full">
        <img 
          src={venue.images[0] || DEFAULT_VENUE_IMAGE} 
          alt={venue.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_VENUE_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
            <div className="flex items-center gap-2 mt-2 opacity-90">
              <MapPin size={18} />
              <span>{venue.address}, {venue.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Venue</h2>
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {venue.amenities.map(amenity => (
                  <span key={amenity} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                    <Check size={14} className="mr-1 text-primary" /> {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-primary"/> Select Slots
              </h2>

              {/* Facility Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Sport / Facility</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {venue.facilities.map(facility => (
                    <button
                      key={facility.id}
                      onClick={() => { setSelectedFacility(facility.id); setSelectedSlots([]); }}
                      className={`relative rounded-lg p-3 border text-left transition-all ${
                        selectedFacility === facility.id 
                          ? 'border-primary ring-1 ring-primary bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{facility.sport}</div>
                      <div className="text-sm text-gray-500">₹{facility.pricePerHour}/hr</div>
                    </button>
                  ))}
                </div>
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
                        onClick={() => { setSelectedDate(date); setSelectedSlots([]); }}
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
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedSlots.includes(time);
                    const isBooked = false; // Simulate availability check
                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => toggleSlot(time)}
                        className={`py-2 text-sm font-medium rounded-md border transition-all ${
                          isBooked 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent'
                            : isSelected
                              ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
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
                {user?.type === 'student' && user.verificationStatus === 'verified' && (
                  <div className="text-right">
                    <span className="block text-xs text-green-600 font-medium">Student Discount Applied</span>
                    <span className="block text-sm text-gray-400 line-through">₹{calculateTotal()}</span>
                    <span className="text-lg font-bold text-green-600">₹{calculateTotal() * 0.8}</span>
                  </div>
                )}
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
