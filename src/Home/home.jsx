import { useSelector } from "react-redux";
import { useEffect } from "react";
import Left from "./Left/Left";
import Middle from "./Middle/Middle";
import Right from "./Right/Right";
import socket from "../socket/socket";
import CallScreen from "../features/call/callScreen";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      socket.emit("setup", user);
      console.log("🟢 Socket setup emitted with user:", user);
    }

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("setup");
    };
  }, [user]);

  return (
    <div className="flex h-screen">
      <Left />
      <Middle />
      <Right />
      <CallScreen/>
    </div>
  );
};

export default Home;

