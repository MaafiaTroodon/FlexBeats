// src/pages/AroundYou.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';
import { useGetTracksBySearchQuery } from '../redux/services/spotify';
import { mapSpotifyTrackToSong } from '../utils/spotifyMapper';

const AroundYou = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Get user's country from IP
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_GEO_API_KEY}`);
        console.log('🌍 Geolocation response:', res.data);
        setCountry(res?.data?.country_code2 || 'US');
      } catch (err) {
        console.error('❌ Error fetching country:', err);
        setCountry('US');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, []);

  // Get songs by country
  const { data, isFetching, error } = useGetSongsByCountryQuery(country, {
    skip: !country,
  });
  const shazamError = error || data?.error;
  const hasShazamSongs = Array.isArray(data?.data) && data.data.length > 0;
  const shouldUseSpotify = !!shazamError || (!isFetching && !hasShazamSongs);
  const { data: spotifyData, isFetching: isFetchingSpotify, error: spotifyError } = useGetTracksBySearchQuery(
    { query: `top hits ${country || 'US'}`, limit: 20 },
    { skip: !shouldUseSpotify }
  );

  useEffect(() => {
    if (data) {
      console.log('🎵 Fetched songs by country:', data);
      console.log('🎧 First song sample:', data?.data?.[0]);
    }
    if (error) {
      console.error('⚠️ API error:', error);
    }
  }, [data, error]);

  // Handle loading or errors
  if (loading || isFetching || (shouldUseSpotify && isFetchingSpotify)) {
    return <Loader title="Loading Songs around you..." />;
  }
  if ((shouldUseSpotify && spotifyError) || (!shouldUseSpotify && !Array.isArray(data?.data))) return <Error />;

  // Map song fields correctly
  // Inside AroundYou.jsx

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
        Around You <span className="font-black">{country}</span>
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

export default AroundYou;
