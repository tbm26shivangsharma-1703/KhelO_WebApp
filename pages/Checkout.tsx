
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { CreditCard, Smartphone, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_VENUE_IMAGE } from '../constants';

export const Checkout: React.FC = () => {
  const { currentBookingDraft, user, addBooking } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentBookingDraft || !user) {
    return <div className="p-8 text-center">No active booking session. <button onClick={() => navigate('/venues')} className="text-primary underline">Browse Venues</button></div>;
  }

  const { venue, facilityId, slots, date } = currentBookingDraft;
  const facility = venue.facilities.find((f: any) => f.id === facilityId);

  // Price Calculation
  const pricePerHour = facility.pricePerHour;
  const totalHours = slots.length;
  const subTotal = pricePerHour * totalHours;
  // Student discounts removed
  const finalAmount = subTotal;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      const newBooking: Booking = {
        id: `bk_${Math.random().toString(36).substr(2, 9)}`,
        venueId: venue.id,
        facilityId: facilityId,
        userId: user.id,
        date: date.toISOString(),
        slots: slots,
        totalAmount: finalAmount,
        status: 'confirmed',
        paymentMethod: paymentMethod,
        timestamp: Date.now()
      };
      addBooking(newBooking);
      setIsProcessing(false);
      navigate('/dashboard', { state: { newBooking: true } });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Booking Details</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img 
                    src={facility.image || DEFAULT_VENUE_IMAGE} 
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_VENUE_IMAGE; }}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100" 
                    alt="Facility" 
                  />
                  <div>
                    <p className="font-bold text-gray-900">{venue.name}</p>
                    <p className="text-sm text-gray-600">{facility.name} • {facility.sport}</p>
                    <p className="text-sm text-gray-500 mt-1">{venue.address}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{format(date, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Slots</span>
                    <span className="font-medium">{slots.join(', ')} ({totalHours} hrs)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
               <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Payment Summary</h3>
               <div className="space-y-3">
                 <div className="flex justify-between text-gray-600">
                   <span>Subtotal ({totalHours} hrs × ₹{pricePerHour})</span>
                   <span>₹{subTotal}</span>
                 </div>
                 
                 <div className="flex justify-between font-bold text-xl pt-4 border-t">
                   <span>Total to Pay</span>
                   <span>₹{finalAmount}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Right: Payment Method */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-fit">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Payment Method</h3>
            
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-green-50 text-primary font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <CreditCard size={20}/> Card
              </button>
              <button 
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-primary bg-green-50 text-primary font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <Smartphone size={20}/> UPI
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="password" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="bg-white p-2 rounded-lg border border-gray-200 w-48 h-48 mx-auto flex items-center justify-center shadow-sm">
                   <img 
                     src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=khelo@upi&pn=KhelO&am=${finalAmount}&cu=INR`} 
                     alt="Payment QR Code" 
                     className="w-full h-full object-contain"
                   />
                </div>
                <div className="text-sm text-gray-500">Scan to pay <span className="font-bold text-gray-800">₹{finalAmount}</span></div>
                <div className="flex justify-center gap-4 opacity-70">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-800">GPay</div>
                   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-800">PhonePe</div>
                   <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">Paytm</div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">Or enter UPI ID</span>
                    </div>
                  </div>
                  <input type="text" placeholder="username@upi" className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </div>
              </div>
            )}

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-8 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-wait"
            >
              {isProcessing ? (
                <>Processing Payment...</>
              ) : (
                <div className="flex items-center gap-2">Pay <span className="text-xl">₹{finalAmount}</span> <Shield size={18} /></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
