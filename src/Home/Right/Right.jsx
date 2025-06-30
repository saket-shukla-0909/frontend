import React from "react";
import ChatUser from "./ChatUser";
import Messages from "./Messages";
import Type from "./Type";
import useConversation from "../../StateManage/useConversation";
import CallScreen from "../../features/call/callScreen";
import useCallManager from "../../hooks/useCallManagers";

const Right = () => {
  const { selectedConversation } = useConversation();
  const { callAccepted, receivingCall, isVideoCall, callEnded } = useCallManager(); // ✅ Access variables

  // No conversation selected UI
  if (!selectedConversation?._id) {
    return (
      <div className="w-[70%] bg-gray-700 flex items-center justify-center text-gray-300 text-lg text-center">
        Welcome Saket Shukla <br /> Select a conversation to start chatting 💬
      </div>
    );
  }

  return (
    <div className="w-[70%] bg-gray-200 relative">
      <ChatUser />
      <div style={{ height: "calc(80vh)" }} className="custom-scroll overflow-y-auto">
        <Messages />
      </div>
      <Type />

      {/* 📞 Video Call Screen */}
      {(callAccepted || receivingCall) && isVideoCall && !callEnded && (
        <CallScreen />
      )}
    </div>
  );
};

export default Right;
