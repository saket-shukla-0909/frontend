import Peer from "simple-peer";
import { useRef, useState, useEffect } from "react";
import socket from "../socket/socket";
import useMedia from "./useMedia";

const useCallManager = () => {
  const { stream, myVideo } = useMedia();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callee, setCallee] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false); // ✅ Added

  const ringtone = useRef(null);

  useEffect(() => {
    ringtone.current = new Audio("/sounds/ringtone.mp3");
    ringtone.current.loop = true;
  }, []);

  // 📞 Initiating a call
  const callUser = (userId, video = false) => {
    console.log("📞 Calling user:", userId);
    setIsVideoCall(video); // ✅ Track if video or audio call

    const peer = new Peer({ initiator: true, trickle: false, stream });
    setCallee(userId);

    peer.on("signal", (signalData) => {
      socket.emit("call-user", {
        to: userId,
        signalData,
        from: socket.id,
        isVideoCall: video, // Optional: inform receiver
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
  };

  // ✅ Answering an incoming call
  const answerCall = () => {
    setCallAccepted(true);
    ringtone.current?.pause();

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("answer-call", {
        signal,
        to: caller,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // ❌ Leave the call
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();

    const otherUser = caller || callee;
    if (otherUser) {
      socket.emit("end-call", { to: otherUser });
    }

    ringtone.current?.pause();
    ringtone.current.currentTime = 0;
    resetCallState();
  };

  // 🔄 Reset call-related states
  const resetCallState = () => {
    setReceivingCall(false);
    setCaller(null);
    setCallerSignal(null);
    setCallAccepted(false);
    setCallEnded(false);
    setCallee(null);
    setIsVideoCall(false); // ✅ Reset video state
    if (userVideo.current) userVideo.current.srcObject = null;
  };

  // 📥 Incoming call
  useEffect(() => {
    socket.on("receive-call", ({ from, signal, isVideoCall: incomingIsVideo }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
      setIsVideoCall(incomingIsVideo ?? true); // fallback to video by default
      ringtone.current?.play().catch(() => {});
    });

    socket.on("call-answered", ({ signal }) => {
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    socket.on("call-ended", () => {
      setCallEnded(true);
      connectionRef.current?.destroy();
      ringtone.current?.pause();
      ringtone.current.currentTime = 0;
      resetCallState();
    });

    return () => {
      socket.off("receive-call");
      socket.off("call-answered");
      socket.off("call-ended");
    };
  }, []);

  return {
    stream,
    myVideo,
    userVideo,
    callUser,
    answerCall,
    leaveCall,
    receivingCall,
    caller,
    callAccepted,
    callEnded,
    isVideoCall, // ✅ Now exposed
  };
};

export default useCallManager;
