import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import {
  useSearchArtistQuery,
  useGetArtistDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetArtistTopTracksQuery,
} from '../redux/services/spotify';

const ArtistDetails = () => {
  const { id } = useParams(); // could be Spotify ID or Shazam artist adamid
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const isSpotifyId = id.length >= 20;
  const fallbackArtistName = activeSong?.subtitle || activeSong?.attributes?.artistName || 'Eminem';

  console.log("🔎 Mounted with ID:", id);
  console.log("🧠 isSpotifyId:", isSpotifyId);
  console.log("🎤 Fallback artist name:", fallbackArtistName);

  // Step 1: Search artist by name if not a Spotify ID
  const {
    data: searchData,
    isFetching: isSearching,
    error: searchError,
  } = useSearchArtistQuery(fallbackArtistName, { skip: isSpotifyId });

  // Step 2: Determine Spotify ID
  const spotifyId = isSpotifyId
  ? id
  : searchData?.data?.uri?.split(':')[2];

console.log("🧠 Extracted Spotify ID:", spotifyId);

  console.log("✅ Spotify Search Result:", searchData?.artists?.items?.[0]);

  // Step 3: Fetch Spotify artist info
  const {
    data: artistData,
    isFetching: isFetchingArtist,
    error: artistError,
  } = useGetArtistDetailsQuery(spotifyId, { skip: !spotifyId });

  const {
    data: albumsData,
    isFetching: isFetchingAlbums,
    error: albumsError,
  } = useGetArtistAlbumsQuery(spotifyId, { skip: !spotifyId });

  const {
    data: topTracksData,
    isFetching: isFetchingTopTracks,
    error: topTracksError,
  } = useGetArtistTopTracksQuery(spotifyId, { skip: !spotifyId });

  useEffect(() => {
    console.log("🔄 artistData:", artistData);
    console.log("💿 albumsData:", albumsData);
    console.log("🎵 topTracksData:", topTracksData);
    console.log("🚨 Errors:", { artistError, albumsError, topTracksError, searchError });
  }, [artistData, albumsData, topTracksData, artistError, albumsError, topTracksError]);

  const isLoading =
    isSearching || isFetchingArtist || isFetchingAlbums || isFetchingTopTracks;
  const hasError =
    !spotifyId || !artistData?.artists?.[0] || artistError || albumsError || topTracksError;

  if (isLoading) return <Loader title="Loading artist details..." />;
  if (hasError) return <Error />;

  const artist = artistData.artists[0];

  const relatedSongs = topTracksData?.tracks?.map((track) => ({
    title: track.name,
    subtitle: track.artists?.[0]?.name,
    images: { coverart: track.album?.images?.[0]?.url },
    hub: { actions: [{ uri: track.external_urls?.spotify }] },
    key: track.id,
  })) || [];

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
          data={relatedSongs}
          artistId={spotifyId}
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
