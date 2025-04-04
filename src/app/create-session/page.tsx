"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { toFirebaseId } from "@/lib/idConverter";
import { useAuth } from "@/context/AuthContext";

interface SessionFormData {
  topic: string;
  startTime: string;
  duration: number;
}

const CreateSessionPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<SessionFormData>({
    topic: "",
    startTime: "",
    duration: 60,
  });
  const [classCode] = useState(uuidv4().slice(0, 8).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    let startTime: Date | null = null;
    let endTime: Date | null = null;

    try {
      if (authLoading) throw new Error("Authentication check in progress");
      if (!user) throw new Error("User not authenticated");

      // Validate and convert dates
      startTime = new Date(formData.startTime);
      if (isNaN(startTime.getTime())) throw new Error("Invalid start time");

      endTime = new Date(startTime.getTime() + formData.duration * 60000);
      if (isNaN(endTime.getTime())) throw new Error("Invalid end time");

      console.log("Attempting Firestore write...", {
        classCode,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        userId: user.id,
      });

      const docRef = await addDoc(collection(db, "sessions"), {
        classCode,
        topic: formData.topic,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        creatorId: toFirebaseId(user.id),
        instructorName: user.name,
        participants: [toFirebaseId(user.id)],
        status: "scheduled",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        meetingLink: `${window.location.origin}/session/${classCode}`,
      });

      console.log("Document written with ID:", docRef.id);
      router.push(`/dashboard?session=${classCode}`);
    } catch (err) {
      console.error("Firestore write error:", {
        error: err,
        inputData: {
          topic: formData.topic,
          startTime: formData.startTime,
          duration: formData.duration,
          user: user ? { id: user.id, name: user.name } : null,
        },
        convertedDates: {
          startTime: startTime?.toISOString(),
          endTime: endTime?.toISOString(),
        },
        firebaseConfig: {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        },
      });

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create session. Please check your inputs and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${classCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading authentication status...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You must be logged in to create a session</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Study Session
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Topic
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter session topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Class Code
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <span>{copied ? "Copied!" : "Copy Link"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg bg-white px-3 py-1 rounded-md border">
                {classCode}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating Session..." : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
