import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { genres } from '../assets/constants';
import { selectGenreListId } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

const Discover = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetTopChartsQuery();
  const [visibleCount, setVisibleCount] = useState(20); // Start with 20 songs

  const genreTitle = 'Pop';

  if (isFetching) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover {genreTitle}</h2>

        <select
          onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.data?.slice(0, visibleCount).map((rawSong, i) => {
          const song = {
            key: rawSong.id,
            title: rawSong.attributes?.albumName || 'Unknown',
            subtitle: rawSong.attributes?.artistName || 'Unknown Artist',
            images: {
              coverart: rawSong.attributes?.artwork?.url?.replace('{w}x{h}', '400x400') || '',
            },
            artists: [{ adamid: rawSong.id }],
            url: rawSong.attributes?.previews?.[0]?.url || '', 
          };
          

          return (
            <SongCard
              key={song.key}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data}
              i={i}
            />
          );
        })}
      </div>

      {/* ✅ Show More Button */}
      {visibleCount < data?.data?.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Discover;
