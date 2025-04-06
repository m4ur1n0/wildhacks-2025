import ProfileBanner from '@/components/ProfileBanner'
import React from 'react'

const page = () => {


  return (
    <div className='profile-page-full w-screen h-screen flex flex-col'>
        <div className='user-information flex flex-col gap-10'>
           <ProfileBanner image_source={'/images/produce-farm-2.jpg'} />
        </div>

        
    </div>
  )
}

export default page
