
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Clock, XCircle, User as UserIcon, Calendar, MapPin, Star, MessageSquare, AlertCircle, AlertTriangle } from 'lucide-react';
import { Review } from '../types';

type DashboardTab = 'bookings' | 'reviews' | 'profile';

export const Dashboard: React.FC = () => {
  const { user, bookings, venues, cancelBooking } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { newBooking?: boolean, verificationSubmitted?: boolean } | null;
  const [activeTab, setActiveTab] = useState<DashboardTab>('bookings');
  
  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundCalculation, setRefundCalculation] = useState({ amount: 0, percentage: 0 });

  useEffect(() => {
     if(!user) navigate('/login');
  }, [user, navigate]);

  // Derived user reviews
  const myReviews = useMemo(() => {
    if (!user) return [];
    const userReviews: { review: Review, venueName: string, venueId: string }[] = [];
    
    venues.forEach(venue => {
      if (venue.reviews) {
        venue.reviews.forEach(review => {
          if (review.userId === user.id) {
            userReviews.push({
              review,
              venueName: venue.name,
              venueId: venue.id
            });
          }
        });
      }
    });
    return userReviews;
  }, [venues, user]);

  const openCancelModal = (bookingId: string, bookingDateStr: string, amount: number) => {
    const bookingDate = new Date(bookingDateStr);
    const now = new Date();
    // Calculate difference in hours
    const diffHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let percentage = 0;
    if (diffHours >= 24) percentage = 100;
    else if (diffHours >= 12) percentage = 50;
    else percentage = 0;
    
    const refundAmount = (amount * percentage) / 100;
    
    setBookingToCancel(bookingId);
    setRefundCalculation({ amount: refundAmount, percentage });
    setShowCancelModal(true);
    setCancelReason('');
  };

  const confirmCancellation = async () => {
    if (bookingToCancel) {
       await cancelBooking(bookingToCancel, cancelReason, refundCalculation.amount);
       setShowCancelModal(false);
       setBookingToCancel(null);
    }
  };

  if (!user) return null;

  // Enhance booking data with venue details
  const enhancedBookings = bookings.map(b => {
    const venue = venues.find(v => v.id === b.venueId);
    const facility = venue?.facilities.find(f => f.id === b.facilityId);
    return { ...b, venue, facility };
  }).filter(b => b.userId === user.id);

  const isUpcoming = (bookingDate: string) => {
    return new Date(bookingDate) >= new Date(new Date().setHours(0,0,0,0));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative">
      
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
             <div className="flex items-center gap-3 text-red-600 mb-4">
               <AlertCircle size={28} />
               <h3 className="text-xl font-bold">Cancel Booking?</h3>
             </div>
             
             <div className="bg-gray-50 p-4 rounded-lg mb-4">
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-gray-600">Refund Eligibility:</span>
                 <span className="font-bold">{refundCalculation.percentage}%</span>
               </div>
               <div className="flex justify-between text-lg font-bold">
                 <span>Refund Amount:</span>
                 <span className="text-green-600">₹{refundCalculation.amount}</span>
               </div>
               <p className="text-xs text-gray-500 mt-2">
                 Full refund if cancelled 24h before. 50% if 12h before.
               </p>
             </div>

             <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Cancellation</label>
               <textarea 
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Change of plans, weather, etc."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
               ></textarea>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={() => setShowCancelModal(false)}
                 className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
               >
                 Go Back
               </button>
               <button 
                 onClick={confirmCancellation}
                 className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
               >
                 Confirm Cancel
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Alerts */}
        {user.type === 'student' && user.verificationStatus === 'pending' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your student verification is under review. We will notify you once approved (1-2 business days).
                </p>
              </div>
            </div>
          </div>
        )}

        {user.type === 'student' && user.verificationStatus === 'rejected' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">Verification Rejected</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>Reason: <span className="font-medium italic">"{user.rejectionReason || 'Document issues'}"</span></p>
                  </div>
                </div>
              </div>
              <div className="sm:ml-auto">
                 <Link 
                   to="/student-verification"
                   className="inline-flex items-center px-3 py-2 border border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                 >
                   Re-upload Documents
                 </Link>
              </div>
            </div>
          </div>
        )}

        {state?.newBooking && (
           <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r shadow-sm animate-fade-in-down">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-bold">
                  Booking Confirmed Successfully! Check your details below.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Profile Card */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center sticky top-24">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary p-1">
                 {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="rounded-full w-full h-full" /> : <UserIcon className="w-full h-full text-gray-400" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {user.type} Account
              </div>

              {user.type === 'student' && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Verification Status</div>
                  {user.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center text-green-600 font-bold text-sm">
                       <CheckCircle size={16} className="mr-1"/> Verified
                    </span>
                  ) : user.verificationStatus === 'pending' ? (
                    <span className="inline-flex items-center text-yellow-600 font-bold text-sm">
                       <Clock size={16} className="mr-1"/> Pending
                    </span>
                  ) : user.verificationStatus === 'rejected' ? (
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center text-red-600 font-bold text-sm mb-2">
                        <XCircle size={16} className="mr-1"/> Rejected
                      </span>
                      <Link to="/student-verification" className="text-xs text-primary hover:underline">
                        Retry Verification
                      </Link>
                    </div>
                  ) : (
                    <Link to="/student-verification" className="text-primary hover:underline text-sm font-medium">Verify Now for 20% Off</Link>
                  )}
                </div>
              )}

              {/* Sidebar Navigation */}
              <nav className="mt-8 space-y-2 text-left">
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'bookings' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Calendar size={18} className="mr-3" />
                  My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'reviews' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <MessageSquare size={18} className="mr-3" />
                  My Reviews
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
             
             {/* My Bookings Tab */}
             {activeTab === 'bookings' && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="text-lg font-bold text-gray-900">My Bookings</h3>
                     <Link to="/venues" className="text-sm text-primary font-medium hover:text-emerald-700">Book New Slot</Link>
                  </div>

                  <div className="divide-y divide-gray-100">
                     {enhancedBookings.length === 0 ? (
                       <div className="p-12 text-center text-gray-500">
                          <Calendar size={48} className="mx-auto mb-4 text-gray-300"/>
                          <p className="text-lg font-medium text-gray-900">No bookings yet</p>
                          <p className="mb-6">Start your journey by booking a sports venue today.</p>
                          <Link to="/venues" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-700">
                            Browse Venues
                          </Link>
                       </div>
                     ) : (
                       enhancedBookings.map((booking) => (
                         <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                               <div className="flex items-start gap-4">
                                  <img 
                                    src={booking.facility?.image || 'https://via.placeholder.com/100'} 
                                    alt="Facility" 
                                    className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                                  />
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{booking.venue?.name}</h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                      <span className="font-medium text-gray-700 mr-2">{booking.facility?.name} ({booking.facility?.sport})</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                       <MapPin size={14} className="mr-1"/> {booking.venue?.address}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                       <Calendar size={14} className="mr-1"/> {format(new Date(booking.date), 'dd MMM yyyy')} 
                                       <span className="mx-2">•</span> 
                                       <Clock size={14} className="mr-1"/> {booking.slots.join(', ')}
                                    </div>
                                    {booking.status === 'cancelled' && (
                                       <div className="text-xs text-red-500 mt-2 bg-red-50 p-1 rounded inline-block">
                                         Cancelled: {booking.cancellationReason}
                                         {booking.refundAmount ? ` (Refund: ₹${booking.refundAmount})` : ''}
                                       </div>
                                    )}
                                  </div>
                               </div>
                               
                               <div className="text-right flex flex-col items-end">
                                  <div className="text-xl font-bold text-primary">₹{booking.totalAmount}</div>
                                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                                     booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                     {booking.status.toUpperCase()}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-2 mb-2">
                                    ID: {booking.id}
                                  </div>
                                  
                                  {booking.status === 'confirmed' && isUpcoming(booking.date) && (
                                    <button 
                                      onClick={() => openCancelModal(booking.id, booking.date, booking.totalAmount)}
                                      className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors"
                                    >
                                      Cancel Booking
                                    </button>
                                  )}
                               </div>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
               </div>
             )}

             {/* My Reviews Tab */}
             {activeTab === 'reviews' && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="text-lg font-bold text-gray-900">My Reviews</h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                     {myReviews.length === 0 ? (
                       <div className="p-12 text-center text-gray-500">
                          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300"/>
                          <p className="text-lg font-medium text-gray-900">No reviews yet</p>
                          <p className="mb-6">Book a venue and share your experience!</p>
                       </div>
                     ) : (
                       myReviews.map((item, idx) => (
                         <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                               <div>
                                  <h4 className="font-bold text-gray-900 text-lg mb-1">{item.venueName}</h4>
                                  <div className="flex items-center gap-1 mb-2">
                                     {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={14} className={i < item.review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                                     ))}
                                     <span className="text-xs text-gray-500 ml-2">{item.review.date}</span>
                                  </div>
                                  <p className="text-gray-600 text-sm">{item.review.comment}</p>
                               </div>
                               <Link 
                                 to={`/venue/${item.venueId}`}
                                 className="text-sm font-medium text-primary hover:text-emerald-700 border border-primary/20 px-3 py-1 rounded-md hover:bg-primary/5 transition-colors"
                               >
                                 View Venue
                               </Link>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};
