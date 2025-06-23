import React from "react";
import moment from "moment";

const Message = ({ message, isOwnMessage }) => {
  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble flex items-center justify-between gap-2 ${
          isOwnMessage
            ? "bg-gray-900 text-white chat-bubble-info"
            : "bg-white text-gray-900 shadow"
        }`}
      >
        <span>{message.message}</span>
        <span className="text-[10px] opacity-70 whitespace-nowrap pt-2">
          {moment(message.createdAt).format("hh:mm A")}
        </span>
      </div>
    </div>
  );
};

export default Message;
