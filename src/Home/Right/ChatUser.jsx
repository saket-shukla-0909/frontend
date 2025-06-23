import React from "react";
import useConversation from "../../StateManage/useConversation";


const ChatUser = () => {
  const { selectedConversation } = useConversation();

  if (!selectedConversation) return null;

  const isOnline = selectedConversation.status === 1;
  const profileImage = selectedConversation.profile_picture
    ? `${process.env.REACT_APP_BASE_URL}/${selectedConversation.profile_picture.replace(/\\/g, "/")}`
    : "https://img.daisyui.com/images/profile/demo/gordon@192.webp"; // fallback

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
        <span className={`text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default ChatUser;
