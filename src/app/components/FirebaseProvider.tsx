"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Ensure Firestore initialization completes
    const checkInitialization = () => {
      if (db) {
        setFirebaseReady(true);
      } else {
        requestAnimationFrame(checkInitialization);
      }
    };

    checkInitialization();
  }, []);

  if (!firebaseReady) return <div>Initializing Firebase...</div>;

  return <>{children}</>;
}
