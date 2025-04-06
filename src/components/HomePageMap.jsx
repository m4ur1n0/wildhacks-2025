import React from 'react'
import MapComponent from './MapComponent'
import { Card, CardContent } from './ui/card'

const HomePageMap = () => {
  return (
    <div className='home-page-map w-[60%] h-full'>

        <Card className="h-full flex  p-4">
            <CardContent className="h-full w-full overflow-hidden">
                <MapComponent />
            </CardContent>

        </Card>
      
    </div>
  )
}

export default HomePageMap
