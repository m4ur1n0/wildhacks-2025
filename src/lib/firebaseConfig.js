import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

// // Farm operations
// export async function getFarmById(farmId) {
//   const docSnap = await getDoc(doc(db, "farms", farmId));
//   return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
// }

// export async function getAllFarms() {
//   const querySnapshot = await getDocs(collection(db, "farms"));
//   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

// export async function createFarm(farmData) {
//   const docRef = await addDoc(collection(db, "farms"), farmData);
//   return docRef.id;
// }

// export async function updateFarm(farmId, updatedData) {
//   await updateDoc(doc(db, "farms", farmId), updatedData);
// }

// export async function deleteFarm(farmId) {
//   await deleteDoc(doc(db, "farms", farmId));
// }

// // Consumer operations (simplified same pattern)
// export async function getConsumerById(consumerId) {
//   const docSnap = await getDoc(doc(db, "consumers", consumerId));
//   if (!docSnap.exists() || Object.keys(docSnap.data() || {}).length === 0) {
//       return null;
//     }
    
//   return { id: docSnap.id, ...docSnap.data() };
// }

// export async function getAllConsumers() {
//   const querySnapshot = await getDocs(collection(db, "consumers"));
//   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

// export async function createConsumer(consumerData) {
//   const docRef = await addDoc(collection(db, "consumers"), consumerData);
//   return docRef.id;
// }

// export async function updateConsumer(consumerId, updatedData) {
//   await updateDoc(doc(db, "consumers", consumerId), updatedData);
// }

// export async function deleteConsumer(consumerId) {
//   await deleteDoc(doc(db, "consumers", consumerId));
// }