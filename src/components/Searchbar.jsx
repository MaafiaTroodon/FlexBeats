import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="p-2 text-gray-400 focus-within:text-gray-600 w-full"
    >
      <label htmlFor="search-field" className="sr-only">
        Search all music
      </label>
      <div className="flex flex-row justify-start items-center bg-[#1e1e1e] rounded-md">
        <FiSearch aria-hidden="true" className="w-5 h-5 ml-4" />
        <input
          name="search-field"
          id="search-field"
          type="search"
          placeholder="Search for songs or artists"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none placeholder-gray-500 outline-none text-base text-white p-4"
        />
      </div>
    </form>
  );
};

export default Searchbar;
