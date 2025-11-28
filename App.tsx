
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { BrowseVenues } from './pages/BrowseVenues';
import { VenueDetails } from './pages/VenueDetails';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Partner } from './pages/Partner';
import { ForgotPassword } from './pages/ForgotPassword';
import { CITIES } from './constants';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-primary mb-4">KhelO</h3>
        <p className="text-gray-400 text-sm">Empowering sports culture in India. Book, Play, Repeat.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><Link to="/venues" className="hover:text-primary transition-colors">Browse Venues</Link></li>
          <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          <li><Link to="/partner" className="hover:text-primary transition-colors">Partner with Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Cities</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          {CITIES.slice(0, 5).map(city => (
            <li key={city}>{city}</li>
          ))}
          {CITIES.length > 5 && (
             <li><Link to="/venues" className="hover:text-primary">View All Cities...</Link></li>
          )}
        </ul>
      </div>
      <div>
         <h4 className="font-bold mb-4">Contact</h4>
         <p className="text-sm text-gray-400">support@khelo.in</p>
         <p className="text-sm text-gray-400">+91 98765 43210</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/venues" element={<BrowseVenues />} />
              <Route path="/venue/:id" element={<VenueDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
