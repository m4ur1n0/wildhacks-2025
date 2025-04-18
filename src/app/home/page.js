import HomeHeader from '@/components/HomeHeader'
import HomePageDescription from '@/components/HomePageDescription'
import HomePageMap from '@/components/HomePageMap'
import React from 'react'

const page = () => {
  return (
    <div className='home-page-full w-screen h-screen p-5 flex flex-col'>
        <HomeHeader />

        <div className='home-page-content h-full flex justify-start items-center gap-2'>

            <HomePageDescription />

            <HomePageMap />

        </div>
    </div>
  )
}

export default page
