import React from 'react'
import ProfileLink from './ProfileLink'

const HomeHeader = () => {
  return (
    <div className='w-full py-5 flex justify-between border border-black'>
        <h1 className='text-6xl'>SecondsToGo</h1>
        <ProfileLink />
      
    </div>
  )
}

export default HomeHeader
