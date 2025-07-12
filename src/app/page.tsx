'use client'

import { useSession } from 'next-auth/react'
import AuthButton from '../components/AuthButton'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div>
        <h1>
          Main page 
        </h1>
      </div>
    </div>
  )
}
