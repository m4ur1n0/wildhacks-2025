import React from 'react'
import ProfileLink from './ProfileLink'

const HomeHeader = () => {
  return (
    <div className='w-full py-5 flex justify-between items-center'>
        <div className='logo-and-title flex items-center'>
            <div className='image-container h-[10vh] w-[10vh]'>
                <img className='' src='/images/seconds-to-go-logo-text-clear.png' />
            </div>
            <h1 className='text-6xl'>SecondsToGo</h1>
        </div>
        <ProfileLink />
      
    </div>
  )
}

export default HomeHeader
