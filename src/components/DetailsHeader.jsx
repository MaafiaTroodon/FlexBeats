import React from 'react';
import { Link } from 'react-router-dom';

const DetailsHeader = ({ artistId, artistData, songData }) => {
  const isError = songData?.error;

const defaultImage = 'https://dummyimage.com/400x400/2e2e2e/ffffff&text=No+Image';

const coverArt = isError
  ? defaultImage
  : artistId
  ? artistData?.attributes?.artwork?.url?.replace('{w}', '500').replace('{h}', '500')
  : songData?.images?.coverart || defaultImage;


  const title = isError
    ? 'Unknown Title'
    : artistId
    ? artistData?.attributes?.name
    : songData?.title || 'Unknown Title';

  const subtitle = isError
    ? 'Unknown Artist'
    : songData?.subtitle || 'Unknown Artist';

  const genre = isError
    ? 'Unknown Genre'
    : artistId
    ? artistData?.attributes?.genreNames?.[0]
    : songData?.genres?.primary || 'Unknown Genre';

  return (
    <div className="relative w-full flex flex-col">
      <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />

      <div className="absolute inset-0 flex items-center">
        <img
          alt="profile"
          src={coverArt}
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />

        <div className="ml-5">
          <p className="font-bold sm:text-3xl text-xl text-white">{title}</p>
          {!artistId && <p className="text-base text-gray-400 mt-2">{subtitle}</p>}
          <p className="text-base text-gray-400 mt-2">{genre}</p>
        </div>
      </div>

      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};

export default DetailsHeader;
