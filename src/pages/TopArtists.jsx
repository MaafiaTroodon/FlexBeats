import React from 'react';
import { ArtistCard, Error, Loader } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading artists..." />;
  if (error) return <Error />;

  // ✅ ShazamCore API might return data directly as an array or under `data.tracks`
  const tracks = Array.isArray(data) ? data : data?.tracks?.hits?.map((hit) => hit.track) || [];

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top Artists</h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {tracks.map((track) => (
          <ArtistCard key={track.key || track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
