"use client"
import FarmBanner from '@/components/FarmBanner';
import FarmStats from '@/components/FarmStats';
import InSeasonItem from '@/components/InSeasonItem';
import { getFarm } from '@/lib/db';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [farmId, setFarmId] = useState('');
    const [farmData, setFarmData] = useState(null);  // Initially null to indicate loading state

    // Function to fetch and set farm data
    async function getAndSetFarmData(fid) {
        if (!fid) return;
        const farm = await getFarm(fid);
        setFarmData(farm);
    }

    useEffect(() => {
        // Initial setting of the farm ID from hash
        const fid = window.location.hash.replace(/^#/, '');
        setFarmId(fid);
    }, []);  // Empty dependency array ensures it runs only once on initial render

    useEffect(() => {
        // Fetch farm data when the farmId changes
        if (farmId) {
            getAndSetFarmData(farmId);
        }
    }, [farmId]);  // Trigger when farmId state changes

    // Check if data is still being fetched
    if (farmData === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className='farm-page w-screen h-screen'>
            {farmData && (
            <div className='user-information flex flex-col gap-10'>
                
                    <FarmBanner image_source={'/images/produce-farm-2.jpg'} profile_source={farmData.profilePhoto} />

                    <div className='farm-page-title-info ml-[25%] w-1/2'>
                        <h1>{farmData.name}</h1>
                        <FarmStats numSharesLeft={farmData.numSharesLeft} pricePerShare={farmData.pricePerShare} deliveryStyle={farmData.deliveryStyle} />
                    </div>

                    <div className='farm-description ml-10 w-1/2 text-2xl'>
                        <p>{farmData.bio}</p>
                    </div>

                    <div className='in-season ml-10 w-1/2'>
                        <h2 className='mb-3'>What's in season?</h2>
                        {
                            farmData.inSeason ?
                            farmData.inSeason.map((produce, idx) => (
                                <InSeasonItem name={produce} key={idx} />
                            ))
                            :
                            <p>It looks like <span className='font-bold'>{farmData.name}</span> hasn't updated their page with the seasonal produce quite yet.</p>
                        }
                    </div>
            </div>
            )}

        </div>
    );
};

export default Page;
