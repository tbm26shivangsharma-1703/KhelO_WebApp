
export type UserType = 'regular' | 'student' | 'owner';
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  phone?: string;
  rejectionReason?: string;
}

export type SportType = 'Cricket' | 'Football' | 'Badminton' | 'Basketball' | 'Tennis' | 'Swimming' | 'Gym' | 'Table Tennis';

export interface Facility {
  id: string;
  venueId: string;
  sport: SportType;
  name: string;
  pricePerHour: number;
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  description: string;
  amenities: string[];
  images: string[];
  facilities: Facility[];
  reviews: Review[];
}

export interface Booking {
  id: string;
  venueId: string;
  facilityId: string;
  userId: string;
  date: string; // ISO Date string
  slots: string[]; // ["07:00", "08:00"]
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'card' | 'upi' | 'netbanking';
  timestamp: number;
  cancellationReason?: string;
  refundAmount?: number;
}

export interface StudentVerificationData {
  collegeName: string;
  batchYear: string;
  collegeEmail: string;
  idCardFront: File | null;
  idCardBack: File | null;
}