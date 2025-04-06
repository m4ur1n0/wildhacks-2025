import React from 'react'

const InSeasonItem = ({name}) => {
  return (
    <div className='farm-data-stat rounded-full px-4 py-1 bg-green-200 border border-green-300'>
        <p className='text-lg'>{name}</p>
      
    </div>
  )
}

export default InSeasonItem
