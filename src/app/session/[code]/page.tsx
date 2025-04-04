"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JitsiMeet from "@/app/components/JitsiMeeting";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { toFirebaseId } from "@/lib/idConverter";
import { Loader2 } from "lucide-react";

export default function SessionPage() {
  const { code } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionValid, setSessionValid] = useState(false);
  useEffect(() => {
    const verifySessionAccess = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if session exists
        const sessionDoc = await getDoc(doc(db, "sessions", code as string));

        if (!sessionDoc.exists()) {
          throw new Error("Session not found");
        }

        const sessionData = sessionDoc.data();
        const firebaseUserId = user?.id ? toFirebaseId(String(user.id)) : "";
        // Verify user access
        const isHost = sessionData.creatorId === firebaseUserId;
        const isParticipant =
          sessionData.participants?.includes(firebaseUserId);

        if (!isHost && !isParticipant) {
          throw new Error("You don't have access to this session");
        }

        // Check session timing
        const now = new Date();
        const startTime = sessionData.startTime?.toDate();
        const endTime = sessionData.endTime?.toDate();

        if (!startTime || !endTime) {
          throw new Error("Invalid session timing");
        }

        if (now > endTime) {
          throw new Error("This session has already ended");
        }

        setSessionValid(true);
      } catch (err) {
        console.error("Session verification error:", err);
        setError(err instanceof Error ? err.message : "Invalid session access");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      verifySessionAccess();
    }
  }, [code, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <span className="sr-only">Loading session...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-600">Session Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    return null; // Already handled by error state
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <JitsiMeet roomName={code as string} />
        </div>
      </div>
    </div>
  );
}
