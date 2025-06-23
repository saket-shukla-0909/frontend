import React from "react";
import moment from "moment";

const Message = ({ message, isOwnMessage }) => {
  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble max-w-xs md:max-w-md break-words ${
          isOwnMessage
            ? "bg-primary text-white"
            : "bg-base-200 text-base-content"
        }`}
      >
        <div className="flex flex-col">
          <span>{message.message}</span>
          <span className="text-[10px] opacity-60 self-end mt-1">
            {moment(message.createdAt).format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
