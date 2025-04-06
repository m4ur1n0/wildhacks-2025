"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/authContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const UserProfileCard = () => {
  const { user } = useAuth()
  const [userType, setUserType] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return

      // Check if user is a farm
      const farmDocRef = doc(db, "farms", user.uid)
      const farmDocSnap = await getDoc(farmDocRef)
      
      if (farmDocSnap.exists() && Object.keys(farmDocSnap.data()).length > 0) {
        setUserType("farm")
        setUserDetails({ id: farmDocSnap.id, ...farmDocSnap.data() })
        setLoading(false)
        return
      }

      // Check if user is a consumer
      const consumerDocRef = doc(db, "consumers", user.uid)
      const consumerDocSnap = await getDoc(consumerDocRef)
      
      if (consumerDocSnap.exists() && Object.keys(consumerDocSnap.data()).length > 0) {
        setUserType("consumer")
        setUserDetails({ id: consumerDocSnap.id, ...consumerDocSnap.data() })
        setLoading(false)
        return
      }

      // If no specific data is found, just use auth data
      setUserType("user")
      setUserDetails(null)
      setLoading(false)
    }

    fetchUserDetails()
  }, [user])

  if (loading) {
    return <div className="p-6 animate-pulse">Loading profile data...</div>
  }

  if (!user) {
    return <div className="p-6">Please sign in to view your profile</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-24 ml-64">
      <h2 className="text-2xl font-bold mb-4">{user.displayName}</h2>
      <div className="flex flex-col gap-2">
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
        {userType === "farm" && (
          <>
            <p className="text-gray-700"><span className="font-semibold">Farm Name:</span> {userDetails?.farmName || "Not specified"}</p>
            <p className="text-gray-700"><span className="font-semibold">Location:</span> {userDetails?.address || "Not specified"}</p>
            <p className="text-gray-700"><span className="font-semibold">Products:</span> {userDetails?.products?.join(", ") || "Not specified"}</p>
            <p className="text-gray-700"><span className="font-semibold">PayPal Email:</span> {userDetails?.paypalEmail || "Not set up"}</p>
          </>
        )}
        {userType === "consumer" && (
          <>
            <p className="text-gray-700"><span className="font-semibold">Address:</span> {userDetails?.address || "Not specified"}</p>
            <p className="text-gray-700"><span className="font-semibold">Preferences:</span> {userDetails?.preferences?.join(", ") || "Not specified"}</p>
          </>
        )}
        <p className="text-gray-700"><span className="font-semibold">Member since:</span> {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}</p>
      </div>
    </div>
  )
}

export default UserProfileCard
