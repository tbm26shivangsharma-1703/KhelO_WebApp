import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useApp();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-3xl font-bold text-primary tracking-tighter">KhelO</span>
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${isActive('/') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/venues"
                className={`${isActive('/venues') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Browse Venues
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative flex items-center gap-4">
                 {user.type === 'student' && user.verificationStatus === 'verified' && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-400">Student Verified</span>
                 )}
                 {user.type === 'student' && user.verificationStatus === 'pending' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-yellow-400">Verification Pending</span>
                 )}

                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 p-1">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={toggleMenu} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">Home</Link>
            <Link to="/venues" onClick={toggleMenu} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">Browse Venues</Link>
            {user && (
              <Link to="/dashboard" onClick={toggleMenu} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">Dashboard</Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            {user ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <button onClick={() => { logout(); toggleMenu(); }} className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="px-4 flex gap-2">
                <Link to="/login" onClick={toggleMenu} className="block text-center w-full px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Log in
                </Link>
                <Link to="/signup" onClick={toggleMenu} className="block text-center w-full px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-emerald-700">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
