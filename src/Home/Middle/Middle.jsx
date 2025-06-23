import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/authThunks';
import Search from './Search';
import Users from './Users';

const Middle = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.auth);
    console.log(users, "this is users in middle");
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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
          <Users users={users || []} />
        )}
      </div>
    </div>
  );
};

export default Middle;
