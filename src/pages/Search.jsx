import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSongsBySearchQuery } from '../redux/services/shazamCore';
import { Loader, Error, SongCard } from '../components';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);

  console.log('🟡 Raw Shazam data:', data);

  const rawHits = data?.data?.tracks?.hits || [];

  const songs = rawHits.map((hit, i) => ({
    key: hit.key || `${hit.heading?.title}-${i}`,
    title: hit.heading?.title,
    subtitle: hit.heading?.subtitle,
    images: {
      coverart: hit.images?.default,
    },
    artists: hit.artists,
    url: hit.url,
  }));

  console.log('🟢 Songs parsed:', songs);

  if (isFetching) return <Loader title={`Searching "${searchTerm}"...`} />;
  if (error || !songs.length) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;