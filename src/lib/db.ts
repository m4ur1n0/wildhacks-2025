import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
  } from "firebase/firestore";
  import { db } from "./firebaseConfig";
  
  // --------- Consumers ---------
  
  export async function getConsumer(userId: string) {
    try {
      const ref = doc(db, "consumers", userId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.warn("getConsumer error:", err.message);
      return null;
    }
  }
  
  export async function createConsumer(userId: string, data: {
    activeEngagements?: string[],
    email: string,
    location?: string,
    name: string,
    paypalAddress?: string,
  }) {
    const ref = doc(db, "consumers", userId);
    await setDoc(ref, data);
  }
  
  export async function updateConsumer(userId: string, data: Partial<{
    activeEngagements: string[],
    email: string,
    location: string,
    name: string,
    paypalAddress: string,
  }>) {
    const ref = doc(db, "consumers", userId);
    await updateDoc(ref, data);
  }
  
  export async function deleteConsumer(userId: string) {
    const ref = doc(db, "consumers", userId);
    await deleteDoc(ref);
  }
  
  // --------- Farms ---------
  
  export async function getFarm(farmId: string) {
    try {
      const ref = doc(db, "farms", farmId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.warn("getFarm error:", err.message);
      return null;
    }
  }
  
  export async function createFarm(farmId: string, data: {
    name : string,
    address: string,
    availableAtNextPickup?: string[],
    bio: string,
    deliveryStyle: "pickup" | "dropoff",
    email: string,
    inSeason?: string[],
    numShares: number,
    numSharesLeft: number,
    paypalAddress?: string,
    pricePerShare: number,
  }) {
    const ref = doc(db, "farms", farmId);
    await setDoc(ref, data);
  }
  
  export async function updateFarm(farmId: string, data: Partial<{
    name : string,
    address: string,
    availableAtNextPickup: string[],
    bio: string,
    deliveryStyle: "pickup" | "dropoff",
    email: string,
    inSeason: string[],
    numShares: number,
    numSharesLeft: number,
    paypalAddress: string,
    pricePerShare: number,
  }>) {
    const ref = doc(db, "farms", farmId);
    await updateDoc(ref, data);
  }
  
  export async function deleteFarm(farmId: string) {
    const ref = doc(db, "farms", farmId);
    await deleteDoc(ref);
  }
  