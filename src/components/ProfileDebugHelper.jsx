"use client"
import React, { useState } from 'react'
import { useAuth } from '@/context/authContext'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const ProfileDebugHelper = () => {
  const { user } = useAuth()
  const [debugInfo, setDebugInfo] = useState({})
  const [showDebug, setShowDebug] = useState(false)
  const [farmId, setFarmId] = useState('')
  const [status, setStatus] = useState('')

  const checkConsumerData = async () => {
    if (!user) {
      setStatus('No user logged in')
      return
    }

    try {
      setStatus('Checking consumer data...')
      const consumerDocRef = doc(db, "consumers", user.uid)
      const consumerSnap = await getDoc(consumerDocRef)
      
      if (consumerSnap.exists()) {
        setDebugInfo(consumerSnap.data())
        setStatus(`Consumer data found: ${JSON.stringify(consumerSnap.data())}`)
      } else {
        setStatus('No consumer data found. Creating basic consumer data...')
        
        // Create basic consumer data
        const newConsumerData = {
          name: user.displayName || 'User',
          email: user.email || '',
          activeEngagements: []
        }
        
        // Using setDoc instead of updateDoc since the document doesn't exist
        await setDoc(consumerDocRef, newConsumerData)
        setDebugInfo(newConsumerData)
        setStatus('Created basic consumer data')
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      
      // Try checking if we can create test farms
      try {
        setStatus('Testing farm collection permissions...')
        const testFarmRef = doc(db, 'farms', 'test-permission-check')
        const testFarmSnap = await getDoc(testFarmRef)
        
        if (testFarmSnap.exists()) {
          setStatus('Successfully read from farms collection')
        } else {
          setStatus('Farms collection exists but test document not found. Checking if we can create it...')
          
          try {
            // Try to create a test farm document to check write permissions
            await setDoc(testFarmRef, { 
              farmName: 'Test Farm',
              createdAt: new Date().toISOString(),
              createdBy: user.uid,
              isTestDocument: true
            }, { merge: true })
            
            setStatus('Successfully created test farm document')
          } catch (writeError) {
            setStatus(`Cannot write to farms collection: ${writeError.message}`)
          }
        }
      } catch (farmError) {
        setStatus(`Cannot access farms collection: ${farmError.message}`)
      }
    }
  }

  const addFarmToEngagements = async () => {
    if (!user || !farmId.trim()) {
      setStatus('User not logged in or farm ID is empty')
      return
    }

    try {
      setStatus(`Adding farm ${farmId} to activeEngagements...`)
      const consumerDocRef = doc(db, "consumers", user.uid)
      const consumerSnap = await getDoc(consumerDocRef)
      
      if (consumerSnap.exists()) {
        const consumerData = consumerSnap.data()
        let activeEngagements = Array.isArray(consumerData.activeEngagements) 
          ? [...consumerData.activeEngagements] 
          : []
        
        // Check if farmId already exists
        if (!activeEngagements.includes(farmId)) {
          activeEngagements.push(farmId)
          
          await updateDoc(consumerDocRef, {
            activeEngagements
          })
          
          setStatus(`Added farm ${farmId} to activeEngagements`)
          setDebugInfo({ ...consumerData, activeEngagements })
        } else {
          setStatus(`Farm ${farmId} already exists in activeEngagements`)
        }
      } else {
        // Consumer document doesn't exist, create it
        setStatus('Creating new consumer document with farm ID...')
        
        const newConsumerData = {
          name: user.displayName || 'User',
          email: user.email || '',
          activeEngagements: [farmId]
        }
        
        await setDoc(consumerDocRef, newConsumerData)
        setDebugInfo(newConsumerData)
        setStatus(`Created new consumer with farm ${farmId}`)
      }
      
      // Also create a dummy farm if it doesn't exist
      try {
        const farmDocRef = doc(db, "farms", farmId)
        const farmSnap = await getDoc(farmDocRef)
        
        if (!farmSnap.exists()) {
          setStatus(`Farm ${farmId} doesn't exist, creating dummy farm...`)
          
          await setDoc(farmDocRef, {
            farmName: `Farm ${farmId.substring(0, 5)}`,
            address: "123 Farm Road",
            products: ["Produce", "Dairy"],
            paypalEmail: "farm@example.com",
            createdAt: new Date().toISOString(),
            createdBy: user.uid
          })
          
          setStatus(`Created dummy farm ${farmId}`)
        }
      } catch (farmError) {
        setStatus(`Note: Could not create farm document: ${farmError.message}`)
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  const testFirebaseReadAccess = async () => {
    try {
      setStatus('Testing read access to Firebase collections...')
      
      const collections = ['consumers', 'farms', 'transactions']
      const results = {}
      
      for (const collection of collections) {
        try {
          const testRef = doc(db, collection, 'test-access')
          await getDoc(testRef)
          results[collection] = 'Read access: '
        } catch (error) {
          results[collection] = `Read access: (${error.message})`
        }
      }
      
      setStatus(`Access test results: ${JSON.stringify(results, null, 2)}`)
    } catch (error) {
      setStatus(`Error testing access: ${error.message}`)
    }
  }

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-200 p-2 rounded-md text-xs opacity-50 hover:opacity-100"
      >
        Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg border border-gray-300 text-xs max-w-md overflow-auto max-h-[80vh]">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Profile Debug Helper</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          onClick={checkConsumerData}
          className="bg-blue-500 text-white p-1 rounded-md"
        >
          Check Consumer Data
        </button>
        
        <button 
          onClick={testFirebaseReadAccess}
          className="bg-purple-500 text-white p-1 rounded-md"
        >
          Test Firebase Access
        </button>
      </div>
      
      <div className="mb-4 flex items-center">
        <input 
          type="text" 
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
          placeholder="Enter farm ID"
          className="border border-gray-300 p-1 rounded-md mr-2 flex-1"
        />
        <button 
          onClick={addFarmToEngagements}
          className="bg-green-500 text-white p-1 rounded-md"
        >
          Add
        </button>
      </div>
      
      <div className="mt-2">
        <div className="font-semibold">Status:</div>
        <div className="text-gray-600 break-words whitespace-pre-wrap text-xs">{status}</div>
      </div>
      
      {Object.keys(debugInfo).length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">Consumer Data:</div>
          <pre className="bg-gray-100 p-1 rounded-md overflow-auto max-h-40 text-xs text-gray-600">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-gray-500 text-[10px]">
        After adding a farm ID, refresh the page to see the changes
      </div>
    </div>
  )
}

export default ProfileDebugHelper
