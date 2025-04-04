"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toFirebaseId } from "@/lib/idConverter";

interface Session {
  id: string;
  classCode: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "active" | "completed";
  meetingLink: string;
  participants: string[];
}

const HomePage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "sessions"),
      where("participants", "array-contains", toFirebaseId(user.id))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          classCode: data.classCode,
          topic: data.topic,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          status: data.status,
          meetingLink: data.meetingLink,
          participants: data.participants || [],
        };
      });
      setSessions(sessionsData);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ongoingSessions = sessions.filter(
    (session) =>
      (currentTime >= session.startTime && currentTime <= session.endTime) ||
      session.status === "active"
  );

  const upcomingSessions = sessions.filter(
    (session) =>
      currentTime < session.startTime && session.status === "scheduled"
  );

  const calculateProgress = (start: Date, end: Date) => {
    const total = end.getTime() - start.getTime();
    const elapsed = currentTime.getTime() - start.getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Study Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/create-session")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Session
          </button>
          <button
            onClick={() => router.push("/join-session")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Join Session
          </button>
        </div>
      </div>

      {/* Ongoing Sessions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Ongoing Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingSessions.map((session) => {
            const progress = calculateProgress(
              session.startTime,
              session.endTime
            );
            return (
              <div
                key={session.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {session.topic}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Code: {session.classCode}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {progress.toFixed(1)}% Complete •{" "}
                    {session.participants.length} Participants
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/session/${session.classCode}`)}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Join Live Session
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upcoming Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {session.topic}
              </h3>
              <p className="text-gray-600 mb-2">Code: {session.classCode}</p>
              <p className="text-sm text-gray-600">
                Starts: {session.startTime.toLocaleDateString()}{" "}
                {session.startTime.toLocaleTimeString()}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {Math.round(
                  (session.startTime.getTime() - currentTime.getTime()) / 60000
                )}{" "}
                minutes remaining
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default HomePage;
