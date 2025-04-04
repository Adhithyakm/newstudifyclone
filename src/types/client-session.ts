// types/client-session.ts
export interface ClientSession {
  id: string;
  classCode: string;
  topic: string;
  instructorName: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "completed";
  participants: string[];
  meetingLink: string;
  timeSpent: number; // in minutes
}