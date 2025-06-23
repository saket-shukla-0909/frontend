import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useConversation from "../../StateManage/useConversation";
import Message from "./Message";
import { fetchMessages } from "../../redux/messageSlice";
import Loading from "../../Components/Loading";
import socket from "../../socket/socket"; // ✅ Import socket

const Messages = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useConversation();
  const { messages } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const [showLoading, setShowLoading] = useState(false);

  // ⏳ Initial message fetch when conversation changes
  useEffect(() => {
    let timeout;

    if (selectedConversation?._id) {
      setShowLoading(true);

      dispatch(fetchMessages(selectedConversation._id)).then(() => {
        timeout = setTimeout(() => {
          setShowLoading(false);
        }, 1000);
      });
    }

    return () => {
      clearTimeout(timeout);
      setShowLoading(false);
    };
  }, [dispatch, selectedConversation]);




  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedConversation._id ||
        newMessage.recieverId === selectedConversation._id
      ) {
        dispatch(fetchMessages(selectedConversation._id));
      }
    };

    socket.on("message received", handleNewMessage);

    return () => {
      socket.off("message received", handleNewMessage); // cleanup
    };
  }, [selectedConversation, dispatch]);

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === user._id &&
        msg.recieverId === selectedConversation._id) ||
      (msg.senderId === selectedConversation._id &&
        msg.recieverId === user._id)
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
