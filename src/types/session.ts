import { firestore } from "firebase-admin";

// types/session.ts
export interface Session {
  id: string; // Firestore document ID
  classCode: string;
  topic: string;
  instructorName: string;
  instructorId: string; // Reference to Neon User ID
  startTime: firestore.Timestamp;
  endTime: firestore.Timestamp;
  status: "upcoming" | "ongoing" | "completed";
  participants: string[]; // Array of Neon User IDs
  meetingLink: string;
}