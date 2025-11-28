
import { Venue, SportType } from './types';

export const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai', 'Hyderabad', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

export const SPORTS: {name: SportType, icon: string}[] = [
  { name: 'Cricket', icon: '🏏' },
  { name: 'Football', icon: '⚽' },
  { name: 'Badminton', icon: '🏸' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Swimming', icon: '🏊' },
  { name: 'Gym', icon: '💪' },
  { name: 'Table Tennis', icon: '🏓' },
];

export const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'Delhi University', 
  'Mumbai University', 'Anna University', 'VIT Vellore', 'Manipal University'
];

export const DEFAULT_VENUE_IMAGE = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop';

const IMAGES = {
  cricket: 'https://images.unsplash.com/photo-1531415074968-bc2fb8119439?q=80&w=1000&auto=format&fit=crop',
  football: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1626224583764-847890e045b5?q=80&w=1000&auto=format&fit=crop',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=1000&auto=format&fit=crop',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop',
  swimming: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1000&auto=format&fit=crop',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
  tableTennis: 'https://images.unsplash.com/photo-1534158914592-062992bbe900?q=80&w=1000&auto=format&fit=crop',
  venueExterior1: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
  venueExterior2: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000&auto=format&fit=crop',
  venueExterior3: 'https://images.unsplash.com/photo-1562771242-a02d9090c90c?q=80&w=1000&auto=format&fit=crop'
};

const SAMPLE_REVIEWS = [
  { id: 'r1', userId: 'mock1', userName: 'Rahul Sharma', rating: 5, date: '2 days ago', comment: 'Excellent facilities and well maintained turf. Loved playing here!' },
  { id: 'r2', userId: 'mock2', userName: 'Priya Patel', rating: 4, date: '1 week ago', comment: 'Good courts but parking can be an issue on weekends.' },
  { id: 'r3', userId: 'mock3', userName: 'Amit Singh', rating: 5, date: '3 weeks ago', comment: 'Best swimming pool in the area. Very clean water.' },
  { id: 'r4', userId: 'mock4', userName: 'Sneha Gupta', rating: 3, date: '1 month ago', comment: 'Decent place, but the changing rooms need renovation.' },
  { id: 'r5', userId: 'mock5', userName: 'Vikram Malhotra', rating: 4, date: '2 months ago', comment: 'Great lighting for night matches. Staff is very cooperative.' }
];

