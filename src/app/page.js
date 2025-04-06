"use client"

import FadingTextComponent from "@/components/FadingTextComponent";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/authContext";
import { getConsumer, getFarm } from "@/lib/db";
import { useRouter } from "next/navigation";

import { useEffect } from "react";


export default function Home() {
  const didYouKnowTexts = [
    "Something exists here.",
    "Something longer, even more meaningful, and with a greater length, exists here. This thing is longer than the first thing, so it might even have a line break.",
    "A third thing exists here, and we love how it does."
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
