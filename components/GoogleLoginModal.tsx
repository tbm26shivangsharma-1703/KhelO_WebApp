import React from 'react';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, avatar: string) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ isOpen, onClose, onSelectAccount }) => {
  if (!isOpen) return null;

  const mockAccounts = [
    { name: 'John Doe', email: 'john.doe@gmail.com', avatar: 'J' },
    { name: 'Sarah Smith', email: 'sarah.s@gmail.com', avatar: 'S' },
    { name: 'KhelO User', email: 'user@khelo.in', avatar: 'K' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden transform transition-all scale-100">
        <div className="p-6 pb-2 border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <h3 className="text-center text-xl font-medium text-gray-800">Choose an account</h3>
          <p className="text-center text-sm text-gray-500 mt-1">to continue to KhelO</p>
        </div>
        
        <div className="py-2">
          {mockAccounts.map((acc) => (
            <button
              key={acc.email}
              onClick={() => onSelectAccount(acc.email, acc.name, `https://ui-avatars.com/api/?name=${acc.name}&background=random`)}
              className="w-full px-8 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
                {acc.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">{acc.name}</div>
                <div className="text-xs text-gray-500">{acc.email}</div>
              </div>
            </button>
          ))}
          <button className="w-full px-8 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
             <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
             <div className="text-sm font-medium text-gray-700">Use another account</div>
          </button>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
             Cancel
           </button>
        </div>
      </div>
    </div>
  );
};