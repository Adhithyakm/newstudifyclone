"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function FirebaseTest() {
  const [testResult, setTestResult] = useState("");
  const [error, setError] = useState("");

  const testFirebaseConnection = async () => {
    try {
      // Test Write Operation
      const docRef = await addDoc(collection(db, "connectionTest"), {
        testTime: new Date().toISOString(),
        status: "success",
      });

      // Test Read Operation
      const querySnapshot = await getDocs(collection(db, "connectionTest"));
      const docs = querySnapshot.docs.map((doc) => doc.data());

      setTestResult(`
        Connection Successful!
        Document ID: ${docRef.id}
        Retrieved Documents: ${docs.length}
      `);
    } catch (err) {
      setError(
        `Connection Failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      console.error("Firebase Test Error:", err);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <button
        onClick={testFirebaseConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Connection Test
      </button>

      {testResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <pre>{testResult}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}
