// import { LoadingSpinner } from '@/components/LoadingSpinner'
import NewConsumerForm from '@/components/NewConsumerForm'
import NewFarmForm from '@/components/NewFarmForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const page = () => {
  return (
    <div className='user-sign-up-page fixed inset-0 flex justify-center items-center p-3 bg-white overflow-hidden'>

        <Card className='w-[40%] h-[90%] flex flex-col overflow-hidden'>
            <CardHeader>
                <CardTitle><h2>Welcome to SecondsToGo!</h2></CardTitle>
                <CardDescription>Let's get to know each other!</CardDescription>
            </CardHeader>

            <CardContent className='flex-1 flex overflow-hidden p-0'>
                <Tabs defaultValue="consumer" className="w-full h-full flex flex-col">
                <TabsList className='w-[90%] ml-[5%] justify-center'>
                    <TabsTrigger value="consumer">Consumer</TabsTrigger>
                    <TabsTrigger value="farm">Farm</TabsTrigger>
                </TabsList>
                <TabsContent value="consumer" className='flex-1 overflow-auto px-6 py-4'>
                    <NewConsumerForm />
                </TabsContent>
                <TabsContent value="farm" className='flex-1 overflow-auto px-6 -pt-2 pb-5'>
                    <NewFarmForm />
                </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

      
    </div>
  )
}

export default page
