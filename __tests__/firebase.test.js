import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/testing';
import { db } from '../firebaseConfig.js';
import { getFirestore, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

const projectId = 'wildhacks-2025-test';

describe('Firestore Rules Tests', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        host: 'localhost',
        port: 8080,
        rules: `service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }`
      }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  describe('Farms Collection', () => {
    const testFarm = {
      name: 'Test Farm',
      location: 'Test Location',
      products: ['test-product']
    };

    test('should create a farm document', async () => {
      const farmId = await createFarm(testFarm);
      const docRef = doc(db, 'farms', farmId);
      const docSnap = await getDoc(docRef);
      
      expect(docSnap.exists()).toBe(true);
      expect(docSnap.data()).toEqual(testFarm);
    });

    test('should retrieve all farms', async () => {
      const farms = await getAllFarms();
      expect(Array.isArray(farms)).toBe(true);
      expect(farms.length).toBeGreaterThan(0);
    });

    test('should update a farm document', async () => {
      const farmId = await createFarm(testFarm);
      const updatedData = { name: 'Updated Farm Name' };
      
      await updateFarm(farmId, updatedData);
      const updatedFarm = await getFarmById(farmId);
      
      expect(updatedFarm.name).toBe('Updated Farm Name');
    });
  });

  describe('Consumers Collection', () => {
    const testConsumer = {
      name: 'Test Consumer',
      email: 'test@example.com',
      preferences: ['organic']
    };

    test('should create a consumer document', async () => {
      const consumerId = await createConsumer(testConsumer);
      const docRef = doc(db, 'consumers', consumerId);
      const docSnap = await getDoc(docRef);
      
      expect(docSnap.exists()).toBe(true);
      expect(docSnap.data()).toEqual(testConsumer);
    });

    test('should delete a consumer document', async () => {
      const consumerId = await createConsumer(testConsumer);
      const deleteResult = await deleteConsumer(consumerId);
      
      expect(deleteResult).toBe(true);
      const docSnap = await getDoc(doc(db, 'consumers', consumerId));
      expect(docSnap.exists()).toBe(false);
    });
  });
});
