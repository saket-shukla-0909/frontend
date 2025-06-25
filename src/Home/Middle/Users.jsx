import React from 'react';
import useConversation from '../../StateManage/useConversation';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Users = ({ users }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { messages } = useSelector((state) => state.messages);
  const { user: loggedInUser } = useSelector((state) => state.auth);

  // Get latest message between current user and another
  const getLatestMessage = (otherUserId) => {
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recieverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.recieverId === loggedInUser._id)
    );

    return filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  };

  return (
    <>
      {users.map((user) => {
        if (user._id === loggedInUser._id) return null;

        const isSelected = selectedConversation?._id === user._id;
        const latestMessage = getLatestMessage(user._id);

        return (
          <div
            key={user._id}
            onClick={() => setSelectedConversation(user)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
              isSelected ? 'bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            {/* Avatar and name */}
            <div className="flex items-center gap-4">
              <div className={`avatar ${user.status === 1 ? 'avatar-online' : 'avatar-offline'}`}>
                <div className="w-12 rounded-full">
                  <img
                    src={
                      user.profile_picture
                        ? `${process.env.REACT_APP_BASE_URL}/${user.profile_picture.replace(/\\/g, '/')}`
                        : 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'
                    }
                    alt="User Avatar"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-base font-medium text-white">{user.full_name}</h2>
                <p className="text-sm text-gray-300 truncate max-w-[150px]">
                  {latestMessage ? latestMessage.message : 'No messages yet.'}
                </p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {latestMessage ? moment(latestMessage.createdAt).format('hh:mm A') : ''}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Users;

// import React from 'react';
// import useConversation from '../../StateManage/useConversation';
// import { useSelector } from 'react-redux';
// import moment from 'moment';

// const Users = ({ users }) => {
//   const { selectedConversation, setSelectedConversation } = useConversation();
//   const { messages } = useSelector((state) => state.messages);
//   const { user: loggedInUser } = useSelector((state) => state.auth);

//   // 🔍 Get latest message between logged-in user and each other user
//   const getLatestMessage = (otherUserId) => {
//     const filtered = messages.filter(
//       (msg) =>
//         (msg.senderId === loggedInUser._id && msg.recieverId === otherUserId) ||
//         (msg.senderId === otherUserId && msg.recieverId === loggedInUser._id)
//     );

//     return filtered.length > 0
//       ? filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
//       : null;
//   };

//   return (
//     <>
//       {users.map((user) => {
//         if (user._id === loggedInUser._id) return null; // skip self

//         const isSelected = selectedConversation?._id === user._id;
//         const latestMessage = getLatestMessage(user._id);

//         return (
//           <div
//             key={user._id}
//             onClick={() => setSelectedConversation(user)}
//             className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
//               isSelected ? 'bg-gray-800' : 'hover:bg-gray-700'
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`avatar ${user.status === 1 ? 'avatar-online text-green' : 'avatar-offline'}`}>
//                 <div className="w-12 rounded-full">
//                   <img
//                     src={
//                       user.profile_picture
//                         ? `${process.env.REACT_APP_BASE_URL}/${user.profile_picture.replace(/\\/g, "/")}`
//                         : 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'
//                     }
//                     alt="User Avatar"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <h2 className="text-base font-medium text-white">{user.full_name}</h2>
//                 <p className="text-sm text-gray-300 truncate max-w-[150px]">
//                   {latestMessage ? latestMessage.message : 'No messages yet.'}
//                 </p>
//               </div>
//             </div>

//             <div className="text-right">
//               <p className="text-sm text-gray-300">
//                 {latestMessage ? moment(latestMessage.createdAt).format("hh:mm A") : ""}
//               </p>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export default Users;
