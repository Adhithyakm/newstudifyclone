"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

interface Session {
  id: string;
  classCode: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "active" | "completed";
}

interface SessionControlsProps {
  session: Session;
}

export default function SessionControls({ session }: SessionControlsProps) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      setIsActive(now >= start && now <= end);

      if (session.status === "scheduled") {
        const diff = start.getTime() - now.getTime();
        if (diff > 0) {
          const hours = Math.floor(diff / 3600000);
          const minutes = Math.floor((diff % 3600000) / 60000);
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining("0h 0m");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const startSession = async () => {
    try {
      await updateDoc(doc(db, "sessions", session.id), {
        status: "active",
        actualStartTime: serverTimestamp(),
      });
      router.push(`/session/${session.classCode}`);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-4">
      {session.status === "scheduled" && (
        <button
          onClick={startSession}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Start Session Now ({timeRemaining} remaining)
        </button>
      )}

      {isActive && (
        <button
          onClick={() => router.push(`/session/${session.classCode}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Join Live Session
        </button>
      )}

      {session.status === "completed" && (
        <div className="text-gray-500">This session has ended</div>
      )}
    </div>
  );
}
