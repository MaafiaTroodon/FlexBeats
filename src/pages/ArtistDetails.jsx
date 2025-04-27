// src/pages/ArtistDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { useGetArtistDetailsQuery, useSearchSongQuery, useSearchArtistQuery } from '../redux/services/spotify';


const ArtistDetails = () => {
  const { id: artistName } = useParams(); // you pass artist name in URL
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Step 1: First search the artist on Spotify by name
  const { data: searchArtistData, isFetching: isFetchingArtistSearch, error: artistSearchError } = useSearchArtistQuery(artistName);

  const spotifyArtistId = searchArtistData?.artists?.items?.[0]?.id;

  // Step 2: Get artist full details
  const { data: artistData, isFetching: isFetchingArtistDetails, error: artistDetailsError } = useGetArtistDetailsQuery(spotifyArtistId, {
    skip: !spotifyArtistId,
  });

  // Step 3: Get related songs using search
  const { data: relatedSongsData, isFetching: isFetchingRelatedSongs, error: relatedSongsError } = useSearchSongQuery(artistName, {
    skip: !artistName,
  });

  if (isFetchingArtistSearch || isFetchingArtistDetails || isFetchingRelatedSongs) return <Loader title="Loading artist details..." />;

  if (artistSearchError || artistDetailsError || relatedSongsError) return <Error />;

  const artist = artistData?.artists?.[0];

  return (
    <div className="flex flex-col">
      {/* Artist header */}
      <DetailsHeader
        artistId={spotifyArtistId}
        artistData={{
          title: artist?.name,
          subtitle: artist?.genres?.[0] || 'Unknown Genre',
          images: { coverart: artist?.images?.[0]?.url },
          genres: { primary: artist?.genres?.[0] },
          followers: artist?.followers?.total,
          popularity: artist?.popularity,
        }}
      />

      {/* Artist stats */}
      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Artist Overview:</h2>
        <p className="text-gray-400 text-base my-4">Followers: {artist?.followers?.total?.toLocaleString()}</p>
        <p className="text-gray-400 text-base my-4">Genres: {artist?.genres?.join(', ')}</p>
        <p className="text-gray-400 text-base my-4">Popularity Score: {artist?.popularity}/100</p>
      </div>

      {/* Related Songs */}
      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Related Songs:</h2>
        <div className="mt-4 flex flex-col">
          {relatedSongsData?.tracks?.items?.map((song, i) => (
            <RelatedSongs
              key={song.id}
              song={song}
              i={i}
              activeSong={activeSong}
              isPlaying={isPlaying}
              data={relatedSongsData.tracks.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
