import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/authThunks';
import { getAllMessages } from '../../redux/messageSlice';
import Search from './Search';
import Users from './Users';

const Middle = () => {
  const dispatch = useDispatch();
  const { users, searchResults, isLoading, user: loggedInUser } = useSelector((state) => state.auth);
  const { allMessages } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllMessages());
  }, [dispatch]);

  const getLatestMessageTime = (userId) => {
    const filtered = allMessages.filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recieverId === userId) ||
        (msg.senderId === userId && msg.recieverId === loggedInUser._id)
    );

    if (filtered.length === 0) return null;
    const latest = filtered.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
    return new Date(latest.createdAt).getTime();
  };

  const displayedUsers = (searchResults.length > 0 ? searchResults : users)
    .filter((user) => user._id !== loggedInUser._id) // exclude self
    .sort((a, b) => {
      const timeA = getLatestMessageTime(a._id);
      const timeB = getLatestMessageTime(b._id);

      if (timeA && timeB) return timeB - timeA;
      if (timeA) return -1; // a has messages, b doesn't
      if (timeB) return 1;  // b has messages, a doesn't
      return 0;
    });

  return (
    <div className="w-full md:w-[25%] bg-gray-900 text-white h-screen flex flex-col">
      <div className="px-6 py-4 border-blue-300">
        <h1 className="text-2xl font-semibold">Chats</h1>
      </div>

      <Search />
      <hr />

      <div className="custom-scroll" style={{ maxHeight: 'calc(80vh)', overflowY: 'auto' }}>
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <Users users={displayedUsers} allMessages={allMessages || []} />
        )}
      </div>
    </div>
  );
};

export default Middle;
