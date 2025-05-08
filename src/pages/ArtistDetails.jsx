// src/pages/ArtistDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import {
  useSearchArtistQuery,
  useGetArtistDetailsQuery as useSpotifyArtistDetailsQuery,
  useGetArtistAlbumsQuery,
} from '../redux/services/spotify';
import {
  useSearchShazamArtistQuery,
  useGetTopSongsByAdamIdQuery,
} from '../redux/services/shazamCore';



const ArtistDetails = () => {
  const { id } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const isSpotifyId = id.length >= 20;

  const {
    data: searchData,
    isFetching: isSearching,
    error: searchError,
  } = useSearchArtistQuery(id, { skip: isSpotifyId });

  const spotifyId = isSpotifyId ? id : searchData?.artists?.items?.[0]?.id;

  const {
    data: artistData,
    isFetching: isFetchingArtist,
    error: artistError,
  } = useSpotifyArtistDetailsQuery(spotifyId, { skip: !spotifyId });

  const {
    data: albumsData,
    isFetching: isFetchingAlbums,
    error: albumsError,
  } = useGetArtistAlbumsQuery(spotifyId, { skip: !spotifyId });

  const artistName = isSpotifyId ? artistData?.artists?.[0]?.name : id;

  const {
    data: shazamSearchData,
    isFetching: isFetchingShazamSearch,
    error: shazamSearchError,
  } = useSearchShazamArtistQuery(artistName, { skip: !artistName });

  const adamid = shazamSearchData?.tracks?.hits?.[0]?.artists?.[0]?.adamid;

  const {
    data: topSongsData,
    isFetching: isFetchingTopSongs,
    error: topSongsError,
  } = useGetTopSongsByAdamIdQuery(adamid, { skip: !adamid });

  const isLoading =
    isSearching || isFetchingArtist || isFetchingAlbums || isFetchingShazamSearch || isFetchingTopSongs;
  const hasError =
    !artistData?.artists?.[0] || artistError || albumsError || shazamSearchError || topSongsError;

  if (isLoading) return <Loader title="Loading artist details..." />;
  if (hasError) return <Error />;

  const artist = artistData.artists[0];

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={spotifyId}
        artistData={{
          title: artist.name,
          subtitle: artist.genres?.[0] || 'Unknown Genre',
          images: { coverart: artist?.images?.[0]?.url },
          genres: { primary: artist.genres?.[0] },
          followers: artist.followers?.total?.toLocaleString(),
          popularity: artist.popularity,
        }}
      />

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Top Songs</h2>
        <RelatedSongs
          data={topSongsData?.data || []}
          artistId={id}
          isPlaying={isPlaying}
          activeSong={activeSong}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Albums</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          {albumsData?.data?.albums?.items?.slice(0, 10).map((album) => (
            <div key={album.id} className="w-[150px] flex flex-col items-center">
              <img
                src={album.coverArt?.sources?.[0]?.url}
                alt={album.name}
                className="w-full h-auto rounded-lg mb-2"
              />
              <p className="text-white text-center text-sm">{album.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
