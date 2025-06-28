import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to TrendWise!</h1>
                <p className="text-gray-600">This is a Next.js application with NextAuth and Google authentication.</p>
                <p className="text-gray-600">Feel free to explore and modify the code!</p>
                
                <div className="pt-6 space-y-4">
                  <Link
                    href="/api/auth/signin"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors inline-block"
                  >
                    Sign In with Google
                  </Link>
                  
                  <div>
                    <Link
                      href="/protected"
                      className="text-blue-500 hover:text-blue-600 underline"
                    >
                      Go to Protected Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
