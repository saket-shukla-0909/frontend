import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/authThunks';
import { getAllMessages } from '../../redux/messageSlice'; // ✅ important
import Search from './Search';
import Users from './Users';

const Middle = () => {
  const dispatch = useDispatch();
  const { users, searchResults, isLoading } = useSelector((state) => state.auth);
  const { allMessages } = useSelector((state) => state.messages); // ✅ use allMessages from Redux

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllMessages()); // ✅ fetch all messages for latest message display
  }, [dispatch]);

  const displayedUsers = searchResults.length > 0 ? searchResults : users;

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
          <Users users={displayedUsers || []} allMessages={allMessages || []} />
        )}
      </div>
    </div>
  );
};

export default Middle;
