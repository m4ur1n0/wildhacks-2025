import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel'

const HomePageDescription = () => {
  return (
    <div className='home-page-description w-[40%] h-full'>
      <Card className="h-full flex flex-col"> 
        <CardContent className="flex-1 overflow-hidden">
          <Carousel className="h-full">
            <CarouselContent className="h-full">
                <CarouselItem className="h-full flex items-center justify-center">
                    <div className="text-center p-4 h-full mt-24 flex flex-col justify-center items-center">
                    <blockquote className="text-3xl italic font-medium">
                        "Perfect taste—even when it's not perfectly pretty. Straight from farmers, saving you money and fighting waste."
                    </blockquote>
                    <img className='seconds-to-go-logo w-1/2' src='/images/seconds-to-go-logo-no-text-clear.png' />
                    </div>
                </CarouselItem>

              <CarouselItem className="h-full w-[80%] overflow-y-auto flex items-center justify-center"> {/* Added overflow */}
                <div className="space-y-4"> {/* Added spacing */}
                <p className='indent-8 mb-4'>
                    Did you know 20% of perfectly good produce gets tossed for looking a little… <span className='italic'>quirky</span>? 
                    That's right—wonky carrots, lumpy tomatoes, and slightly sunburnt apples end up in landfills while farmers lose revenue 
                    and shoppers miss out on affordable, fresh food. Globally, a staggering <span className='font-bold'>1.3 billion tons </span> 
                    of food goes to waste every year, with <span className='font-bold'>10 million pounds</span> of that being perfectly edible 
                    <span className='font-bold'> "seconds"</span> rejected for cosmetic reasons.
                </p>                     
                <p className='indent-8 mb-4'>
                    But here's the good news: our app connects you directly with local farmers selling their <span className='font-bold'>so-called "imperfect" produce at a steal</span>. Think of it as Community Sponsored Agriculture (CSA) meets food rescue. Because why should taste suffer for aesthetics? (Spoiler: it doesn't.) Farmers earn more, you eat better, and together, we shrink the waste pile—one gnarly potato at a time.
                </p>
                  <p className='indent-8'>
                    Psychology says we shy away from ugly food, but let's flip the script. Choosing 
                    "seconds" isn't just smart—it's a small act of rebellion against waste culture. 
                    Farmers keep more of their harvest (and profits), you get <span  className='font-bold'>farm-fresh goodness 
                    without the markup</span>, and the planet gets a break. Win-win-
                    <span className='italic font-bold'>win</span>. So join the movement: because the best-tasting produce doesn't always come with a beauty pageant crown.
                  </p>
                </div>
              </CarouselItem>

              <CarouselItem className='h-full w-[90%] overflow-y-auto flex items-center justify-center'>
                <div className='list-of-research-links flex flex-col gap-8 items-center justify-center text-center'>
                    <h4 className='mb-2 mt-24'>More about the waste we're fighting...</h4>
                    <a className='underline text-2xl' href="https://foodwastefeast.com/why-we-waste-ugly-food-expiration-dates-and-more">foodwastefeast.com</a>
                    <a className='underline text-2xl' href="https://econreview.studentorg.berkeley.edu/the-good-the-bad-and-the-ugly-produce-movement/">Berkeley</a>
                    <a className='underline text-2xl' href="https://www.fao.org/4/mb060e/mb060e00.htm">Food and Agriculture Organization</a>
                </div>

              </CarouselItem>
              
              
            </CarouselContent>
            
            <CarouselPrevious className="left-2 top-[95%]" />
            <CarouselNext className="right-2 top-[95%]" />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePageDescription