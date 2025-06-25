import React from 'react';
import useConversation from '../../StateManage/useConversation';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Users = ({ users, allMessages }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const getLatestMessage = (otherUserId) => {
    const filtered = allMessages.filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recieverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.recieverId === loggedInUser._id)
    );

    if (filtered.length === 0) return null;

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
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
            <div className="flex items-center gap-4">
              <div className={`avatar ${user.status === 1 ? 'avatar-online text-green' : 'avatar-offline'}`}>
                <div className="w-12 rounded-full">
                  <img
                    src={
                      user.profile_picture
                        ? `${process.env.REACT_APP_BASE_URL}/${user.profile_picture.replace(/\\/g, "/")}`
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

            <div className="text-right">
              <p className="text-sm text-gray-300">
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
