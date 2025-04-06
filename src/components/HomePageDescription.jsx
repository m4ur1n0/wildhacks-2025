import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const HomePageDescription = () => {
  return (
    <div className='home-page-description w-[40%] h-full'>
      <Card>
        <CardHeader>
            {/* <CardTitle>
                <h2>SecondsToGo</h2>
            </CardTitle>
            <CardDescription className={'mb-1'}>
                Bringing consumers and farmers together since last Wildhacks!
            </CardDescription> */}
            <CardContent>
            <p className='indent-8 mb-2'>
            Did you know 20% of perfectly good produce gets tossed for looking a little… <span className='italic'>quirky</span>? That's right—wonky carrots, lumpy tomatoes, and slightly sunburnt apples end up in landfills while farmers lose revenue and shoppers miss out on affordable, fresh food. Globally, a staggering <span className='font-bold'>1.3 billion tons</span> of food goes to waste every year, with <span className='font-bold'>10 million pounds</span> of that being perfectly edible "seconds" rejected for cosmetic reasons. But here's the good news: our app connects you directly with local farmers selling their so-called "imperfect" produce at a steal. Think of it as Community Sponsored Agriculture (CSA) meets food rescue. Because why should taste suffer for aesthetics? (Spoiler: it doesn't.) Farmers earn more, you eat better, and together, we shrink the waste pile—one gnarly potato at a time.
            </p>
            <p className='indent-8'>
            Psychology says we shy away from ugly food, but let's flip the script. Choosing "seconds" isn't just smart—it's a small act of rebellion against waste culture. Farmers keep more of their harvest (and profits), you get farm-fresh goodness without the markup, and the planet gets a break. Win-win-<span className='italic font-bold'>win</span>. So join the movement: because the best-tasting produce doesn't always come with a beauty pageant crown.
            </p>
            </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default HomePageDescription
