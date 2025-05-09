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

  const songs = rawHits
  .map((hit, i) => {
    const track = hit.track || hit;

    const url =
      track.url ||
      track.hub?.actions?.find((a) => a?.uri)?.uri ||
      track.hub?.options?.[0]?.actions?.[0]?.uri ||
      track.hub?.providers?.[0]?.actions?.[0]?.uri ||
      track.attributes?.previews?.[0]?.url ||
      null;

    return {
      key: track.key || `${track.heading?.title}-${i}`,
      title: track.heading?.title || track.title,
      subtitle: track.heading?.subtitle || track.subtitle,
      images: {
        coverart: track.images?.default || track.images?.coverart,
      },
      artists: track.artists || [],
      url,
    };
  })
  .filter(song => song.url?.includes('http') && song.images?.coverart);

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