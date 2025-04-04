// components/Message.tsx
interface MessageProps {
  content: string;
  userId: string;
}

const Message = ({ content, userId }: MessageProps) => {
  return (
    <div className="mb-2 p-2 bg-gray-50 rounded">
      <span className="font-medium text-gray-700">{userId}:</span>
      <p className="text-gray-900 mt-1">{content}</p>
    </div>
  );
};

export default Message;
