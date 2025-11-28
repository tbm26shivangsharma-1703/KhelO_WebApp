
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'regular' | 'student'>('regular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // If user is already logged in, redirect based on status
  useEffect(() => {
    if (user) {
       if (user.type === 'student' && user.verificationStatus !== 'verified') {
         navigate('/student-verification');
       } else {
         navigate('/dashboard');
       }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password && name) {
       setLoading(true);
       setError(null);
       
       const result = await signup(email, password, name, userType);
       
       setLoading(false);
       
       if (result.error) {
         setError(result.error);
       } else if (result.verificationRequired) {
         // Show check email screen
         setVerificationSent(true);
       } else {
         // Auto login happened (Email confirm disabled), useEffect handles redirect
       }
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <span className="font-medium text-gray-900">{email}</span>. 
              Please click the link to verify your account and log in.
            </p>
            <Link to="/login" className="text-primary font-medium hover:text-emerald-600">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create KhelO Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('regular')}
                  className={`py-3 px-4 border rounded-md text-sm font-medium flex flex-col items-center justify-center bg-white ${userType === 'regular' ? 'border-primary bg-green-50 text-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Regular User
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`py-3 px-4 border rounded-md text-sm font-medium flex flex-col items-center justify-center bg-white ${userType === 'student' ? 'border-primary bg-green-50 text-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Student
                  <span className="text-xs text-green-600 font-normal">Get 20% OFF</span>
                </button>
              </div>
            </div>

            <div>
              <button disabled={loading} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
           <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-primary hover:text-emerald-500">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
