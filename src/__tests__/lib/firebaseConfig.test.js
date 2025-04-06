// Mock Firebase modules
jest.mock('firebase/app', () => {
  return {
    __esModule: true,
    default: {
      apps: [],
      initializeApp: jest.fn(),
      firestore: jest.fn(() => ({})),
      auth: jest.fn(() => ({}))
    }
  };
});

// Mock Firestore functions
jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

// Import the Firebase functions
import * as firestoreFunctions from 'firebase/firestore';
import * as firebaseConfig from '../../lib/firebaseConfig';

// In each test, we'll bypass the actual Firebase API and simulate responses directly
describe('Farm Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFarms', () => {
    it('should return all farms', async () => {
      // Mock the Firestore query snapshot response
      firestoreFunctions.collection.mockReturnValue('farms-collection-ref');
      firestoreFunctions.getDocs.mockResolvedValue({
        docs: [
          { id: 'farm1', data: () => ({ name: 'Farm 1', crops: ['apple'] }) },
          { id: 'farm2', data: () => ({ name: 'Farm 2', crops: ['corn'] }) },
        ],
      });

      // Call the function
      const farms = await firebaseConfig.getAllFarms();

      // Verify the results
      expect(firestoreFunctions.collection).toHaveBeenCalledWith(expect.anything(), 'farms');
      expect(firestoreFunctions.getDocs).toHaveBeenCalledWith('farms-collection-ref');
      expect(farms).toHaveLength(2);
      expect(farms[0]).toEqual({
        id: 'farm1',
        name: 'Farm 1',
        crops: ['apple']
      });
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.collection.mockReturnValue('farms-collection-ref');
      firestoreFunctions.getDocs.mockRejectedValue(new Error('Database error'));

      // The function should throw the error
      await expect(firebaseConfig.getAllFarms()).rejects.toThrow('Database error');
    });
  });

  describe('getFarmById', () => {
    it('should return farm data when found', async () => {
      // Mock the doc reference and snapshot
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'farm1',
        data: () => ({ name: 'Farm 1', location: 'Location 1' }),
      });

      // Call the function
      const farm = await firebaseConfig.getFarmById('farm1');

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'farms', 'farm1');
      expect(firestoreFunctions.getDoc).toHaveBeenCalledWith('farm-doc-ref');
      expect(farm).toEqual({
        id: 'farm1',
        name: 'Farm 1',
        location: 'Location 1'
      });
    });

    it('should return null when farm not found', async () => {
      // Mock a non-existent document
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.getDoc.mockResolvedValue({
        exists: () => false,
      });

      // Call the function
      const farm = await firebaseConfig.getFarmById('non-existent');

      // Should return null
      expect(farm).toBeNull();
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.getDoc.mockRejectedValue(new Error('Not authorized'));

      // The function should throw the error
      await expect(firebaseConfig.getFarmById('farm1')).rejects.toThrow('Not authorized');
    });
  });

  describe('createFarm', () => {
    it('should create a farm and return its ID', async () => {
      const farmData = { name: 'New Farm', location: 'New Location' };
      
      // Mock addDoc response
      firestoreFunctions.collection.mockReturnValue('farms-collection-ref');
      firestoreFunctions.addDoc.mockResolvedValue({ id: 'new-farm-id' });

      // Call the function
      const id = await firebaseConfig.createFarm(farmData);

      // Verify results
      expect(firestoreFunctions.collection).toHaveBeenCalledWith(expect.anything(), 'farms');
      expect(firestoreFunctions.addDoc).toHaveBeenCalledWith('farms-collection-ref', farmData);
      expect(id).toBe('new-farm-id');
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.collection.mockReturnValue('farms-collection-ref');
      firestoreFunctions.addDoc.mockRejectedValue(new Error('Invalid data'));

      // The function should throw the error
      await expect(firebaseConfig.createFarm({})).rejects.toThrow('Invalid data');
    });
  });

  describe('setFarmById', () => {
    it('should set farm data by ID', async () => {
      const farmData = { name: 'Updated Farm' };
      
      // Mock setDoc
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.setDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.setFarmById('farm1', farmData);

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'farms', 'farm1');
      expect(firestoreFunctions.setDoc).toHaveBeenCalledWith('farm-doc-ref', farmData, { merge: true });
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.setDoc.mockRejectedValue(new Error('Permission denied'));

      // The function should throw the error
      await expect(firebaseConfig.setFarmById('farm1', {})).rejects.toThrow('Permission denied');
    });
  });

  describe('updateFarm', () => {
    it('should update farm with sanitized data', async () => {
      const updatedData = {
        name: 'Updated Farm',
        bio: undefined,
        pricePerShare: 250
      };
      
      // Expected sanitized data (undefined values removed)
      const sanitizedData = {
        name: 'Updated Farm',
        pricePerShare: 250
      };
      
      // Mock updateDoc
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.updateDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.updateFarm('farm1', updatedData);

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'farms', 'farm1');
      expect(firestoreFunctions.updateDoc).toHaveBeenCalledWith('farm-doc-ref', sanitizedData);
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.updateDoc.mockRejectedValue(new Error('Update failed'));

      // The function should throw the error
      await expect(firebaseConfig.updateFarm('farm1', {})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteFarm', () => {
    it('should delete farm by ID', async () => {
      // Mock deleteDoc
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.deleteDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.deleteFarm('farm1');

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'farms', 'farm1');
      expect(firestoreFunctions.deleteDoc).toHaveBeenCalledWith('farm-doc-ref');
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('farm-doc-ref');
      firestoreFunctions.deleteDoc.mockRejectedValue(new Error('Delete failed'));

      // The function should throw the error
      await expect(firebaseConfig.deleteFarm('farm1')).rejects.toThrow('Delete failed');
    });
  });
});

