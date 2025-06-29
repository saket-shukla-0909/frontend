import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useConversation from "../../StateManage/useConversation";
import Message from "./Message";
import { fetchMessages, updateMessageStatus } from "../../redux/messageSlice";
import Loading from "../../Components/Loading";
import socket from "../../socket/socket";

const Messages = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useConversation();
  const { messages } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const [showLoading, setShowLoading] = useState(false);

  // Fetch messages when conversation changes
  useEffect(() => {
    let timeout;
    if (selectedConversation?._id) {
      setShowLoading(true);
      dispatch(fetchMessages(selectedConversation._id)).then(() => {
        timeout = setTimeout(() => setShowLoading(false), 800);
      });
    }
    return () => {
      clearTimeout(timeout);
      setShowLoading(false);
    };
  }, [dispatch, selectedConversation]);

  // Handle incoming messages in real-time
  useEffect(() => {
    const handleReceive = (newMessage) => {
      if (
        newMessage.senderId === selectedConversation._id ||
        newMessage.recieverId === selectedConversation._id
      ) {
        dispatch(fetchMessages(selectedConversation._id));
      }
    };

    const handleSeenUpdate = (updatedMessage) => {
      dispatch(updateMessageStatus({ messageId: updatedMessage._id, status: "seen" }));
    };

    socket.on("msg-receive", handleReceive);
    socket.on("message-seen-update", handleSeenUpdate);

    return () => {
      socket.off("msg-receive", handleReceive);
      socket.off("message-seen-update", handleSeenUpdate);
    };
  }, [selectedConversation, dispatch]);

  // Emit seen for other user's messages
  useEffect(() => {
    messages.forEach((msg) => {
      if (
        msg.recieverId === user._id &&
        msg.senderId === selectedConversation._id &&
        msg.status !== "seen"
      ) {
        socket.emit("message-seen", { messageId: msg._id });
        dispatch(updateMessageStatus({ messageId: msg._id, status: "seen" }));
      }
    });
  }, [messages, selectedConversation, user._id, dispatch]);

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === user._id && msg.recieverId === selectedConversation._id) ||
      (msg.senderId === selectedConversation._id && msg.recieverId === user._id)
  );

  return (
    <div className="p-4 h-full overflow-y-auto custom-scroll flex flex-col justify-end">
      {showLoading ? (
        <Loading />
      ) : filteredMessages.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-400 text-center">
          Say! Hii <span className="text-xl ml-1">👋</span>
        </div>
      ) : (
        filteredMessages.map((msg) => (
          <Message
            key={msg._id}
            message={msg}
            isOwnMessage={msg.senderId === user._id}
          />
        ))
      )}
    </div>
  );
};

export default Messages;

