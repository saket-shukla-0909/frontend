import React from "react";
import moment from "moment";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const Message = ({ message, isOwnMessage }) => {
  const getStatusIcon = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "sent":
        return <FaCheck className="text-gray-400 text-[10px]" />;
      case "delivered":
        return <FaCheckDouble className="text-blue-400 text-[10px]" />;
      case "seen":
        return <FaCheckDouble className="text-green-500 text-[10px]" />;
      default:
        return null;
    }
  };

  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble max-w-xs md:max-w-md break-words ${
          isOwnMessage
            ? "bg-gray-800 text-white"
            : "bg-base-200 text-base-content"
        }`}
      >
        <div className="flex flex-col">
          <span>{message.message}</span>
          <div className="flex items-center justify-end mt-1 gap-1">
            <span className="text-[10px] opacity-60">
              {moment(message.createdAt).format("hh:mm A")}
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

// import React from "react";
// import moment from "moment";

// const Message = ({ message, isOwnMessage }) => {
//   return (
//     <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
//       <div
//         className={`chat-bubble max-w-xs md:max-w-md break-words ${
//           isOwnMessage
//             ? "bg-primary text-white"
//             : "bg-base-200 text-base-content"
//         }`}
//       >
//         <div className="flex flex-col">
//           <span>{message.message}</span>
//           <span className="text-[10px] opacity-60 self-end mt-1">
//             {moment(message.createdAt).format("hh:mm A")}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;
