import React from 'react';
import { ArtistCard, Loader, Error } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading Top Artists..." />;
  if (error) return <Error />;

  // ✅ Extract artist names for Spotify search
  const tracks = data?.data || [];

  const uniqueArtists = [];
  const seen = new Set();

  tracks.forEach((track) => {
    const name = track?.attributes?.artistName;
    if (name && !seen.has(name)) {
      uniqueArtists.push({
        name,
        image: track?.attributes?.artwork?.url?.replace('{w}', '500').replace('{h}', '500'),
      });
      seen.add(name);
    }
  });

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top Artists</h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {uniqueArtists.map((artist, i) => (
          <ArtistCard key={`${artist.name}-${i}`} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
