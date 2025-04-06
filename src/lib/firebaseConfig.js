// firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, 
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase with a test-friendly approach
let app;
let db;
let auth;

// In test environment, these might be mocked differently
try {
  // Check if we're in a browser/Next.js environment
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
    // Use normal initialization
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  } else {
    // Simple initialization for tests
    app = initializeApp(firebaseConfig);
  }
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Provide fallbacks for testing
  app = app || {};
  db = db || {};
  auth = auth || {};
}

export { app, db, auth };

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

/**
 * Creates a new farm document in Firestore.
 *
 * @param {Object} farmData - The data for the new farm.
 * @param {string} farmData.bio - A short biography or description of the farm.
 * @param {string} farmData.deliveryStyle - The style or method of product delivery.
 * @param {string} farmData.email - The contact email for the farm.
 * @param {string} farmData.farmId - A unique identifier for the farm.
 * @param {number} farmData.numberOfSharesLeft - The number of shares currently left.
 * @param {number} farmData.numberOfSharesTotal - The total number of shares available.
 * @param {string} farmData.paypalAddress - The PayPal address for receiving payments.
 * @param {number} farmData.pricePerShare - The cost per share for the farm’s produce.
 * @param {string[]} farmData.productsInSeason - An array of products currently in season.
 * @param {Object.<string, string[]>} farmData.productsAvailableNextWeeks - A map where each key is a week (as a string) and each value is an array of product names available for that week.
 *
 * @returns {Promise<string>} The ID of the newly created farm document.
 */
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
    
    // Filter out undefined values to prevent accidental field deletion
    const sanitizedUpdatedData = Object.entries(updatedData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    await updateDoc(farmDocRef, sanitizedUpdatedData);
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