export const MOCK_VENUES: Venue[] = [
  // Mumbai
  {
    id: 'mum1',
    name: 'Khelgaon Sports Complex',
    city: 'Mumbai',
    address: 'Plot 10, Sports Lane, Andheri West',
    rating: 4.8,
    description: 'Premier sports destination featuring olympic size pools and professional turf grounds.',
    amenities: ['Parking', 'Changing Rooms', 'Showers', 'Equipment Rental', 'Cafe', 'Floodlights'],
    images: [IMAGES.venueExterior1, IMAGES.swimming],
    facilities: [
      { id: 'f_mum1_1', venueId: 'mum1', sport: 'Cricket', name: 'Main Ground', pricePerHour: 1500, image: IMAGES.cricket },
      { id: 'f_mum1_2', venueId: 'mum1', sport: 'Football', name: 'Turf A', pricePerHour: 1200, image: IMAGES.football },
      { id: 'f_mum1_3', venueId: 'mum1', sport: 'Swimming', name: 'Olympic Pool', pricePerHour: 400, image: IMAGES.swimming }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[2], SAMPLE_REVIEWS[4]]
  },
  {
    id: 'mum2',
    name: 'Marine Drive Tennis Club',
    city: 'Mumbai',
    address: 'Marine Drive, Churchgate',
    rating: 4.7,
    description: 'Historic tennis club with sea view courts and modern amenities.',
    amenities: ['Parking', 'Pro Shop', 'Locker Room', 'Cafe'],
    images: [IMAGES.tennis, IMAGES.venueExterior2],
    facilities: [
      { id: 'f_mum2_1', venueId: 'mum2', sport: 'Tennis', name: 'Synthetic Court', pricePerHour: 800, image: IMAGES.tennis },
      { id: 'f_mum2_2', venueId: 'mum2', sport: 'Table Tennis', name: 'Indoor Hall', pricePerHour: 300, image: IMAGES.tableTennis }
    ],
    reviews: [SAMPLE_REVIEWS[1], SAMPLE_REVIEWS[3]]
  },
  
  // Delhi NCR
  {
    id: 'del1',
    name: 'Delhi Sports Hub',
    city: 'Delhi NCR',
    address: 'Sector 21, Dwarka, New Delhi',
    rating: 4.6,
    description: 'A comprehensive facility for tennis and fitness.',
    amenities: ['Parking', 'Coaching', 'Floodlights', 'AC', 'Water Station'],
    images: [IMAGES.venueExterior3, IMAGES.gym],
    facilities: [
      { id: 'f_del1_1', venueId: 'del1', sport: 'Tennis', name: 'Clay Court', pricePerHour: 700, image: IMAGES.tennis },
      { id: 'f_del1_2', venueId: 'del1', sport: 'Gym', name: 'Fitness Center', pricePerHour: 200, image: IMAGES.gym }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[4]]
  },
  {
    id: 'del2',
    name: 'Noida Indoor Stadium',
    city: 'Delhi NCR',
    address: 'Sector 21A, Noida',
    rating: 4.5,
    description: 'Professional indoor stadium for badminton and basketball.',
    amenities: ['AC', 'Changing Rooms', 'Spectator Seating', 'Parking'],
    images: [IMAGES.badminton, IMAGES.basketball],
    facilities: [
      { id: 'f_del2_1', venueId: 'del2', sport: 'Badminton', name: 'Wooden Court 1', pricePerHour: 400, image: IMAGES.badminton },
      { id: 'f_del2_2', venueId: 'del2', sport: 'Basketball', name: 'Main Court', pricePerHour: 600, image: IMAGES.basketball }
    ],
    reviews: [SAMPLE_REVIEWS[2], SAMPLE_REVIEWS[3]]
  },

  // Bangalore
  {
    id: 'blr1',
    name: 'Bangalore Arena',
    city: 'Bangalore',
    address: 'Koramangala 4th Block',
    rating: 4.5,
    description: 'Modern indoor arena perfect for badminton and basketball enthusiasts.',
    amenities: ['AC', 'Locker Room', 'Pro Shop', 'Water Station', 'Cafe'],
    images: [IMAGES.basketball, IMAGES.venueExterior1],
    facilities: [
      { id: 'f_blr1_1', venueId: 'blr1', sport: 'Badminton', name: 'Court 1 (Wooden)', pricePerHour: 500, image: IMAGES.badminton },
      { id: 'f_blr1_2', venueId: 'blr1', sport: 'Basketball', name: 'Indoor Court', pricePerHour: 800, image: IMAGES.basketball }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[1]]
  },
  {
    id: 'blr2',
    name: 'Whitefield Sports City',
    city: 'Bangalore',
    address: 'Whitefield Main Road',
    rating: 4.3,
    description: 'Sprawling complex with multiple football turfs and cricket nets.',
    amenities: ['Parking', 'Floodlights', 'Equipment Rental', 'First Aid'],
    images: [IMAGES.football, IMAGES.cricket],
    facilities: [
      { id: 'f_blr2_1', venueId: 'blr2', sport: 'Football', name: '7-a-side Turf', pricePerHour: 1000, image: IMAGES.football },
      { id: 'f_blr2_2', venueId: 'blr2', sport: 'Cricket', name: 'Net Practice', pricePerHour: 300, image: IMAGES.cricket }
    ],
    reviews: [SAMPLE_REVIEWS[4], SAMPLE_REVIEWS[3]]
  },

  // Chennai
  {
    id: 'chn1',
    name: 'Marina Smash Academy',
    city: 'Chennai',
    address: 'Mylapore, Chennai',
    rating: 4.4,
    description: 'Dedicated badminton facility with BWF approved flooring.',
    amenities: ['AC', 'Changing Rooms', 'Coaching', 'Pro Shop'],
    images: [IMAGES.badminton, IMAGES.venueExterior2],
    facilities: [
      { id: 'f_chn1_1', venueId: 'chn1', sport: 'Badminton', name: 'Pro Court', pricePerHour: 450, image: IMAGES.badminton }
    ],
    reviews: [SAMPLE_REVIEWS[0]]
  },
  {
    id: 'chn2',
    name: 'OMR Sports Village',
    city: 'Chennai',
    address: 'OMR, Chennai',
    rating: 4.6,
    description: 'Large sports village with swimming pool and tennis courts.',
    amenities: ['Parking', 'Showers', 'Cafe', 'Lockers'],
    images: [IMAGES.swimming, IMAGES.tennis],
    facilities: [
      { id: 'f_chn2_1', venueId: 'chn2', sport: 'Swimming', name: 'Lap Pool', pricePerHour: 300, image: IMAGES.swimming },
      { id: 'f_chn2_2', venueId: 'chn2', sport: 'Tennis', name: 'Hard Court', pricePerHour: 600, image: IMAGES.tennis }
    ],
    reviews: [SAMPLE_REVIEWS[2], SAMPLE_REVIEWS[4]]
  },

  // Hyderabad
  {
    id: 'hyd1',
    name: 'Gachibowli Game Zone',
    city: 'Hyderabad',
    address: 'Gachibowli, Hyderabad',
    rating: 4.7,
    description: 'Premium destination for badminton and table tennis.',
    amenities: ['AC', 'Parking', 'Equipment Rental', 'Water Station'],
    images: [IMAGES.badminton, IMAGES.tableTennis],
    facilities: [
      { id: 'f_hyd1_1', venueId: 'hyd1', sport: 'Badminton', name: 'Court A', pricePerHour: 500, image: IMAGES.badminton },
      { id: 'f_hyd1_2', venueId: 'hyd1', sport: 'Table Tennis', name: 'Table 1', pricePerHour: 200, image: IMAGES.tableTennis }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[1]]
  },
  {
    id: 'hyd2',
    name: 'Jubilee Hills Cricket Club',
    city: 'Hyderabad',
    address: 'Jubilee Hills, Hyderabad',
    rating: 4.9,
    description: 'Exclusive cricket grounds and nets for serious practice.',
    amenities: ['Floodlights', 'Coaching', 'Cafe', 'Parking'],
    images: [IMAGES.cricket, IMAGES.venueExterior3],
    facilities: [
      { id: 'f_hyd2_1', venueId: 'hyd2', sport: 'Cricket', name: 'Match Ground', pricePerHour: 2000, image: IMAGES.cricket }
    ],
    reviews: [SAMPLE_REVIEWS[4]]
  },

  // Kolkata
  {
    id: 'kol1',
    name: 'Salt Lake Football Arena',
    city: 'Kolkata',
    address: 'Salt Lake Sector V, Kolkata',
    rating: 4.5,
    description: 'The heart of football in Kolkata with FIFA standard turf.',
    amenities: ['Floodlights', 'Changing Rooms', 'Spectator Seating', 'Parking'],
    images: [IMAGES.football, IMAGES.venueExterior1],
    facilities: [
      { id: 'f_kol1_1', venueId: 'kol1', sport: 'Football', name: 'Turf Ground', pricePerHour: 1100, image: IMAGES.football }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[4]]
  },
  {
    id: 'kol2',
    name: 'Park Street Gymkhana',
    city: 'Kolkata',
    address: 'Park Street, Kolkata',
    rating: 4.4,
    description: 'Heritage club offering tennis and swimming facilities.',
    amenities: ['Locker Room', 'Showers', 'Cafe', 'Member Lounge'],
    images: [IMAGES.tennis, IMAGES.swimming],
    facilities: [
      { id: 'f_kol2_1', venueId: 'kol2', sport: 'Tennis', name: 'Grass Court', pricePerHour: 900, image: IMAGES.tennis },
      { id: 'f_kol2_2', venueId: 'kol2', sport: 'Swimming', name: 'Pool', pricePerHour: 350, image: IMAGES.swimming }
    ],
    reviews: [SAMPLE_REVIEWS[2], SAMPLE_REVIEWS[1]]
  },

  // Pune
  {
    id: 'pun1',
    name: 'Deccan Gymkhana',
    city: 'Pune',
    address: 'Deccan Gymkhana, Pune',
    rating: 4.6,
    description: 'Multi-sport facility famous for cricket and tennis.',
    amenities: ['Parking', 'Coaching', 'Cafe', 'Pro Shop'],
    images: [IMAGES.cricket, IMAGES.tennis],
    facilities: [
      { id: 'f_pun1_1', venueId: 'pun1', sport: 'Cricket', name: 'Nets', pricePerHour: 400, image: IMAGES.cricket },
      { id: 'f_pun1_2', venueId: 'pun1', sport: 'Tennis', name: 'Court 1', pricePerHour: 600, image: IMAGES.tennis }
    ],
    reviews: [SAMPLE_REVIEWS[0]]
  },
  {
    id: 'pun2',
    name: 'Viman Nagar Sports Club',
    city: 'Pune',
    address: 'Viman Nagar, Pune',
    rating: 4.3,
    description: 'Community sports center with gym and badminton.',
    amenities: ['AC', 'Showers', 'Lockers'],
    images: [IMAGES.gym, IMAGES.badminton],
    facilities: [
      { id: 'f_pun2_1', venueId: 'pun2', sport: 'Gym', name: 'Day Pass', pricePerHour: 150, image: IMAGES.gym },
      { id: 'f_pun2_2', venueId: 'pun2', sport: 'Badminton', name: 'Court', pricePerHour: 400, image: IMAGES.badminton }
    ],
    reviews: [SAMPLE_REVIEWS[3], SAMPLE_REVIEWS[4]]
  },

  // Ahmedabad
  {
    id: 'ahm1',
    name: 'Gujarat Sports City',
    city: 'Ahmedabad',
    address: 'SG Highway, Ahmedabad',
    rating: 4.7,
    description: 'State-of-the-art complex with cricket and swimming.',
    amenities: ['Parking', 'Floodlights', 'Changing Rooms', 'Cafe'],
    images: [IMAGES.venueExterior2, IMAGES.cricket],
    facilities: [
      { id: 'f_ahm1_1', venueId: 'ahm1', sport: 'Cricket', name: 'Box Cricket', pricePerHour: 1200, image: IMAGES.cricket },
      { id: 'f_ahm1_2', venueId: 'ahm1', sport: 'Swimming', name: 'Pool', pricePerHour: 300, image: IMAGES.swimming }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[2]]
  },
  {
    id: 'ahm2',
    name: 'Navrangpura Tennis Academy',
    city: 'Ahmedabad',
    address: 'Navrangpura, Ahmedabad',
    rating: 4.4,
    description: 'Professional tennis coaching and booking.',
    amenities: ['Coaching', 'Equipment Rental', 'Water Station'],
    images: [IMAGES.tennis, IMAGES.venueExterior3],
    facilities: [
      { id: 'f_ahm2_1', venueId: 'ahm2', sport: 'Tennis', name: 'Court 1', pricePerHour: 500, image: IMAGES.tennis }
    ],
    reviews: [SAMPLE_REVIEWS[1]]
  },

  // Jaipur
  {
    id: 'jai1',
    name: 'Pink City Sports Complex',
    city: 'Jaipur',
    address: 'Raja Park, Jaipur',
    rating: 4.5,
    description: 'Large complex offering cricket, football, and gym.',
    amenities: ['Parking', 'Showers', 'Cafe', 'Lockers'],
    images: [IMAGES.cricket, IMAGES.gym],
    facilities: [
      { id: 'f_jai1_1', venueId: 'jai1', sport: 'Cricket', name: 'Main Ground', pricePerHour: 1000, image: IMAGES.cricket },
      { id: 'f_jai1_2', venueId: 'jai1', sport: 'Gym', name: 'Workout Zone', pricePerHour: 200, image: IMAGES.gym }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[4]]
  },
  {
    id: 'jai2',
    name: 'Vaishali Nagar Badminton Hall',
    city: 'Jaipur',
    address: 'Vaishali Nagar, Jaipur',
    rating: 4.2,
    description: 'Indoor badminton hall with synthetic courts.',
    amenities: ['AC', 'Changing Rooms', 'Water Station'],
    images: [IMAGES.badminton, IMAGES.venueExterior1],
    facilities: [
      { id: 'f_jai2_1', venueId: 'jai2', sport: 'Badminton', name: 'Court A', pricePerHour: 350, image: IMAGES.badminton }
    ],
    reviews: [SAMPLE_REVIEWS[3]]
  },

  // Lucknow
  {
    id: 'luc1',
    name: 'Gomti Nagar Stadium',
    city: 'Lucknow',
    address: 'Gomti Nagar, Lucknow',
    rating: 4.6,
    description: 'Multi-purpose stadium for cricket and football.',
    amenities: ['Floodlights', 'Spectator Seating', 'Parking', 'First Aid'],
    images: [IMAGES.venueExterior2, IMAGES.football],
    facilities: [
      { id: 'f_luc1_1', venueId: 'luc1', sport: 'Cricket', name: 'Stadium Ground', pricePerHour: 2500, image: IMAGES.cricket },
      { id: 'f_luc1_2', venueId: 'luc1', sport: 'Football', name: 'Practice Turf', pricePerHour: 800, image: IMAGES.football }
    ],
    reviews: [SAMPLE_REVIEWS[0], SAMPLE_REVIEWS[2]]
  },
  {
    id: 'luc2',
    name: 'Hazratganj Fitness Club',
    city: 'Lucknow',
    address: 'Hazratganj, Lucknow',
    rating: 4.3,
    description: 'Central fitness club with gym and table tennis.',
    amenities: ['AC', 'Locker Room', 'Showers'],
    images: [IMAGES.gym, IMAGES.tableTennis],
    facilities: [
      { id: 'f_luc2_1', venueId: 'luc2', sport: 'Gym', name: 'Gym Floor', pricePerHour: 250, image: IMAGES.gym },
      { id: 'f_luc2_2', venueId: 'luc2', sport: 'Table Tennis', name: 'TT Hall', pricePerHour: 150, image: IMAGES.tableTennis }
    ],
    reviews: [SAMPLE_REVIEWS[3], SAMPLE_REVIEWS[1]]
  }
];
