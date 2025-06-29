import { useEffect, useRef, useState } from "react";

const useMedia = () => {
  const [stream, setStream] = useState(null);
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Media error", err));
  }, []);

  return { stream, myVideo };
};

export default useMedia;
