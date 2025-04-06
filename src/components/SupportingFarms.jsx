"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/authContext'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const SupportingFarms = () => {
  const { user } = useAuth()
  const [supportedFarms, setSupportedFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState({ 
    consumerData: null, 
    farmIds: null, 
    error: null, 
    usingLocalFallback: false,
    rawFarmData: null
  })

  // Create some demo farms as fallback when Firebase permissions fail
  const getDemoFarms = () => {
    return [
      {
        id: "demo-farm-1",
        farmName: "Green Valley Organics",
        address: "123 Valley Road, Greenville, CA",
        products: ["Organic Vegetables", "Herbs", "Fresh Eggs"],
        paypalEmail: "info@greenvalleyorganics.com",
        profilePhoto: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2938&auto=format&fit=crop"
      },
      {
        id: "demo-farm-2",
        farmName: "Sunrise Family Farm",
        address: "456 Sunrise Lane, Hillside, OR",
        products: ["Dairy", "Cheese", "Meat"],
        paypalEmail: "contact@sunrisefarm.com",
        profilePhoto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
      },
      {
        id: "demo-farm-3",
        farmName: "Heritage Apples & Orchard",
        address: "789 Orchard Way, Applewood, WA",
        products: ["Apples", "Pears", "Cider"],
        paypalEmail: "sales@heritageorchard.com",
        profilePhoto: "https://images.unsplash.com/photo-1606594154332-5bc18fb526fd?q=80&w=2940&auto=format&fit=crop"
      }
    ];
  };

  useEffect(() => {
    const fetchSupportedFarms = async () => {
      if (!user) return

      try {
        // First, get the consumer data to check for activeEngagements
        const consumerDocRef = doc(db, "consumers", user.uid)
        const consumerSnap = await getDoc(consumerDocRef)
        
        console.log("User ID:", user.uid)
        console.log("Consumer data:", consumerSnap.exists() ? consumerSnap.data() : "No consumer data found")
        
        let farmIds = []
        
        if (consumerSnap.exists()) {
          const consumerData = consumerSnap.data()
          setDebugInfo(prev => ({ ...prev, consumerData }))
          
          // Handle different possible structures of activeEngagements
          if (consumerData.activeEngagements) {
            if (Array.isArray(consumerData.activeEngagements)) {
              farmIds = consumerData.activeEngagements
            } else if (typeof consumerData.activeEngagements === 'object') {
              // In case activeEngagements is an object with farm IDs as keys
              farmIds = Object.keys(consumerData.activeEngagements)
            }
          }
          
          console.log("Farm IDs from activeEngagements:", farmIds)
          setDebugInfo(prev => ({ ...prev, farmIds }))
        }
        
        const farms = []
        
        // If there are active engagements, fetch the farm details
        if (farmIds && farmIds.length > 0) {
          // For each farm ID, fetch the farm details
          for (const farmId of farmIds) {
            console.log("Fetching farm with ID:", farmId)
            const farmDocRef = doc(db, "farms", farmId)
            const farmSnap = await getDoc(farmDocRef)
            
            if (farmSnap.exists()) {
              const farmData = farmSnap.data();
              console.log("Farm data found:", farmData)
              
              // Save raw farm data for debugging
              setDebugInfo(prev => ({
                ...prev, 
                rawFarmData: prev.rawFarmData ? [...prev.rawFarmData, farmData] : [farmData]
              }));
              
              // Normalize farm data by checking for various possible field names
              const normalizedFarm = {
                id: farmSnap.id,
                farmName: farmData.farmName || farmData.name || farmData.farmname || farmData.businessName || `Farm ${farmSnap.id.substring(0, 5)}`,
                address: farmData.address || farmData.location || farmData.farmAddress || "",
                products: Array.isArray(farmData.products) ? farmData.products : 
                          Array.isArray(farmData.productTypes) ? farmData.productTypes : 
                          farmData.product ? [farmData.product] : [],
                paypalEmail: farmData.paypalEmail || farmData.email || farmData.paypal || "",
                profilePhoto: farmData.profilePhoto || farmData.photo || farmData.image || farmData.imageUrl || ""
              };
              
              farms.push(normalizedFarm);
            } else {
              console.log(`Farm with ID ${farmId} not found in database, creating dummy farm`)
              // Create a dummy farm for testing purposes if the farm doesn't exist
              farms.push({
                id: farmId,
                farmName: `Farm ${farmId.substring(0, 5)}`,
                address: "123 Farm Road",
                products: ["Produce", "Dairy"],
                paypalEmail: "farm@example.com",
                profilePhoto: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2940&auto=format&fit=crop"
              })
            }
          }
        } else {
          // If no active engagements, try to get farms the user has transacted with
          console.log("No activeEngagements found, checking transactions")
          
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid)
          )
          
          const transactionsSnap = await getDocs(transactionsQuery)
          const transactionFarmIds = new Set()
          
          transactionsSnap.forEach(doc => {
            if (doc.data().recipientId) {
              transactionFarmIds.add(doc.data().recipientId)
            }
          })
          
          console.log("Farm IDs from transactions:", Array.from(transactionFarmIds))
          
          if (transactionFarmIds.size > 0) {
            for (const farmId of transactionFarmIds) {
              const farmDocRef = doc(db, "farms", farmId)
              const farmSnap = await getDoc(farmDocRef)
              
              if (farmSnap.exists()) {
                const farmData = farmSnap.data();
                
                // Normalize farm data
                const normalizedFarm = {
                  id: farmSnap.id,
                  farmName: farmData.farmName || farmData.name || farmData.farmname || farmData.businessName || `Farm ${farmSnap.id.substring(0, 5)}`,
                  address: farmData.address || farmData.location || farmData.farmAddress || "",
                  products: Array.isArray(farmData.products) ? farmData.products : 
                            Array.isArray(farmData.productTypes) ? farmData.productTypes : 
                            farmData.product ? [farmData.product] : [],
                  paypalEmail: farmData.paypalEmail || farmData.email || farmData.paypal || "",
                  profilePhoto: farmData.profilePhoto || farmData.photo || farmData.image || farmData.imageUrl || ""
                };
                
                farms.push(normalizedFarm);
              }
            }
          }
        }
        
        console.log("Final farms to display:", farms)
        setSupportedFarms(farms)
      } catch (error) {
        console.error("Error fetching supported farms:", error)
        setDebugInfo(prev => ({ ...prev, error: error.message }))
        
        // If we get a permissions error, use demo farms as fallback
        if (error.message.includes("permission") || error.message.includes("Missing or insufficient permissions")) {
          console.log("Using demo farms as fallback due to permissions issue")
          const demoFarms = getDemoFarms()
          setSupportedFarms(demoFarms)
          setDebugInfo(prev => ({ 
            ...prev, 
            usingLocalFallback: true,
            farmIds: demoFarms.map(farm => farm.id)
          }))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSupportedFarms()
  }, [user])

  if (loading) {
    return <div className="animate-pulse p-4">Loading supported farms...</div>
  }

  // Ensure that supportedFarms is always treated as an array, even if it's accidentally set to something else
  const farmsToRender = Array.isArray(supportedFarms) ? supportedFarms : [];
  console.log("Farms to render:", farmsToRender);

  return (
    <div className="w-full mt-6">
      <h2 className="text-2xl font-bold mb-4">Supporting</h2>
      
      {farmsToRender.length === 0 ? (
        <p className="text-gray-600">You are not supporting any farms yet.</p>
      ) : (
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {farmsToRender.map(farm => (
            <div 
              key={farm.id} 
              className="flex-shrink-0 w-64 h-48 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                  {farm.profilePhoto ? (
                    <img 
                      src={farm.profilePhoto} 
                      alt={farm.farmName} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md">
                      <span className="text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{farm.farmName || "Unknown Farm"}</h3>
                  {farm.products && farm.products.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Products: {farm.products.slice(0, 3).join(", ")}
                      {farm.products.length > 3 ? "..." : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Message about Firestore permissions if there's an error */}
      {debugInfo.error && debugInfo.error.includes("permission") && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <h3 className="font-semibold text-yellow-700">Firebase Permissions Notice</h3>
          <p className="text-yellow-600 mt-1">
            Your app is currently displaying demo farms because there's a Firebase permissions issue. 
            To fix this, you'll need to update your Firestore security rules to allow reading from the farms collection.
          </p>
        </div>
      )}
    </div>
  )
}

export default SupportingFarms
