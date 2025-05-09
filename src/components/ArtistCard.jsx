import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ track }) => {
  const navigate = useNavigate();
  const adamid = track?.artists?.[0]?.adamid;
  const image = track?.images?.coverart;

  if (!adamid || !image) return null;

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() => navigate(`/artists/${adamid}`)}
    >
      <img alt="artist" src={image} className="w-full h-56 rounded-lg object-cover" />
      <p className="mt-4 font-semibold text-lg text-white truncate">{track?.subtitle || track?.title}</p>
    </div>
  );
};

export default ArtistCard;
