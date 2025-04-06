"use client"

import FadingTextComponent from "@/components/FadingTextComponent";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/authContext";
import { getConsumer, getFarm } from "@/lib/db";
import { useRouter } from "next/navigation";

import { useEffect } from "react";


export default function Home() {
  const didYouKnowTexts = [
    '20% of perfectly good produce gets tossed just for looking "ugly"—like odd shapes or harmless blemishes?',
    'Globally, 1.3 billion tons of food is wasted yearly—with 10 million pounds of that being edible "imperfect" produce. Meanwhile, farmers lose revenue simply because their crops don’t meet grocery store beauty standards.',
    "Buying 'seconds' isn’t just smart—it’s a power move. Farmers earn more, you save money, and together we slash waste"
  ]

  const {user} = useAuth();
  const router = useRouter();

  const validateUser = async () => {
    if (!user) return;
  
    try {
      const uid = user.uid;
  
      let farm = null;
      try {
        farm = await getFarm(uid);
      } catch (err) {
        console.warn("Farm check failed:", err.message);
      }
  
      if (farm) {
        router.push(`/farm#${uid}`);
        return;
      }
  
      let consumer = null;
      try {
        consumer = await getConsumer(uid);
      } catch (err) {
        console.warn("Consumer check failed:", err.message);
      }
  
      if (!consumer) {
        router.push('/new-user');
        return;
      }
  
      router.push('/home');
  
    } catch (error) {
      console.error("Unexpected auth validation failure:", error);
    }
  };

  useEffect(() => {
    validateUser();
  }, [user]);

  return (

    <div className="entry-page w-screen h-screen p-3 flex gap-1 justify-between items-center">

      <div className="entry-page-photo w-1/2 h-full overflow-none rounded-xl">
        <img src="/images/sunny-farm.jpg" alt="beautiful produce farm" className="w-full h-full object-cover rounded-xl" />
      </div>

      <div className="join-panel w-1/2 h-full flex flex-col justify-center items-center w-1/2 p-5 text-center rounded-xl border surround-shadow-sm ">
        <h1 className="mb-10">Seconds2Go</h1>

        <div className="did-you-know-section h-1/3 mb-12">
          <h2 className='mb-1'>Did you know?</h2>
          <FadingTextComponent texts={didYouKnowTexts} />
        </div>



        {user ? 
        <p>Welcome {user.displayName}</p>
        :
        <GoogleSignInButton />
        }


      </div>

    </div>

  );
}
