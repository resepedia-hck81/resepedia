'use client'
import Link from "next/link";
import { useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({
    username: "Meimei",
    email: "Meimei@mail.com",
    isPremium: false,
    tokenCount: 4
  });

  const totalTokens = 7;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link href="/" className="inline-block text-gray-700 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white text-red-600 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-red-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Membership Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Membership Status</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${user.isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 16 16">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 1-.3.738l-4.462 2.083a.562.562 0 0 1-.758-.302l-.5-1.222a.562.562 0 0 1 .302-.758l4.057-1.893a.563.563 0 0 0 .302-.758l-1.28-3.077a.562.562 0 0 0-.758-.302L6.996 5.21a.562.562 0 0 0-.302.758l.5 1.222a.562.562 0 0 1-.302.758l-4.462 2.083a.562.562 0 0 1-.758-.302L.074 4.617a.562.562 0 0 1 .302-.758L5.337 1.32a.562.562 0 0 1 .758.302l2.398 5.793a.562.562 0 0 0 .758.302l2.398-1.115a.562.562 0 0 0 .302-.758l-.311-.746a.562.562 0 0 1 .302-.758l1.05-.49a.562.562 0 0 1 .758.302l1.736 4.187z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.isPremium ? 'Premium Member' : 'Free Member'}</h3>
                    <p className="text-sm text-gray-600">{user.isPremium ? 'Unlimited access to all recipes' : 'Limited access to recipes'}</p>
                  </div>
                </div>
                {!user.isPremium && (
                  <Link href="/premium" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors">
                    Upgrade to Premium
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Token Count */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recipe Tokens</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-200 text-yellow-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Available Tokens</h3>
                    <p className="text-sm text-gray-600">
                      {user.isPremium 
                        ? 'Unlimited tokens with Premium membership' 
                        : `You have ${user.tokenCount} token${user.tokenCount !== 1 ? 's' : ''} remaining`}
                    </p>
                  </div>
                </div>
                {!user.isPremium && user.tokenCount === 0 && (
                  <Link href="/premium" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors">
                    Get More Tokens
                  </Link>
                )}
              </div>

              {!user.isPremium && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${(user.tokenCount / totalTokens) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.tokenCount} of {totalTokens} tokens available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Link 
              href="/login"
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <div className="bg-gray-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </div>
              <span className="font-medium">Log Out</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
