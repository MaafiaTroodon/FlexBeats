import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchArtistQuery } from '../redux/services/spotify';

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();
  const { data, isFetching } = useSearchArtistQuery(artist.name);

  const spotifyArtistId = data?.artists?.items?.[0]?.id;

  const handleClick = () => {
    if (!isFetching && spotifyArtistId) {
      navigate(`/artists/${spotifyArtistId}`);
    } else {
      navigate(`/artists/unknown?name=${encodeURIComponent(artist.name)}`);
    }
  };

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      <img
        alt={artist.name}
        src={artist.image}
        className="w-full h-56 rounded-lg object-cover"
      />
      <p className="mt-4 font-semibold text-lg text-white truncate">{artist.name}</p>
    </div>
  );
};

export default ArtistCard;
