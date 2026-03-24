"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "student" | "admin";
};

type AuthContextType = {
  user: AuthUser | null;
  firebaseUser: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string, role: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

/** Create or update user document in Firestore */
async function upsertUserDoc(firebaseUser: User, extra?: { name?: string; role?: string }) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: extra?.name || firebaseUser.displayName || "Anonymous",
      photoURL: firebaseUser.photoURL || null,
      role: extra?.role || "student",
      createdAt: serverTimestamp(),
    });
  }

  const data = snap.exists() ? snap.data() : { role: extra?.role || "student" };
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);
        const data = snap.data();
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: data?.displayName || fbUser.displayName,
          photoURL: fbUser.photoURL,
          role: data?.role || "student",
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
  };

  const signupWithEmail = async (name: string, email: string, password: string, role: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await upsertUserDoc(cred.user, { name, role });
    router.push("/dashboard");
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await upsertUserDoc(cred.user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, isLoading, loginWithEmail, signupWithEmail, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
