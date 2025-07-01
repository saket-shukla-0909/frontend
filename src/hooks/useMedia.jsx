import { useEffect, useRef, useState } from "react";

const useMedia = () => {
  const [stream, setStream] = useState(null);
  const myVideo = useRef();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
        console.log("✅ Media stream acquired");
      } catch (error) {
        console.error("❌ Error accessing media devices:", error);
      }
    };

    getMedia();
  }, []);

  return { stream, myVideo };
};

export default useMedia;
