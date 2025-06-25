import React, { useState, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../redux/messageSlice";
import useConversation from "../../StateManage/useConversation";
import socket from "../../socket/socket";

const Type = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { selectedConversation } = useConversation();
  const { user } = useSelector((state) => state.auth);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false); // prevent repeated "typing" emits

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const result = await dispatch(
        sendMessage({
          receiverId: selectedConversation._id,
          text,
        })
      ).unwrap();

      socket.emit("new message", result.newMessage);
      setText("");
      dispatch(fetchMessages(selectedConversation._id));

      // Stop typing if still active
      if (isTypingRef.current) {
        socket.emit("stop-typing", {
          to: selectedConversation._id,
          from: user._id,
        });
        isTypingRef.current = false;
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      socket.emit("typing", {
        to: selectedConversation._id,
        from: user._id,
      });
      isTypingRef.current = true;
    }

    // Reset stop-typing timeout
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        to: selectedConversation._id,
        from: user._id,
      });
      isTypingRef.current = false;
    }, 2000);
  };

  return (
    <div className="w-full h-[10vh] px-4 py-2 bg-gray-800 flex items-center gap-2 text-center">
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={handleTyping}
        className="input input-bordered w-full rounded-full focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button className="btn btn-circle btn-white" onClick={handleSend}>
        <IoIosSend className="text-xl text-gray-800" />
      </button>
    </div>
  );
};

export default Type;


// import React, { useState } from "react";
// import { IoIosSend } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import { sendMessage, fetchMessages } from "../../redux/messageSlice";
// import useConversation from "../../StateManage/useConversation";
// import socket from "../../socket/socket";

// const Type = () => {
//   const [text, setText] = useState("");
//   const dispatch = useDispatch();
//   const { selectedConversation } = useConversation();
//   const { user } = useSelector((state) => state.auth);

//   const handleSend = async () => {
//     if (!text.trim()) return;

//     try {
//       const result = await dispatch(sendMessage({
//         receiverId: selectedConversation._id,
//         text,
//       })).unwrap(); 

//       socket.emit("new message", result.newMessage); // ✅ Emit via socket
//       setText(""); 
//       dispatch(fetchMessages(selectedConversation._id)); // ✅ Refresh messages
//     } catch (err) {
//       console.error("Send message failed:", err);
//     }
//   };

//   return (
//     <div className="w-full h-[10vh] px-4 py-2 bg-gray-800 flex items-center gap-2 text-center">
//       <input
//         type="text"
//         placeholder="Type your message..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         className="input input-bordered w-full rounded-full focus:outline-none"
//         onKeyDown={(e) => e.key === "Enter" && handleSend()}
//       />

//       <button className="btn btn-circle btn-white" onClick={handleSend}>
//         <IoIosSend className="text-xl text-gray-800" />
//       </button>
//     </div>
//   );
// };

// export default Type;
