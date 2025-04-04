"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Session {
  id: string;
  classCode: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  creatorId: string;
  participants: string[];
  status: "scheduled" | "active" | "completed";
}

interface SessionContextType {
  createdSessions: Session[];
  joinedSessions: Session[];
}

const SessionContext = createContext<SessionContextType>({
  createdSessions: [],
  joinedSessions: [],
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [createdSessions, setCreatedSessions] = useState<Session[]>([]);
  const [joinedSessions, setJoinedSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!user) return;

    const createdQuery = query(
      collection(db, "sessions"),
      where("creatorId", "==", user.id)
    );

    const joinedQuery = query(
      collection(db, "sessions"),
      where("participants", "array-contains", user.id),
      where("creatorId", "!=", user.id)
    );

    const unsubscribeCreated = onSnapshot(createdQuery, (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
      }));
      setCreatedSessions(sessions);
    });

    const unsubscribeJoined = onSnapshot(joinedQuery, (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
      }));
      setJoinedSessions(sessions);
    });

    return () => {
      unsubscribeCreated();
      unsubscribeJoined();
    };
  }, [user]);

  return (
    <SessionContext.Provider value={{ createdSessions, joinedSessions }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessions = () => useContext(SessionContext);
