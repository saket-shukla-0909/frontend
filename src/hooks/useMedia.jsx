import { useEffect, useRef, useState } from "react";

const useMedia = () => {
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null);

  // 1️⃣ Get user's video/audio stream on mount
  useEffect(() => {
    const getMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
      } catch (err) {
        console.error("❌ Error accessing media devices:", err);
      }
    };

    getMedia();
  }, []);

  // 2️⃣ Assign stream to video ref when both are available
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo]);

  return { stream, myVideo };
};

export default useMedia;
