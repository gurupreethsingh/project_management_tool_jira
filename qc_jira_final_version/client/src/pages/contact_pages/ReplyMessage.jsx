import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaUser,
  FaClock,
  FaReply,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";

export default function ReplyMessage({ setUnreadMessagesCount }) {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);

  // Fetch the message and its replies from the backend
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reply-message/${id}`
        );
        setMessage(response.data);
        setReplies(response.data.replies);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, [id]);

  const handleReply = async () => {
    if (reply.trim() !== "") {
      const adminDetails = JSON.parse(localStorage.getItem("user")); // Get admin details from local storage
      const newReply = {
        name: adminDetails.name, // Use admin's name from local storage
        email: adminDetails.email, // Use admin's email from local storage
        message: reply,
      };

      try {
        const response = await axios.post(
          `http://localhost:5000/give-message-reply/${id}/reply`,
          newReply
        );
        setReplies([
          ...replies,
          { ...newReply, timestamp: new Date().toLocaleString() },
        ]);
        setReply("");

        // Reduce the unread count locally after a successful reply
        setUnreadMessagesCount((prevCount) => Math.max(prevCount - 1, 0));

        // Optionally, you might want to update the count on the backend as well.
        try {
          await axios.post(`http://localhost:5000/messages/mark-as-read`, {
            messageId: id,
          });
        } catch (markAsReadError) {
          console.error("Error marking message as read:", markAsReadError);
          // You can choose to handle this differently, perhaps by showing a notification to the user.
        }
      } catch (error) {
        console.error("Error sending reply:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  if (!message) return <p>Loading...</p>;
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="border-b pb-6 mb-6 text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FaEnvelope className="mr-2 text-indigo-600" />
          {message.message_text}
        </h2>
        <div className="flex items-center mb-2">
          <FaUser className="mr-2 text-blue-500" />
          <span className="text-sm text-gray-700">
            {message.firstName} {message.lastName} ({message.email})
          </span>
        </div>
        <div className="flex items-center mb-4">
          <FaClock className="mr-2 text-green-500" />
          <span className="text-sm text-gray-500">
            {new Date(message.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-800 mb-6">{message.message_text}</p>
      </div>

      <div className="text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaReply className="mr-2 text-indigo-600" />
          Replies
        </h3>
        {replies.length === 0 ? (
          <p className="text-gray-600">No replies yet.</p>
        ) : (
          replies.map((reply, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50 text-left"
            >
              <div className="flex items-center mb-2">
                <FaUserCircle className="mr-2 text-indigo-600" />
                <span className="font-semibold text-gray-700">
                  {reply.name}
                </span>
                <span className="ml-4 text-sm text-gray-500 flex">
                  <FaClock className="mr-1 text-green-500" />
                  {new Date(reply.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 ml-6 pl-1 border-l-2 border-indigo-600">
                {reply.message}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaCommentDots className="mr-2 text-indigo-600" />
          Your Reply
        </h3>
        <textarea
          className="w-full h-24 p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply here..."
        />
        <div className="flex justify-end">
          <button
            onClick={handleReply}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaReply className="mr-2" />
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}
