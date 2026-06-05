import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'candidate' | 'employer';
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuth: (mode?: 'signin' | 'signup') => void;
  closeAuth: () => void;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, role: 'candidate' | 'employer') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isRegistering = useRef(false);

  // Global Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  function openAuth(mode: 'signin' | 'signup' = 'signin') {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }

  function closeAuth() {
    setIsAuthModalOpen(false);
  }

  // Fetch or create user profile in Firestore
  const fetchOrCreateProfile = async (firebaseUser: User, fallbackRole: 'candidate' | 'employer' = 'candidate') => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Create standard public profile
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: fallbackRole,
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error("Error managing user profile: ", err);
      // For fallback UI so the user can still use the app
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: fallbackRole,
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (!isRegistering.current) {
          await fetchOrCreateProfile(currentUser);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In helper using signInWithPopup
  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeAuth();
    } catch (err) {
      console.error("Google login failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with email/password
  const signUpWithEmail = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: 'candidate' | 'employer'
  ) => {
    setLoading(true);
    isRegistering.current = true;
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Set profile name
      await updateProfile(credential.user, { displayName });
      // Build profile document
      const userDocRef = doc(db, 'users', credential.user.uid);
      const newProfile = {
        uid: credential.user.uid,
        email: credential.user.email || '',
        displayName: displayName,
        photoURL: '',
        role: role,
        createdAt: serverTimestamp(),
      };
      
      try {
        await setDoc(userDocRef, newProfile);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, `users/${credential.user.uid}`);
      }

      setUserProfile(newProfile as UserProfile);
      closeAuth();
    } catch (err) {
      console.error("Email registration failed", err);
      throw err;
    } finally {
      isRegistering.current = false;
      setLoading(false);
    }
  };

  // Sign In with email/password
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (credential.user) {
        await fetchOrCreateProfile(credential.user);
      }
      closeAuth();
    } catch (err) {
      console.error("Email Sign-in failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out helper
  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error("Logout failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      isAuthModalOpen,
      authModalMode,
      openAuth,
      closeAuth,
      loginWithGoogle,
      signUpWithEmail,
      signInWithEmail,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
