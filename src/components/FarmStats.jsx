import React from 'react'
import FarmDataStat from './FarmDataStat'

const FarmStats = ( {numSharesLeft, pricePerShare, deliveryStyle} ) => {
  return (
    <div className='farm-stats-list flex mt-2 gap-3'>
      <FarmDataStat stat={(deliveryStyle === 'pickup' ? "Pick Up" : "Dropoff Point")} />
      <FarmDataStat stat={`Price per share : $${pricePerShare}`} />
      <FarmDataStat stat={`${numSharesLeft} shares left.`}/>

    </div>
  )
}

export default FarmStats
