import Peer from "simple-peer";
import { useRef, useState, useEffect } from "react";
import socket from "../src/socket/socket";
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

  const callUser = (userId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signalData) => {
      socket.emit("call-user", {
        to: userId,
        signalData: signalData,
        from: socket.id,
      });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    socket.on("call-answered", ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("answer-call", {
        signal,
        to: caller,
      });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    socket.emit("end-call", { to: caller });
  };

  useEffect(() => {
    socket.on("receive-call", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    socket.on("call-ended", () => {
      setCallEnded(true);
      connectionRef.current?.destroy();
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
