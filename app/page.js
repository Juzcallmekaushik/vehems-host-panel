'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import NavBar from '../components/NavBar'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const sessionToken = localStorage.getItem('hostSession')
      
      if (!sessionToken) {
        router.replace('/login')
      } else {
        setIsAuthenticated(true)
        setLoading(false)
        router.replace('/home')
      }
    }

    checkAuth()
  }, [router])


  return (
    <div style={{
      minHeight: "100vh",
      background: "#272D22",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Image
        src="/logos/favicon.png"
        alt="Loading..."
        width={64}
        height={64}
        style={{
          animation: "pulse 1s ease-in-out infinite",
        }}
        priority
      />
    </div>
  )
}