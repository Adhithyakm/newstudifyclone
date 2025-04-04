"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface SessionCardProps {
  session: {
    classCode: string;
    topic: string;
    startTime: Date;
    endTime: Date;
    status: string;
    participants: string[];
  };
  isHost: boolean;
}

export default function SessionCard({ session, isHost }: SessionCardProps) {
  const canStart = isHost && new Date() >= session.startTime;

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{session.topic}</h3>
      <div className="space-y-2 text-sm">
        <p>Class Code: {session.classCode}</p>
        <p>
          Status:{" "}
          <span
            className={
              session.status === "active"
                ? "text-green-600"
                : session.status === "completed"
                ? "text-gray-500"
                : "text-blue-600"
            }
          >
            {session.status}
          </span>
        </p>
        <p>Start: {format(session.startTime, "MMM dd, yyyh:mm a")}</p>
        <p>Participants: {session.participants.length}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {isHost && (
          <Button asChild variant={canStart ? "default" : "outline"}>
            <Link href={`/session/${session.classCode}`}>
              {canStart ? "Start Session" : "View Details"}
            </Link>
          </Button>
        )}
        {!isHost && (
          <Button asChild variant="outline">
            <Link href={`/session/${session.classCode}`}>Join Session</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
