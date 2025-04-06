"use client"

/**
 * 
 * RETURNED USER LOOKS LIKE THIS:
 * 
 * {
  uid: "x8y2z1a9b7c6",                    // Unique Firebase user ID
  displayName: "John Doe",                // User's full name
  email: "john.doe@example.com",          // Verified email address
  photoURL: "https://.../photo.jpg",      // Profile picture URL
  emailVerified: true,                    // Always true for Google sign-in
  phoneNumber: null,                      // null unless phone auth used
  isAnonymous: false,                     // false for Google sign-in
  providerData: [                         // Array of linked auth providers
    {
      uid: "123456789",                   // Google's ID for the user
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://.../photo.jpg",
      providerId: "google.com"           // Identifies Google as provider
    }
  ],
  metadata: {
    creationTime: "2023-01-01T12:00:00Z", // When account was created
    lastSignInTime: "2023-05-15T09:30:00Z"// Last login timestamp
  },
  refreshToken: "ABCD1234...",           // Used to get new ID tokens
  providerId: "firebase",                 // Always 'firebase' for direct auth
  // Methods available on the user object:
  getIdToken(),
  getIdTokenResult(),
  reload(),
  toJSON()
}


 */

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getConsumer } from '@/lib/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshLocalConsumer = async () => {
    try {
      const fresh = getConsumer(user.uid);
      setUser(fresh);
    } catch (err) {
      console.warn('error ocurred when i tried to refresh local');
      return
    }
  }

  const refreshLocalFarm = async () => {
    try {
      const fresh = getFarm(user.uid);
      setUser(fresh);
    } catch (err) {
      console.warn('error ocurred when i tried to refresh local');
      return;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, refreshLocalConsumer, refreshLocalFarm }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}