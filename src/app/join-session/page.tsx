"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const JoinSessionPage = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify session code with your API
      const response = await fetch(`/api/sessions/${code}`);
      if (!response.ok) throw new Error("Invalid session code");

      // If valid, redirect to session page
      router.push(`/session/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid session code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Join Session</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Session Code
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABCD-1234"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Joining..." : "Join Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinSessionPage;
