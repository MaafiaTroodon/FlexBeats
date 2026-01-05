import React from 'react';
import { ArtistCard, Loader, Error } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';
import { useGetTracksBySearchQuery } from '../redux/services/spotify';
import { ARTIST_ID_MAP } from '../assets/constants';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();
  const shazamError = error || data?.error;
  const hasShazamSongs = Array.isArray(data?.data) && data.data.length > 0;
  const shouldUseSpotify = !!shazamError || (!isFetching && !hasShazamSongs);
  const { data: spotifyData, isFetching: isFetchingSpotify, error: spotifyError } = useGetTracksBySearchQuery(
    { query: 'top artists', limit: 30 },
    { skip: !shouldUseSpotify }
  );

  if (isFetching || (shouldUseSpotify && isFetchingSpotify)) return <Loader title="Loading Top Artists..." />;
  if ((shouldUseSpotify && spotifyError) || (!shouldUseSpotify && error)) return <Error />;

  const tracks = shouldUseSpotify
    ? (spotifyData?.tracks?.items || []).map((item) => item?.data || item)
    : data?.data || [];

  const uniqueArtists = [];
  const seen = new Set();

  tracks.forEach((track) => {
    const name = shouldUseSpotify
      ? track?.artists?.items?.[0]?.profile?.name
      : track?.attributes?.artistName;

    if (!name || seen.has(name)) return;

    if (!shouldUseSpotify && !ARTIST_ID_MAP[name]) return;

    uniqueArtists.push({
      name,
      image: shouldUseSpotify
        ? track?.albumOfTrack?.coverArt?.sources?.[0]?.url
        : track?.attributes?.artwork?.url?.replace('{w}', '500').replace('{h}', '500'),
    });
    seen.add(name);
  });

  if (!uniqueArtists.length) return <Error />;

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
