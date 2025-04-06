import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
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
    profilePhoto: string,
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
    profilePhoto: string,
  }>) {
    const ref = doc(db, "farms", farmId);
    await updateDoc(ref, data);
  }
  
  export async function deleteFarm(farmId: string) {
    const ref = doc(db, "farms", farmId);
    await deleteDoc(ref);
  }
  
  export async function getAllFarms() {
    try {
      const farmsCollection = collection(db, "farms");
      const snapshot = await getDocs(farmsCollection);
      
      // Check if the snapshot has any documents
      if (snapshot.empty) {
        console.log("No farms found.");
        return [];
      }
  
      const farms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      return farms;
    } catch (err) {
      console.error("Error getting all farms:", err.message);
      return [];
    }
  }