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
  const [callerSignal, setCallerSignal] = useState(null);

  // 📞 Call someone
  const callUser = (userId) => {
    console.log("📞 Calling user:", userId);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signalData) => {
      console.log("📡 Emitting call-user signal...");
      socket.emit("call-user", {
        to: userId,
        signalData,
        from: socket.id,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("🎥 Stream received from remote peer");
      userVideo.current.srcObject = remoteStream;
    });

    connectionRef.current = peer;
  };

  // ✅ Answer an incoming call
  const answerCall = () => {
    console.log("✅ Answering call from:", caller);
    setCallAccepted(true);

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
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // ❌ Leave/end the call
  const leaveCall = () => {
    console.log("❌ Call ended");
    setCallEnded(true);
    connectionRef.current?.destroy();
    socket.emit("end-call", { to: caller });
  };

  useEffect(() => {
    // 📲 Incoming call
    socket.on("receive-call", ({ from, signal }) => {
      console.log("📲 Incoming call from:", from);
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    // ✅ Call was answered
    socket.on("call-answered", ({ signal }) => {
      console.log("✅ Call was answered. Connecting peer...");
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    // ❌ Call was ended
    socket.on("call-ended", () => {
      console.log("❌ Call ended by the other user");
      setCallEnded(true);
      connectionRef.current?.destroy();
    });

    // 🔁 Cleanup listeners on unmount
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
