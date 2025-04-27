import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { useGetArtistDetailsQuery, useSearchArtistQuery, useSearchSongQuery } from '../redux/services/spotify';

const ArtistDetails = () => {
  const { id: artistName } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: searchArtistData, isFetching: isFetchingArtistSearch } = useSearchArtistQuery(artistName);
  const spotifyArtistId = searchArtistData?.artists?.items?.[0]?.id;

  const { data: artistData, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery(spotifyArtistId, { skip: !spotifyArtistId });
  const { data: relatedSongsData, isFetching: isFetchingRelatedSongs } = useSearchSongQuery(artistName);

  if (isFetchingArtistSearch || isFetchingArtistDetails) return <Loader title="Loading artist details..." />;
  if (error || !artistData?.artists?.[0]) return <Error />;

  const artist = artistData.artists[0];

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={spotifyArtistId}
        artistData={{
          title: artist.name,
          subtitle: artist.genres?.[0] || 'Unknown Genre',
          images: { coverart: artist.images?.[0]?.url },
          genres: { primary: artist.genres?.[0] },
          followers: artist.followers?.total,
          popularity: artist.popularity,
        }}
      />

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Artist Overview:</h2>
        <p className="text-gray-400 text-base my-4">Followers: {artist.followers?.total.toLocaleString()}</p>
        <p className="text-gray-400 text-base my-4">Genres: {artist.genres?.join(', ')}</p>
        <p className="text-gray-400 text-base my-4">Popularity Score: {artist.popularity}/100</p>
      </div>

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Related Songs:</h2>
        <div className="mt-4 flex flex-col">
          {isFetchingRelatedSongs ? (
            <Loader title="Loading related songs..." />
          ) : relatedSongsData?.tracks?.items?.map((song, i) => (
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
