import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="px-2">
      <div className="flex flex-col font-primary">
        <div className="relative">
          <button
            className="flex items-center rounded-xl py-2.5 px-2.5 w-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="self-center mr-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="max-w-[30px] object-cover rounded-full"
                  alt="User profile"
                />
              ) : (
                <div className="w-[30px] h-[30px] bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>
            <div className="self-center font-medium flex-1 text-left">
              {user?.name || 'User'}
            </div>
            <div className="self-center">
              <svg
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;