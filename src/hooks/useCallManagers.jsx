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
  const [isVideoCall, setIsVideoCall] = useState(false);

  const ringtone = useRef(null);

  // 🔉 Assign stream to local video element
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
      console.log("✅ Set local stream to myVideo");
    }
  }, [stream]);

  useEffect(() => {
    console.log("🎵 Initializing ringtone...");
    ringtone.current = new Audio("/sounds/ringtone.mp3");
    ringtone.current.loop = true;
  }, []);

  const callUser = (userId, video = false) => {
    console.log("📞 Initiating call to:", userId, "Video call:", video);

    if (!stream) {
      console.error("❌ No media stream available to initiate call.");
      return;
    }

    setIsVideoCall(video);
    setCallee(userId);

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signalData) => {
      console.log("📤 Emitting signal to user:", userId, signalData);
      socket.emit("call-user", {
        to: userId,
        signalData,
        from: socket.id,
        isVideoCall: video,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("📥 Received remote stream from callee.");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        console.log("✅ Set remote stream to userVideo");
      }
    });

    peer.on("error", (err) => {
      console.error("❌ Peer (caller) error:", err);
    });

    connectionRef.current = peer;
    console.log("🔌 Peer connection created (caller)");
  };

  const answerCall = () => {
    console.log("✅ Answering call from:", caller);

    if (!stream) {
      console.error("❌ No media stream available to answer call.");
      return;
    }

    setCallAccepted(true);
    ringtone.current?.pause();

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      console.log("📤 Emitting answer signal to:", caller);
      socket.emit("answer-call", {
        signal,
        to: caller,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("📥 Received remote stream from caller.");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        console.log("✅ Set remote stream to userVideo");
      }
    });

    peer.on("error", (err) => {
      console.error("❌ Peer (receiver) error:", err);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    console.log("🔌 Peer connection created (receiver)");
  };

  const leaveCall = () => {
    console.log("📴 Leaving call...");
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
      console.log("🔌 Peer connection destroyed");
    }

    const otherUser = caller || callee;
    if (otherUser) {
      console.log("📤 Emitting end-call to:", otherUser);
      socket.emit("end-call", { to: otherUser });
    }

    ringtone.current?.pause();
    ringtone.current.currentTime = 0;

    resetCallState();
  };

  const resetCallState = () => {
    console.log("♻️ Resetting call state...");
    setReceivingCall(false);
    setCaller(null);
    setCallerSignal(null);
    setCallAccepted(false);
    setCallEnded(false);
    setCallee(null);
    setIsVideoCall(false);

    if (userVideo.current) {
      userVideo.current.srcObject = null;
      console.log("❎ Cleared userVideo stream");
    }

    if (myVideo.current) {
      myVideo.current.srcObject = null;
      console.log("❎ Cleared myVideo stream");
    }
  };

  useEffect(() => {
    console.log("🧩 Setting up socket listeners for calls");

    socket.on("receive-call", ({ from, signal, isVideoCall: incomingIsVideo }) => {
      console.log("📞 Incoming call from:", from, "Video call:", incomingIsVideo);
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
      setIsVideoCall(incomingIsVideo ?? true);

      ringtone.current?.play().catch(() => {
        console.warn("⚠️ Unable to play ringtone automatically (likely due to autoplay policy).");
      });
    });

    socket.on("call-answered", ({ signal }) => {
      console.log("📲 Receiver accepted call. Signal received.");
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    socket.on("call-ended", () => {
      console.log("📴 Call ended by remote user.");
      setCallEnded(true);
      if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
        console.log("🔌 Peer connection destroyed (remote end)");
      }
      ringtone.current?.pause();
      ringtone.current.currentTime = 0;
      resetCallState();
    });

    return () => {
      console.log("🚫 Cleaning up socket listeners for call");
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
    isVideoCall,
  };
};

export default useCallManager;
