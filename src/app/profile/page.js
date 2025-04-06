"use client"
import ProfileBanner from '@/components/ProfileBanner'
import SupportingFarms from '@/components/SupportingFarms'
import ProfileDebugHelper from '@/components/ProfileDebugHelper'
import { useAuth } from '@/context/authContext'
import Link from 'next/link'
import React from 'react'

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='animate-spin text-2xl'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='w-screen h-screen flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold mb-4'>Please sign in to view your profile</h1>
        <Link href="/" className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'>
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className='profile-page-full w-full min-h-screen flex flex-col pb-20'>
      <div className='relative'>
        <ProfileBanner image_source={'/images/produce-farm-2.jpg'} />
        <button 
          onClick={logout}
          className='absolute top-4 right-4 px-4 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-100 transition-colors'
        >
          Sign Out
        </button>
      </div>
      
      <div className='user-content max-w-7xl mx-auto w-full px-4 mt-24'>
        <SupportingFarms />
      </div>

      {/* Debug helper - only visible in development */}
      {process.env.NODE_ENV === 'development' && <ProfileDebugHelper />}
    </div>
  )
}

export default ProfilePage
