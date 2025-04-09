"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
newstud;
export default function SessionPage() {
  const { code } = useParams();
  const { user } = useAuth();
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Verify session code exists in Firebase
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/sessions/${code}`);
        if (response.ok) {
          setIsValidSession(true);
        } else {
          window.location.href = "/404";
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        window.location.href = "/dashboard";
      }
    };

    if (code) {
      verifySession();
    }
  }, [code]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
          <p>Please login to join the session</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p>Verifying session code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            Session: {code}
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              {user.name}&apos;s Meeting
            </span>
          </h1>
          <JitsiMeet roomName={code as string} />
        </div>
      </div>
    </div>
  );
}
