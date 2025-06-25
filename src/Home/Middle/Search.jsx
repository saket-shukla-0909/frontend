import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { searchUsers } from "../../redux/authThunks";



const Search = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsers(query));
      }
    }, 300); // debounce input by 300ms

    return () => clearTimeout(delay);
  }, [query, dispatch]);


  return (
    <div className="w-full px-6 py-4">
      <form className="w-full max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-black">
            <IoSearch className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
