// firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };

export async function getAllFarms() {
  try {
    const farmsCollectionRef = collection(db, "farms");
    const querySnapshot = await getDocs(farmsCollectionRef);
    const farms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return farms; // returns an array of farm objects
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error;
  }
}

export async function getFarmById(farmId) {
  try {
    const farmDocRef = doc(db, "farms", farmId);
    const docSnap = await getDoc(farmDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // docSnap.data() will be undefined in this case
      return null;
    }
  } catch (error) {
    console.error("Error fetching farm:", error);
    throw error;
  }
}

export async function createFarm(farmData) {
  try {
    const farmsCollectionRef = collection(db, "farms");
    const docRef = await addDoc(farmsCollectionRef, farmData);
    return docRef.id; // newly generated document ID
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}

export async function setFarmById(farmId, farmData) {
  try {
    const farmDocRef = doc(db, "farms", farmId);
    // setDoc overwrites the entire document by default
    await setDoc(farmDocRef, farmData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error setting farm:", error);
    throw error;
  }
}

export async function updateFarm(farmId, updatedData) {
  try {
    const farmDocRef = doc(db, "farms", farmId);
    await updateDoc(farmDocRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating farm:", error);
    throw error;
  }
}

export async function deleteFarm(farmId) {
  try {
    const farmDocRef = doc(db, "farms", farmId);
    await deleteDoc(farmDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting farm:", error);
    throw error;
  }
}

export async function getAllConsumers() {
  try {
    const consumersRef = collection(db, "consumers");
    const querySnapshot = await getDocs(consumersRef);
    const consumers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return consumers; // returns an array of consumer objects
  } catch (error) {
    console.error("Error fetching consumers:", error);
    throw error;
  }
}

export async function getConsumerById(consumerId) {
  try {
    const consumerDocRef = doc(db, "consumers", consumerId);
    const docSnap = await getDoc(consumerDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null; // Document does not exist
    }
  } catch (error) {
    console.error("Error fetching consumer:", error);
    throw error;
  }
}

export async function createConsumer(consumerData) {
  try {
    const consumersRef = collection(db, "consumers");
    const docRef = await addDoc(consumersRef, consumerData);
    return docRef.id; // newly generated document ID
  } catch (error) {
    console.error("Error creating consumer:", error);
    throw error;
  }
}

export async function setConsumerById(consumerId, consumerData) {
  try {
    const consumerDocRef = doc(db, "consumers", consumerId);
    // By default, setDoc overwrites the entire document
    await setDoc(consumerDocRef, consumerData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error setting consumer:", error);
    throw error;
  }
}

export async function updateConsumer(consumerId, updatedData) {
  try {
    const consumerDocRef = doc(db, "consumers", consumerId);
    await updateDoc(consumerDocRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating consumer:", error);
    throw error;
  }
}

export async function deleteConsumer(consumerId) {
  try {
    const consumerDocRef = doc(db, "consumers", consumerId);
    await deleteDoc(consumerDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting consumer:", error);
    throw error;
  }
}