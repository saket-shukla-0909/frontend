import React, { useEffect, useState } from "react";
import useCallManager from "../../hooks/useCallManagers";

const CallScreen = () => {
  const {
    myVideo,
    userVideo,
    answerCall,
    leaveCall,
    callAccepted,
    callEnded,
    receivingCall,
    caller,
  } = useCallManager();

  const [isReceiver, setIsReceiver] = useState(false);

  useEffect(() => {
    // Identify if current user is receiver (i.e., receiving call and hasn't accepted yet)
    if (receivingCall && !callAccepted) {
      setIsReceiver(true);
    } else {
      setIsReceiver(false);
    }
  }, [receivingCall, callAccepted]);

  // When call ends, cleanup handled in hook — but we can log here
  useEffect(() => {
    if (callEnded) {
      console.log("🔚 Call ended, cleaning up UI.");
    }
  }, [callEnded]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-3xl flex flex-col items-center gap-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {receivingCall && !callAccepted ? "Incoming Call..." : "In Call"}
        </h2>

        <div className="flex gap-4 w-full justify-center flex-wrap">
          {/* 📹 Local Video */}
          <video
            ref={myVideo}
            autoPlay
            muted
            playsInline
            className="w-64 h-40 rounded-lg bg-black"
          />

          {/* 📺 Remote Video */}
          {callAccepted && !callEnded && (
            <video
              ref={userVideo}
              autoPlay
              playsInline
              className="w-64 h-40 rounded-lg bg-black"
            />
          )}
        </div>

        {/* 📞 Buttons */}
        <div className="flex gap-4 mt-4">
          {/* Receiver Side: Show Accept/Reject */}
          {isReceiver && (
            <>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                onClick={answerCall}
              >
                Accept Call
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={leaveCall}
              >
                Reject
              </button>
            </>
          )}

          {/* Both Sides: Show End if in call */}
          {callAccepted && !callEnded && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              onClick={leaveCall}
            >
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallScreen;
