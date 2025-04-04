"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Session } from "@/types/session";
import { ClientSession } from "@/types/client-session";

import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import ProgressChart from "../components/ProgressChart";
import SessionCard from "@/app/components/SessionCard";
import { toFirebaseId } from "@/lib/idConverter";

interface Session {
  id: string;
  classCode: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  status: string;
  participants: string[];
  creatorId?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [createdSessions, setCreatedSessions] = useState<Session[]>([]);
  const [joinedSessions, setJoinedSessions] = useState<Session[]>([]);

  // Helper function to convert Firestore data to Session type
  const firestoreToClientSession = (doc: DocumentData): ClientSession => ({
    id: doc.id,
    classCode: doc.classCode,
    topic: doc.topic,
    instructorName: doc.instructorName,
    instructorId: doc.instructorId,
    startTime: doc.startTime.toDate(),
    endTime: doc.endTime.toDate(),
    status: doc.status,
    participants: doc.participants,
    meetingLink: doc.meetingLink,
    timeSpent: Math.floor(
      (doc.endTime.toDate().getTime() - doc.startTime.toDate().getTime()) /
        60000
    ),
  });

  useEffect(() => {
    if (!user) return;

    // Query for created sessions
    const createdQuery = query(
      collection(db, "sessions"),
      where("creatorId", "==", toFirebaseId(user.id))
    );

    const createdUnsub = onSnapshot(createdQuery, (snapshot) => {
      const sessions = snapshot.docs.map((doc) =>
        firestoreToClientSession(doc.data())
      );
      setCreatedSessions(sessions);
    });

    // Query for joined sessions
    const joinedQuery = query(
      collection(db, "sessions"),
      where("participants", "array-contains", toFirebaseId(user.id))
    );

    const joinedUnsub = onSnapshot(joinedQuery, (snapshot) => {
      const sessions = snapshot.docs.map((doc) =>
        firestoreToClientSession(doc.data())
      );
      setJoinedSessions(sessions);
    });

    return () => {
      createdUnsub();
      joinedUnsub();
    };
  }, [user]);

  return (
    <div className="p-6 grid gap-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-4">Your Hosted Sessions</h2>
          <ProgressChart sessions={createdSessions} type="created" />
        </div>

        <div>
          <h2 className="text-2xl mb-4">Joined Sessions</h2>
          <ProgressChart sessions={joinedSessions} type="joined" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Hosted Sessions</h3>
          {createdSessions.map((session) => (
            <SessionCard key={session.id} session={session} isHost={true} />
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Joined Sessions</h3>
          {joinedSessions.map((session) => (
            <SessionCard key={session.id} session={session} isHost={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
