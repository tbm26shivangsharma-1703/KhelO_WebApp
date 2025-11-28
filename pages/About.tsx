import React from 'react';
import { Shield, Target, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About KhelO</h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering the athlete in everyone by making sports facilities accessible, affordable, and easy to book.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto text-gray-500">
          <p className="lead text-xl text-gray-700 mb-8">
            KhelO was born from a simple frustration: the difficulty of finding and booking good quality sports venues in India. We believe playing sports should be as easy as ordering food online.
          </p>
          <p className="mb-6">
            We connect sports enthusiasts with premium facilities across major Indian cities including Mumbai, Delhi NCR, Bangalore, and more. Whether you're a weekend warrior, a student athlete, or a professional team, KhelO provides a seamless platform to "Book Your Game".
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
             <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <Target size={24} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
             <p className="text-gray-600">To build India's largest network of sports facilities and encourage a healthier, active lifestyle for everyone.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
             <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <Users size={24} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Student Focus</h3>
             <p className="text-gray-600">We specially cater to students with exclusive discounts and verification systems, making fitness affordable.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
             <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <Shield size={24} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Quality</h3>
             <p className="text-gray-600">Every venue listed on KhelO is verified for quality, amenities, and safety standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};