"use client"
import { useAuth } from '@/context/authContext'
import React from 'react'

const ProfileBanner = ({image_source}) => {
    const {user} = useAuth();
  return (
    <div className="relative">
        <div className='profile-banner w-full h-[280px] overflow-hidden'>
            <img src={image_source} className='w-full object-cover' />
        </div>
        <div className='profile-content flex flex-col ml-10'>
          <div className='profile-picture relative -top-24 w-[210px] h-[210px] border border-gray-300 border-2 rounded-full flex items-center justify-center bg-gray-200 mb-2'>
              <img className='rounded-full w-[200px] h-[200px]' src={user.photoURL} />
          </div>
          <div className='relative -top-16'>
            <h1 className='text-2xl font-bold'>{user.displayName}</h1>
          </div>
        </div>
    </div>
  )
}

export default ProfileBanner
