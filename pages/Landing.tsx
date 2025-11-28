
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CreditCard, Search, Zap } from 'lucide-react';
import { SPORTS } from '../constants';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop"
            alt="Sports background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Book Your Game, <br className="hidden sm:block" />
            <span className="text-primary">Own Your Moment</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Connect with premium sports facilities across India's major cities. 
            Simple booking, transparent pricing, and instant confirmation.
          </p>
          <div className="mt-10 max-w-sm sm:flex sm:max-w-none gap-4">
            <Link
              to="/venues"
              className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all"
            >
              Browse Venues
            </Link>
            <Link
              to="/signup"
              className="mt-3 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 sm:mt-0 shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Sports Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Popular Sports</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {SPORTS.map((sport) => (
              <Link to={`/venues?sport=${sport.name}`} key={sport.name} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-50 p-6 flex flex-col items-center justify-center border border-gray-100 hover:border-primary/30">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{sport.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{sport.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How KhelO Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Find Venue", desc: "Search by city, sport, and date" },
              { icon: Calendar, title: "Pick Slots", desc: "Select multiple time slots easily" },
              { icon: Zap, title: "Instant Booking", desc: "Book your slot instantly" },
              { icon: CreditCard, title: "Book Securely", desc: "Pay via UPI or Card in seconds" }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-primary">
                  <step.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                Revolutionizing Sports Booking in India
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                KhelO connects sports enthusiasts with premium facilities across major metros to offer seamless, affordable access to cricket grounds, football turfs, badminton courts, and more.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We make booking sports venues simple, transparent, and accessible. Book multiple slots, pay securely, and focus on what matters - your game.
              </p>
              <Link to="/venues" className="inline-flex items-center text-primary font-bold hover:text-emerald-700">
                Explore Venues <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-64 lg:h-96">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop" 
                alt="Active lifestyle" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
