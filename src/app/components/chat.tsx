import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Import auth from your firebase config
import Message from "../components/Message";
import { serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth"; // Add this import

interface ChatProps {
  sessionId: string;
}

interface MessageData {
  id: string;
  content: string;
  userId: string;
  timestamp: any;
}

const Chat = ({ sessionId }: ChatProps) => {
  const [user] = useAuthState(auth); // Get authenticated user
  const messagesRef = collection(db, "messages");
  const messagesQuery = query(
    messagesRef,
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "asc")
  );
  const [messages] = useCollection(messagesQuery);

  const sendMessage = async (content: string) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    await addDoc(messagesRef, {
      sessionId,
      userId: user.uid,
      content,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div>
      {messages?.docs.map((doc) => {
        const msg = doc.data() as MessageData;
        return (
          <Message key={doc.id} content={msg.content} userId={msg.userId} />
        );
      })}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const content = formData.get("message") as string;
          sendMessage(content);
          e.currentTarget.reset();
        }}
      >
        <input name="message" type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
