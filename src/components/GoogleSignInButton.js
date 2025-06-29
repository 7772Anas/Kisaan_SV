import React from 'react';

const GoogleSignInButton = () => (
  // TODO: Replace with real OAuth logic.
  <button
    type="button"
    onClick={() => console.log("Google Sign-in Clicked")}
    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-sm py-2 px-4 font-medium hover:scale-105 transition-transform duration-150 focus:outline-none"
  >
    <span className="flex items-center">
      <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.76 7.3v6.06h7.7c4.5-4.14 7.092-10.24 7.092-17.676z" fill="#4285F4"/>
          <path d="M24.48 48c6.48 0 11.92-2.14 15.88-5.82l-7.7-6.06c-2.14 1.44-4.88 2.3-8.18 2.3-6.28 0-11.6-4.24-13.5-9.98H2.7v6.24C6.68 43.82 14.88 48 24.48 48z" fill="#34A853"/>
          <path d="M10.98 28.44c-.5-1.44-.8-2.98-.8-4.44s.3-3 .8-4.44v-6.24H2.7A23.98 23.98 0 000 24c0 3.98.96 7.76 2.7 11.24l8.28-6.8z" fill="#FBBC05"/>
          <path d="M24.48 9.52c3.54 0 6.68 1.22 9.16 3.62l6.84-6.84C36.4 2.14 30.96 0 24.48 0 14.88 0 6.68 4.18 2.7 10.76l8.28 6.24c1.9-5.74 7.22-9.98 13.5-9.98z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </span>
    <span>Continue with Google</span>
  </button>
);

export default GoogleSignInButton; 