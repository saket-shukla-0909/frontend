import React from "react";
import ChatUser from "./ChatUser";
import Messages from "./Messages";
import Type from "./Type";
import useConversation from "../../StateManage/useConversation";
import CallScreen from "../../features/call/callScreen";

const Right = () => {
  const { selectedConversation } = useConversation();

  // 👇 If no conversation selected, don't show anything on right side
  if (!selectedConversation?._id) {
    return (
      <div className="w-[70%] bg-gray-700 flex items-center justify-center text-gray-300 text-lg">
        Welcome Saket Shukla <br/> Select a conversation to start chatting 💬
      </div>
    );
  }

  return (
    <div className="w-[70%] bg-gray-200">
      <ChatUser />
      <div style={{ height: "calc(80vh)" }} className="custom-scroll overflow-y-auto">
        <Messages />
      </div>
      <Type />
      {(callAccepted || receivingCall) && isVideoCall && !callEnded && (
          <CallScreen/>
      )}
    </div>
  );
};

export default Right;
