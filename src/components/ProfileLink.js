"use client"
import { useAuth } from '@/context/authContext'
import React from 'react'

const ProfileLink = () => {
    const {user} = useAuth();
  return (
    <div className='profile-picture-and-link absolute top-3 right-3 w-[40px] h-[40px]'>
        <img src={user.photoURL} className='profile-photo rounded-full' />
    </div>
  )
}

export default ProfileLink
