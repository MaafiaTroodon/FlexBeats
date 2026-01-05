// src/pages/TopCharts.jsx

import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';
import { useGetTracksBySearchQuery } from '../redux/services/spotify';
import { mapSpotifyTrackToSong } from '../utils/spotifyMapper';

const TopCharts = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();
  const shazamError = error || data?.error;
  const hasShazamSongs = Array.isArray(data?.data) && data.data.length > 0;
  const shouldUseSpotify = !!shazamError || (!isFetching && !hasShazamSongs);
  const { data: spotifyData, isFetching: isFetchingSpotify, error: spotifyError } = useGetTracksBySearchQuery(
    { query: 'top hits', limit: 20 },
    { skip: !shouldUseSpotify }
  );
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  if (isFetching || (shouldUseSpotify && isFetchingSpotify)) return <Loader title="Loading Top Charts..." />;
  if ((shouldUseSpotify && spotifyError) || (!shouldUseSpotify && !Array.isArray(data?.data))) return <Error />;

  // Match AroundYou structure (ShazamCore uses .data[].attributes)
  const parsedSongs = shouldUseSpotify
    ? (spotifyData?.tracks?.items || []).map(mapSpotifyTrackToSong)
    : data.data.map((song) => {
    const attributes = song.attributes || {};
    return {
      title: attributes.name || 'Unknown Title',
      subtitle: attributes.artistName || 'Unknown Artist',
      images: {
        coverart: attributes.artwork?.url
          ?.replace('{w}', '500')
          ?.replace('{h}', '500') ||
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
      },
      key: song.id,
      hub: {
        actions: attributes.previews?.[0]?.url
          ? [{ uri: attributes.previews[0].url }]
          : [],
      },
      artists: [
        {
          adamid: song.relationships?.artists?.data?.[0]?.id || null,
        },
      ],
    };
  });

  if (!parsedSongs.length) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Global Top Charts
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {parsedSongs.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={parsedSongs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCharts;
