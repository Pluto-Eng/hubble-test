"use client"
import { useSession } from "next-auth/react"

export default function ClientComponent() {
  const { data: session } = useSession()
  
  return (
    <div>
      <p>Email: {session?.user?.email || 'No email available'}</p>
    </div>
  )
}