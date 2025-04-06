"use client"
import { useAuth } from '@/context/authContext'
import React from 'react'

const ProfileBanner = ({image_source}) => {
    const {user} = useAuth();
  return (
    <div>
        <div className='profile-banner w-full h-[280px] overflow-hidden'>
            <img src={image_source} className='w-full object-cover' />
        </div>
        <div className='profile-picture absolute overflow-hidden top-32 left-10 w-[210px] h-[210px] border border-gray-300 border-2 rounded-full flex items-center justify-center bg-gray-200'>
            <img className='rounded-full w-[200px] h-[200px]' src={user.photoURL} />
        </div>
    </div>
  )
}

export default ProfileBanner
