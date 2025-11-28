import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, Venue, Facility, StudentVerificationData } from '../types';
import { MOCK_VENUES, DEFAULT_VENUE_IMAGE } from '../constants';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  login: (email: string, type?: 'regular' | 'student') => Promise<void>;
  signup: (email: string, password: string, name: string, type: 'regular' | 'student') => Promise<{error?: string; verificationRequired?: boolean}>;
  logout: () => void;
  updateUserVerification: (status: 'pending' | 'verified') => void;
  submitStudentVerification: (data: StudentVerificationData) => Promise<{ success?: boolean; error?: string }>;
  venues: Venue[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string, reason: string, refundAmount: number) => Promise<void>;
  currentBookingDraft: { venue: Venue; facilityId: string; date: Date; slots: string[] } | null;
  setBookingDraft: (draft: any) => void;
  getUnavailableSlots: (venueId: string, facilityId: string, date: Date) => Promise<string[]>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string; success?: boolean }>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBookingDraft, setBookingDraft] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch & Auth Subscription
  useEffect(() => {
    // 1. Fetch Venues (Independent of Auth)
    const fetchVenues = async () => {
      try {
        const { data: venuesData, error } = await supabase
          .from('venues')
          .select(`
            *,
            facilities (*),
            reviews (*)
          `)
          .eq('is_active', true);

        if (!error && venuesData && venuesData.length > 0) {
          const mappedVenues: Venue[] = venuesData.map((v: any) => ({
            id: v.id,
            name: v.name,
            city: v.city,
            address: v.address,
            rating: v.rating || 0,
            description: v.description || '',
            amenities: v.amenities || [],
            images: (v.images && v.images.length > 0) ? v.images : [DEFAULT_VENUE_IMAGE],
            facilities: (v.facilities || []).map((f: any) => ({
              id: f.id,
              venueId: f.venue_id,
              sport: f.sport_type || f.sport,
              name: f.name || f.facility_name,
              pricePerHour: f.price_per_hour,
              image: f.image_url || v.images?.[0] || DEFAULT_VENUE_IMAGE
            })),
            reviews: (v.reviews || []).map((r: any) => ({
              id: r.id,
              userId: r.user_name ? 'anonymous' : (r.venue_id || 'anonymous'), // Fallback mapping
              userName: r.user_name || 'Anonymous',
              rating: r.rating,
              date: new Date(r.created_at).toLocaleDateString(),
              comment: r.comment
            }))
          }));
          setVenues(mappedVenues);
        }
      } catch (e) {
        console.error("Venue fetch failed:", e);
      }
    };

    fetchVenues();

    // 2. Auth State Listener (Handles Login, OAuth Redirects, Session Restore)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase Auth Event: ${event}`);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'PASSWORD_RECOVERY') {
        if (session?.user) {
           try {
             // Fetch Bookings
             fetchUserBookings(session.user.id);

             // Fetch Profile
             let { data: profile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

             // Create Profile if missing (e.g. new Google User)
             if (!profile) {
                console.log("Profile not found in DB, attempting to create...");
                const storedType = localStorage.getItem('khelo_signup_type') as 'regular' | 'student' | null;
                const userType = storedType || 'regular';
                const fullName = session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User';
                
                const { data: newProfile, error: createError } = await supabase.from('profiles').insert({
                     id: session.user.id,
                     email: session.user.email,
                     full_name: fullName,
                     user_type: userType,
                     verification_status: 'none'
                }).select().single();

                if (createError) {
                  console.error("Failed to create profile (Check RLS Policies):", createError);
                } else {
                  console.log("Profile created successfully");
                  profile = newProfile;
                }
                localStorage.removeItem('khelo_signup_type');
             }

             // Handle Rejected Status - Fetch Reason
             let rejectionReason = undefined;
             if (profile && profile.verification_status === 'rejected') {
                const { data: verificationData } = await supabase
                  .from('student_verifications')
                  .select('rejection_reason')
                  .eq('user_id', session.user.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single();
                
                if (verificationData) {
                  rejectionReason = verificationData.rejection_reason;
                }
             }

             // Update User State
             if (profile) {
                setUser({
                  id: session.user.id,
                  email: session.user.email!,
                  name: profile.full_name || session.user.email?.split('@')[0],
                  type: profile.user_type || 'regular',
                  verificationStatus: profile.student_verified ? 'verified' : (profile.verification_status || 'none'),
                  avatarUrl: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
                  rejectionReason: rejectionReason
                });
             } else {
               // Fallback if profile creation failed (likely RLS issue) but we have session
               console.warn("Using session data as fallback due to missing profile");
               setUser({
                 id: session.user.id,
                 email: session.user.email!,
                 name: session.user.user_metadata.full_name || 'User',
                 type: 'regular',
                 verificationStatus: 'none',
                 avatarUrl: session.user.user_metadata.avatar_url
               });
             }
           } catch (err) {
             console.error("Auth processing error:", err);
           }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setBookings([]);
        localStorage.removeItem('khelo_signup_type');
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId);
      
      if (data && !error) {
         const mappedBookings: Booking[] = data.map((b: any) => ({
           id: b.id,
           venueId: b.venue_id,
           facilityId: b.facility_id,
           userId: b.user_id,
           date: b.booking_date,
           slots: typeof b.selected_slots === 'string' ? JSON.parse(b.selected_slots) : b.selected_slots,
           totalAmount: b.final_price,
           status: b.status,
           paymentMethod: b.payment_method,
           timestamp: new Date(b.created_at).getTime(),
           cancellationReason: b.cancellation_reason,
           refundAmount: b.refund_amount
         }));
         setBookings(mappedBookings);
      }
    } catch (e) {
      console.error("Error fetching bookings:", e);
    }
  };

  const getUnavailableSlots = async (venueId: string, facilityId: string, date: Date): Promise<string[]> => {
    const dateStr = date.toISOString().split('T')[0];
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('selected_slots')
        .eq('venue_id', venueId)
        .eq('facility_id', facilityId)
        .eq('booking_date', dateStr)
        .neq('status', 'cancelled');

      if (error) {
        console.error("Error fetching unavailable slots:", error);
        return [];
      }
      
      const allSlots = data.flatMap((b: any) => {
        return typeof b.selected_slots === 'string' ? JSON.parse(b.selected_slots) : b.selected_slots;
      });
      
      return [...new Set(allSlots)] as string[];
    } catch (e) {
      console.error("Error getting slots:", e);
      return [];
    }
  };

  const login = async (email: string) => {
    // Placeholder - Logic handled by Login.tsx directly using Supabase client
  };

  const signup = async (email: string, password: string, name: string, type: 'regular' | 'student') => {
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_type: type
          }
        }
      });

      if (authError) return { error: authError.message };

      // 2. If user is created and we have a session (email confirmation off)
      // OR user is created but session is null (email confirmation on)
      if (authData.user) {
        
        // Try to insert profile immediately if we have the ID. 
        // This might fail if RLS requires an active session and email confirm is ON.
        // onAuthStateChange will handle it if this fails or is skipped.
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email: email,
          full_name: name,
          user_type: type,
          verification_status: 'none'
        });

        if (profileError) {
           console.log("Initial profile sync failed (likely waiting for verification):", profileError.message);
        }

        if (!authData.session) {
          return { verificationRequired: true };
        }
      }
      return {};
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Redirect to dashboard where user can find "Change Password" in Profile tab
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + (window.location.hash ? '/#/' : '/') + 'dashboard',
      });
      if (error) return { error: error.message };
      return { message: 'Password reset link sent to your email.' };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookings([]);
    localStorage.removeItem('khelo_signup_type');
  };

  const updateUserVerification = async (status: 'pending' | 'verified') => {
    if (user) {
      setUser({ ...user, verificationStatus: status });
      await supabase.from('profiles').update({ verification_status: status }).eq('id', user.id);
    }
  };

  const submitStudentVerification = async (data: StudentVerificationData) => {
    if (!user) return { error: 'User not logged in' };
    
    try {
      // 1. Upload Files
      const timestamp = Date.now();
      let frontUrl = '';
      let backUrl = '';

      if (data.idCardFront) {
        const path = `${user.id}/front_${timestamp}_${data.idCardFront.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('student-ids').upload(path, data.idCardFront);
        if (uploadError) {
           console.warn("Upload failed (bucket might not exist):", uploadError);
           // Fallback for demo if bucket doesn't exist
           frontUrl = "https://placehold.co/400x300?text=ID+Front";
        } else {
           const { data: publicUrl } = supabase.storage.from('student-ids').getPublicUrl(path);
           frontUrl = publicUrl.publicUrl;
        }
      }

      if (data.idCardBack) {
        const path = `${user.id}/back_${timestamp}_${data.idCardBack.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('student-ids').upload(path, data.idCardBack);
        if (uploadError) {
           backUrl = "https://placehold.co/400x300?text=ID+Back";
        } else {
           const { data: publicUrl } = supabase.storage.from('student-ids').getPublicUrl(path);
           backUrl = publicUrl.publicUrl;
        }
      }

      // 2. Insert Verification Record
      const { error: dbError } = await supabase.from('student_verifications').insert({
        user_id: user.id,
        college_name: data.collegeName,
        batch: data.batchYear,
        college_email: data.collegeEmail,
        id_card_front_url: frontUrl,
        id_card_back_url: backUrl,
        status: 'pending'
      });

      if (dbError) throw dbError;

      // 3. Update Profile Status
      await updateUserVerification('pending');

      return { success: true };
    } catch (e: any) {
      console.error('Verification submission failed:', e);
      return { error: e.message || 'Failed to submit verification' };
    }
  };

  const addBooking = async (booking: Booking) => {
    setBookings([booking, ...bookings]);
    if (user) {
      try {
        const { error } = await supabase.from('bookings').insert({
           user_id: user.id,
           venue_id: booking.venueId,
           facility_id: booking.facilityId,
           booking_date: booking.date,
           selected_slots: booking.slots,
           final_price: booking.totalAmount,
           status: booking.status,
           payment_method: booking.paymentMethod,
           created_at: new Date().toISOString()
        });
        if (error) console.error("Booking sync failed:", error);
      } catch (e) {
        console.error("Booking sync failed:", e);
      }
    }
  };

  const cancelBooking = async (bookingId: string, reason: string, refundAmount: number) => {
    // Optimistic UI Update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', cancellationReason: reason, refundAmount: refundAmount } : b));
    
    if (user) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled',
            cancellation_reason: reason,
            refund_amount: refundAmount,
            cancelled_at: new Date().toISOString()
          })
          .eq('id', bookingId);
          
        if (error) {
           console.error("Cancellation failed:", error);
           // Revert if failed
           fetchUserBookings(user.id);
        }
      } catch (e) {
        console.error("Cancellation error:", e);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUserVerification,
      submitStudentVerification,
      venues,
      bookings,
      addBooking,
      cancelBooking,
      currentBookingDraft,
      setBookingDraft,
      getUnavailableSlots,
      resetPassword,
      updatePassword,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};