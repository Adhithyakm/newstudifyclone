// lib/firestore-converters.ts
import { DocumentData } from "firebase/firestore";
import { ClientSession } from "@/types/client-session";

export const firestoreToClientSession = (doc: DocumentData): ClientSession => {
  const data = doc.data();
  const now = new Date();
  const startTime = data.startTime?.toDate() || new Date();
  const endTime = data.endTime?.toDate() || new Date();

  // Dynamic status calculation
  let status: "upcoming" | "active" | "completed" = "upcoming";
  if (now > endTime) {
    status = "completed";
  } else if (now >= startTime) {
    status = "active";
  }

  // Accurate time calculation
  const timeSpent = status === "completed" 
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 60000)
    : status === "active"
    ? Math.floor((now.getTime() - startTime.getTime()) / 60000)
    : 0;

  return {
    id: doc.id,
    classCode: data.classCode || "N/A",
    topic: data.topic || "Untitled Session",
    instructorName: data.instructorName || "Unknown Instructor",
    instructorId: data.creatorId || "",
    startTime,
    endTime,
    status,
    participants: data.participants || [],
    meetingLink: data.meetingLink || "",
    timeSpent,
  };
};