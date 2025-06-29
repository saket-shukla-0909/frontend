import React, { useEffect, useState } from "react";
import { FiPhoneCall, FiVideo } from "react-icons/fi";
import useConversation from "../../StateManage/useConversation";
import useCallManager from "../../../hooks/useCallManagers";
import socket from "../../socket/socket";


const ChatUser = () => {
  const { selectedConversation } = useConversation();
  const [isTyping, setIsTyping] = useState(false);
  const { callUser } = useCallManager(); // 👈 grab callUser

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const handleTyping = ({ from }) => {
      if (from === selectedConversation._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ from }) => {
      if (from === selectedConversation._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [selectedConversation]);

  if (!selectedConversation) return null;

  const isOnline = selectedConversation.status === 1;
  const profileImage = selectedConversation?.profile_picture?.includes("uploads")
    ? `${process.env.REACT_APP_BASE_URL}/${selectedConversation.profile_picture
        .replace(/\\/g, "/")
        .replace(/^.*uploads\//, "uploads/")}`
    : "https://img.daisyui.com/images/profile/demo/gordon@192.webp";

  return (
    <div className="flex items-center h-[10vh] gap-4 px-4 py-3 bg-white shadow-md rounded-md">
      {/* Avatar */}
      <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
        <div className="w-12 rounded-full">
          <img src={profileImage} alt="User Avatar" />
        </div>
      </div>

      {/* Selected User Info */}
      <div>
        <h1 className="text-lg font-semibold">{selectedConversation.full_name}</h1>
        <span
          className={`text-sm ${
            isTyping ? "text-green-600" : isOnline ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Call Icons */}
      <div className="ml-auto flex items-center gap-6 pr-2">
        <button
          title="Audio Call"
          className="p-2 rounded-full hover:bg-green-100 transition"
          onClick={() => callUser(selectedConversation._id)} // 👈 audio call (same as video, logic is in stream)
        >
          <FiPhoneCall size={22} className="text-green-600" />
        </button>
        <button
          title="Video Call"
          className="p-2 rounded-full hover:bg-green-100 transition"
          onClick={() => callUser(selectedConversation._id)} // 👈 video call (handled in stream)
        >
          <FiVideo size={22} className="text-green-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatUser;


// import React, { useEffect, useState } from "react";
// import { FiPhoneCall, FiVideo } from "react-icons/fi";
// import useConversation from "../../StateManage/useConversation";
// import socket from "../../socket/socket";

// const ChatUser = () => {
//   const { selectedConversation } = useConversation();
//   const [isTyping, setIsTyping] = useState(false);

//   useEffect(() => {
//     if (!selectedConversation?._id) return;

//     const handleTyping = ({ from }) => {
//       if (from === selectedConversation._id) {
//         setIsTyping(true);
//       }
//     };

//     const handleStopTyping = ({ from }) => {
//       if (from === selectedConversation._id) {
//         setIsTyping(false);
//       }
//     };

//     socket.on("typing", handleTyping);
//     socket.on("stop-typing", handleStopTyping);

//     return () => {
//       socket.off("typing", handleTyping);
//       socket.off("stop-typing", handleStopTyping);
//     };
//   }, [selectedConversation]);

//   if (!selectedConversation) return null;

//   const isOnline = selectedConversation.status === 1;
//   const profileImage = selectedConversation?.profile_picture?.includes("uploads")
//     ? `${process.env.REACT_APP_BASE_URL}/${selectedConversation.profile_picture
//         .replace(/\\/g, "/")
//         .replace(/^.*uploads\//, "uploads/")}`
//     : "https://img.daisyui.com/images/profile/demo/gordon@192.webp";

//   return (
//     <div className="flex items-center h-[10vh] gap-4 px-4 py-3 bg-white shadow-md rounded-md">
//       {/* Avatar */}
//       <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
//         <div className="w-12 rounded-full">
//           <img src={profileImage} alt="User Avatar" />
//         </div>
//       </div>

//       {/* Selected User Info */}
//       <div>
//         <h1 className="text-lg font-semibold">{selectedConversation.full_name}</h1>
//         <span
//           className={`text-sm ${
//             isTyping ? "text-green-600" : isOnline ? "text-green-600" : "text-gray-500"
//           }`}
//         >
//           {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
//         </span>
//       </div>

//       {/* Call Icons */}
//       <div className="ml-auto flex items-center gap-6 pr-2">
//         <button
//           title="Audio Call"
//           className="p-2 rounded-full hover:bg-green-100 transition"
//         >
//           <FiPhoneCall size={22} className="text-green-600" />
//         </button>
//         <button
//           title="Video Call"
//           className="p-2 rounded-full hover:bg-green-100 transition"
//         >
//           <FiVideo size={22} className="text-green-600" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatUser;

