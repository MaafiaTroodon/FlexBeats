import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const AroundYou = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);

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

  const { data, isFetching, error } = useGetSongsByCountryQuery(country, {
    skip: !country,
  });

  useEffect(() => {
    if (data) {
      console.log('🎵 Fetched songs by country:', data);
    }
    if (error) {
      console.error('⚠️ API error:', error);
    }
  }, [data, error]);

  if (loading || isFetching) return <Loader title="Loading Songs around you..." />;
  if (error || !Array.isArray(data?.data)) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around You <span className="font-black">{country}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data.data.map((song, i) => (
          <SongCard
            key={song.key || `${song.title}-${i}`}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data.data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;
