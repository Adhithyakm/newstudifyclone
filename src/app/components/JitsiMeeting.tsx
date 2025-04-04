"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface JitsiMeetProps {
  sessionId: string;
}

const JitsiMeet = ({ sessionId }: JitsiMeetProps) => {
  const { user } = useAuth();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [roomName, setRoomName] = useState<string>("");
  const apiRef = useRef<any>(null);

  // Fetch session details from Firebase
  useEffect(() => {
    const fetchSession = async () => {
      const sessionRef = doc(db, "study_sessions", sessionId);
      const sessionSnap = await getDoc(sessionRef);

      if (sessionSnap.exists()) {
        setRoomName(sessionSnap.data().roomName);
      } else {
        console.error("Session not found");
        window.location.href = "/dashboard";
      }
    };

    fetchSession();
  }, [sessionId]);

  // Initialize Jitsi Meet
  useEffect(() => {
    if (!roomName || !user || !jitsiContainerRef.current) return;

    const loadJitsi = async () => {
      try {
        const { JitsiMeetExternalAPI } = await import(
          "@jitsi/react-sdk/umd/external_api"
        );

        const options = {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "700px",
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          },
          userInfo: {
            displayName: user.name || "Anonymous",
            email: user.email || "",
          },
        };

        apiRef.current = new JitsiMeetExternalAPI("meet.jit.si", options);

        apiRef.current.on("readyToClose", () => {
          apiRef.current?.dispose();
          window.location.href = "/dashboard";
        });
      } catch (error) {
        console.error("Jitsi initialization error:", error);
        window.location.reload();
      }
    };

    loadJitsi();

    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (e) {
          console.log("Error disposing Jitsi:", e);
        }
      }
    };
  }, [roomName, user]);

  return (
    <div
      ref={jitsiContainerRef}
      className="w-full bg-gray-800 rounded-lg overflow-hidden"
      id="jitsi-container"
    />
  );
};

export default JitsiMeet;
