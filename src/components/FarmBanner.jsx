"use client"
import { useAuth } from '@/context/authContext'
import React from 'react'

const FarmBanner = ({image_source, profile_source}) => {
    const {user} = useAuth();
  return (
    <div>
        <div className='profile-banner w-full h-[280px] overflow-hidden'>
            <img src={image_source} className='w-full object-cover' />
        </div>
        <div className='profile-picture absolute overflow-hidden top-32 left-10 w-[280px] h-[280px] border border-gray-300 border-2 rounded-lg flex items-center justify-center bg-gray-200'>
            <img className='rounded-lg w-[270px] h-[270px] object-cover' src={profile_source} />
        </div>
    </div>
  )
}

export default FarmBanner
