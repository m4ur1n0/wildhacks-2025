'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PayPalButton from '@/components/ui/paypal-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, getAllFarms, getFarmById } from '@/lib/firebaseConfig';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmId = searchParams.get('farmId');
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [amount, setAmount] = useState('10.00');
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(farmId || '');

  // Fetch farm data when component mounts or farmId changes
  useEffect(() => {
    async function loadFarms() {
      try {
        const allFarms = await getAllFarms();
        setFarms(allFarms);
        
        if (selectedFarmId) {
          const farmData = await getFarmById(selectedFarmId);
          if (farmData) {
            setFarm(farmData);
          } else {
            setError('Farm not found');
          }
        }
      } catch (err) {
        console.error('Error fetching farms:', err);
        setError('Failed to load farm data');
      } finally {
        setLoading(false);
      }
    }
    
    loadFarms();
  }, [selectedFarmId]);

  const handleSuccess = async (details) => {
    // Here you would update your database to record the payment
    setPaymentStatus({
      status: 'success',
      message: `Payment to ${farm?.name || 'farm'} completed! Transaction ID: ${details.id}`,
      details
    });
    
    // Optional: record the transaction in your database
    // Example: await recordTransaction(auth.currentUser.uid, farm.id, amount, details.id);
  };

  const handleError = (error) => {
    setPaymentStatus({
      status: 'error',
      message: 'Payment failed. Please try again.',
      error
    });
  };

  const handleFarmChange = (e) => {
    setSelectedFarmId(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading farm data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Button 
            onClick={() => router.push('/farms')}
            className="mt-4"
          >
            View All Farms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Farm Share Payment</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Pay for Your Farm Share</CardTitle>
          <CardDescription>Support local agriculture by purchasing a farm share</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!farm && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select a Farm
              </label>
              <select 
                value={selectedFarmId}
                onChange={handleFarmChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">-- Select a farm --</option>
                {farms.map(farm => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name || `Farm ${farm.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {farm && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{farm.name || `Farm ${farm.id}`}</h3>
                {!farmId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFarmId('')}
                  >
                    Change Farm
                  </Button>
                )}
              </div>
              
              {farm.description && (
                <p className="text-sm text-gray-600 mt-1">{farm.description}</p>
              )}
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Share Price: ${farm.pricePerShare?.toFixed(2) || '10.00'} 
                </label>
                <p className="text-sm text-gray-500">
                  {farm.numberOfSharesLeft !== undefined ? 
                    `${farm.numberOfSharesLeft} shares remaining out of ${farm.numberOfSharesTotal}` : 
                    'Shares available'}
                </p>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Payment Amount ($)
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0">$</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border rounded-r-md px-3 py-2"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter the amount you wish to pay for your farm share
            </p>
          </div>

          {/* Display warning if no farm is selected */}
          {!farm && (
            <div className="bg-yellow-50 p-3 rounded-md mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Please select a farm to continue with payment
              </p>
            </div>
          )}
          
          {/* PayPal buttons will be displayed only if a farm is selected */}
          {farm && farm.paypalAddress ? (
            <div className="mb-6">
              <PayPalButton
                amount={amount}
                description={`Farm Share Payment - ${farm.name || farm.id}`}
                onSuccess={handleSuccess}
                onError={handleError}
                paypalEmail={farm.paypalAddress}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Payment will be sent directly to: {farm.paypalAddress}
              </p>
            </div>
          ) : farm ? (
            <div className="bg-yellow-50 p-3 rounded-md mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This farm hasn't provided a PayPal address for payments.
                Please contact them directly.
              </p>
            </div>
          ) : null}
        </CardContent>
        
        {/* Payment status */}
        {paymentStatus && (
          <CardFooter className={`${
            paymentStatus.status === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          } rounded-b-md`}>
            <p className="font-medium">{paymentStatus.message}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
