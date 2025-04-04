"use client";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function CodeEditor({ roomId }: { roomId: string }) {
  const [code, setCode] = useState("// Start coding here...");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "sessions", roomId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setCode(doc.data().code || "");
        if (!isInitialized) setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleCodeChange = async (value: string) => {
    await updateDoc(doc(db, "sessions", roomId), {
      code: value,
    });
  };

  return (
    <CodeMirror
      value={code}
      height="100%"
      extensions={[javascript()]}
      onChange={handleCodeChange}
      theme="dark"
    />
  );
}
