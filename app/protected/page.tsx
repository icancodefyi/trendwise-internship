import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const ProtectedPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Protected Page</h1>
                <p>Welcome, {session.user?.name}!</p>
                <p className="text-sm text-gray-600">Only accessible to authenticated users.</p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Your Session Info:</h2>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  {session.user?.image && (
                    <div className="mt-2">
                      <strong>Avatar:</strong>
                      <img 
                        src={session.user.image} 
                        alt="User avatar" 
                        className="w-12 h-12 rounded-full ml-2 inline-block"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <a
                    href="/api/auth/signout"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProtectedPage
