import React from "react";
import useCallManager from "../../../hooks/useCallManagers";


const CallScreen = () => {
  const {
    myVideo,
    userVideo,
    answerCall,
    leaveCall,
    callAccepted,
    callEnded,
    receivingCall,
  } = useCallManager();

  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <video ref={myVideo} autoPlay muted playsInline className="w-1/2 rounded-md" />
      {callAccepted && !callEnded && (
        <video ref={userVideo} autoPlay playsInline className="w-1/2 rounded-md" />
      )}

      {receivingCall && !callAccepted && (
        <button className="btn btn-success" onClick={answerCall}>
          Accept Call
        </button>
      )}

      {callAccepted && !callEnded && (
        <button className="btn btn-error" onClick={leaveCall}>
          End Call
        </button>
      )}
    </div>
  );
};

export default CallScreen;
