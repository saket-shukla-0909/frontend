import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div className="w-full px-6 py-4">
      <form className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full"
            onChange={(e) => console.log(e.target.value)} // Handle input change
          />

          {/* Search Button */}
          <button
            type="submit"
            className="btn btn-black flex items-center justify-center"
          >
            <IoSearch className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
