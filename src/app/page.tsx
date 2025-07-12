'use client'

import { useSession } from 'next-auth/react'
import AuthButton from '../components/AuthButton'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Main page</h1>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Welcome to StackIt</h2>
          <p className="text-gray-400">
            This is your main dashboard. Use the navigation above to access different features.
          </p>
        </div>
      </div>
    </div>
  )
}
