'use client'

import { useSession } from 'next-auth/react'
import AuthButton from '../components/AuthButton'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">StackIt</h1>
              <span className="ml-2 text-sm text-gray-400">Task Management</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <div>
        <h1>
          Main page 
        </h1>
      </div>
    </div>
  )
}
