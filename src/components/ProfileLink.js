"use client"
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ProfileLink = () => {
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/');
        }
    }, [user])

    function handleProfileClick() {
        router.push('/profile');
    }

  return (
    <div className='profile-picture-and-link absolute top-3 right-3 w-[40px] h-[40px]' onClick={handleProfileClick}>
        <img src={user.photoURL} className='profile-photo rounded-full' />
    </div>
  )
}

export default ProfileLink
