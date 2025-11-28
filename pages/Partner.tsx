import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export const Partner: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Partner with KhelO</h1>
          <p className="mt-4 text-lg text-gray-600">List your sports facility and reach thousands of players in your city.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h2>
            <div className="space-y-6">
              {[
                "Increase your venue occupancy by up to 40%",
                "Automated booking management system",
                "Secure online payments and instant settlements",
                "Marketing exposure to thousands of students and players",
                "Dedicated support team for partners"
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-0.5" />
                  <span className="ml-3 text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">Our partnership team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                  <input type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-primary focus:border-primary">
                    <option>Mumbai</option>
                    <option>Delhi NCR</option>
                    <option>Bangalore</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <textarea rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-primary focus:border-primary"></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Submit Interest
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};