'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { useState } from 'react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/auth/signin')
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">StackIt</h1>
            <span className="ml-2 text-sm text-gray-400">Task Management</span>
          </div>
          
          {status === 'loading' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            </div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-300 hidden sm:block">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '...' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
    