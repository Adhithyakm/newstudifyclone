"use client";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ClientSession } from "@/types/client-session";

Chart.register(...registerables);

interface ProgressChartProps {
  sessions: ClientSession[];
  type: "created" | "joined";
}

export default function ProgressChart({ sessions, type }: ProgressChartProps) {
  const data = {
    labels: sessions.map((s) => s.topic),
    datasets: [
      {
        label: `${type === "created" ? "Hosted" : "Attended"} Sessions`,
        data: sessions.map((s) => s.timeSpent),
        borderColor:
          type === "created" ? "rgb(79, 70, 229)" : "rgb(34, 197, 94)",
        backgroundColor:
          type === "created"
            ? "rgba(79, 70, 229, 0.2)"
            : "rgba(34, 197, 94, 0.2)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Session Duration in Minutes",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutes",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
