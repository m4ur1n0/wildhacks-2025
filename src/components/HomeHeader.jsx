import React from 'react'
import ProfileLink from './ProfileLink'

const HomeHeader = () => {
  return (
    <div className='w-full py-5 flex justify-between '>
        <div className='logo-and-title flex'>
            <img className='scale-[0.2]' src='/images/seconds-to-go-logo-text-clear.png' />
            <h1 className='text-6xl'>SecondsToGo</h1>

        </div>
        <ProfileLink />
      
    </div>
  )
}

export default HomeHeader