// Consumer-related tests
describe('Consumer Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllConsumers', () => {
    it('should return all consumers', async () => {
      // Mock the Firestore query snapshot response
      firestoreFunctions.collection.mockReturnValue('consumers-collection-ref');
      firestoreFunctions.getDocs.mockResolvedValue({
        docs: [
          { id: 'consumer1', data: () => ({ name: 'Jane Doe', email: 'jane@example.com' }) },
          { id: 'consumer2', data: () => ({ name: 'Bob Smith', email: 'bob@example.com' }) },
        ],
      });

      // Call the function
      const consumers = await firebaseConfig.getAllConsumers();

      // Verify the results
      expect(firestoreFunctions.collection).toHaveBeenCalledWith(expect.anything(), 'consumers');
      expect(firestoreFunctions.getDocs).toHaveBeenCalledWith('consumers-collection-ref');
      expect(consumers).toHaveLength(2);
      expect(consumers[0]).toEqual({
        id: 'consumer1',
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.collection.mockReturnValue('consumers-collection-ref');
      firestoreFunctions.getDocs.mockRejectedValue(new Error('Database error'));

      // The function should throw the error
      await expect(firebaseConfig.getAllConsumers()).rejects.toThrow('Database error');
    });
  });

  describe('getConsumerById', () => {
    it('should return consumer data when found', async () => {
      // Mock the doc reference and snapshot
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.getDoc.mockResolvedValue({
        exists: () => true,
        id: 'consumer1',
        data: () => ({ name: 'Jane Doe', email: 'jane@example.com' }),
      });

      // Call the function
      const consumer = await firebaseConfig.getConsumerById('consumer1');

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'consumers', 'consumer1');
      expect(firestoreFunctions.getDoc).toHaveBeenCalledWith('consumer-doc-ref');
      expect(consumer).toEqual({
        id: 'consumer1',
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
    });

    it('should return null when consumer not found', async () => {
      // Mock a non-existent document
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.getDoc.mockResolvedValue({
        exists: () => false,
      });

      // Call the function
      const consumer = await firebaseConfig.getConsumerById('non-existent');

      // Should return null
      expect(consumer).toBeNull();
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.getDoc.mockRejectedValue(new Error('Not authorized'));

      // The function should throw the error
      await expect(firebaseConfig.getConsumerById('consumer1')).rejects.toThrow('Not authorized');
    });
  });

  describe('createConsumer', () => {
    it('should create a consumer and return its ID', async () => {
      const consumerData = { name: 'New Consumer', email: 'new@example.com' };
      
      // Mock addDoc response
      firestoreFunctions.collection.mockReturnValue('consumers-collection-ref');
      firestoreFunctions.addDoc.mockResolvedValue({ id: 'new-consumer-id' });

      // Call the function
      const id = await firebaseConfig.createConsumer(consumerData);

      // Verify results
      expect(firestoreFunctions.collection).toHaveBeenCalledWith(expect.anything(), 'consumers');
      expect(firestoreFunctions.addDoc).toHaveBeenCalledWith('consumers-collection-ref', consumerData);
      expect(id).toBe('new-consumer-id');
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.collection.mockReturnValue('consumers-collection-ref');
      firestoreFunctions.addDoc.mockRejectedValue(new Error('Invalid data'));

      // The function should throw the error
      await expect(firebaseConfig.createConsumer({})).rejects.toThrow('Invalid data');
    });
  });

  describe('setConsumerById', () => {
    it('should set consumer data by ID', async () => {
      const consumerData = { name: 'Updated Consumer' };
      
      // Mock setDoc
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.setDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.setConsumerById('consumer1', consumerData);

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'consumers', 'consumer1');
      expect(firestoreFunctions.setDoc).toHaveBeenCalledWith('consumer-doc-ref', consumerData, { merge: true });
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.setDoc.mockRejectedValue(new Error('Permission denied'));

      // The function should throw the error
      await expect(firebaseConfig.setConsumerById('consumer1', {})).rejects.toThrow('Permission denied');
    });
  });

  describe('updateConsumer', () => {
    it('should update consumer data', async () => {
      const updatedData = { name: 'Updated Consumer' };
      
      // Mock updateDoc
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.updateDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.updateConsumer('consumer1', updatedData);

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'consumers', 'consumer1');
      expect(firestoreFunctions.updateDoc).toHaveBeenCalledWith('consumer-doc-ref', updatedData);
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.updateDoc.mockRejectedValue(new Error('Update failed'));

      // The function should throw the error
      await expect(firebaseConfig.updateConsumer('consumer1', {})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteConsumer', () => {
    it('should delete consumer by ID', async () => {
      // Mock deleteDoc
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.deleteDoc.mockResolvedValue();

      // Call the function
      const result = await firebaseConfig.deleteConsumer('consumer1');

      // Verify results
      expect(firestoreFunctions.doc).toHaveBeenCalledWith(expect.anything(), 'consumers', 'consumer1');
      expect(firestoreFunctions.deleteDoc).toHaveBeenCalledWith('consumer-doc-ref');
      expect(result).toBe(true);
    });

    it('should handle errors', async () => {
      // Simulate an error
      firestoreFunctions.doc.mockReturnValue('consumer-doc-ref');
      firestoreFunctions.deleteDoc.mockRejectedValue(new Error('Delete failed'));

      // The function should throw the error
      await expect(firebaseConfig.deleteConsumer('consumer1')).rejects.toThrow('Delete failed');
    });
  });
});
