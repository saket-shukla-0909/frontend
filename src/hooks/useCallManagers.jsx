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
  const [callee, setCallee] = useState(null); // for tracking who we called
  const [callerSignal, setCallerSignal] = useState(null);

  const ringtone = useRef(null);

  useEffect(() => {
    ringtone.current = new Audio("/sounds/ringtone.mp3");
    ringtone.current.loop = true;
  }, []);

  // 📞 Initiating a call
  const callUser = (userId) => {
    console.log("📞 Calling user:", userId);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    setCallee(userId); // Save callee for later in case we end the call

    peer.on("signal", (signalData) => {
      console.log("📡 Emitting call-user signal...");
      socket.emit("call-user", {
        to: userId,
        signalData,
        from: socket.id,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("🎥 Received remote stream");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
  };

  // ✅ Answering an incoming call
  const answerCall = () => {
    console.log("✅ Answering call from:", caller);
    setCallAccepted(true);
    ringtone.current?.pause();

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      console.log("📡 Sending answer signal...");
      socket.emit("answer-call", {
        signal,
        to: caller,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("🎥 Receiving stream after answering");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // ❌ Leave or end the call
  const leaveCall = () => {
    console.log("❌ Call ended");
    setCallEnded(true);
    connectionRef.current?.destroy();

    const otherUser = caller || callee;
    if (otherUser) {
      socket.emit("end-call", { to: otherUser });
    }

    resetCallState();
  };

  // 🔄 Reset all call-related state
  const resetCallState = () => {
    setReceivingCall(false);
    setCaller(null);
    setCallerSignal(null);
    setCallAccepted(false);
    setCallEnded(false);
    setCallee(null);
    if (userVideo.current) userVideo.current.srcObject = null;
  };

  // 📥 Listen for call events
  useEffect(() => {
    socket.on("receive-call", ({ from, signal }) => {
      console.log("📲 Incoming call from:", from);
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
      ringtone.current?.play().catch(() => {});
    });

    socket.on("call-answered", ({ signal }) => {
      console.log("✅ Call was answered. Connecting peer...");
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    socket.on("call-ended", () => {
      console.log("❌ Call ended by the other user");
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
  };
};

export default useCallManager;
