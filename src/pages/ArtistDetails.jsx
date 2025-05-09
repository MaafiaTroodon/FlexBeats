import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import {
  useSearchArtistQuery,
  useGetArtistDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetArtistTopTracksQuery,
} from '../redux/services/spotify';
import { setActiveSong, playPause } from '../redux/features/playerSlice';

const ArtistDetails = () => {
  const dispatch = useDispatch();
  const { id: rawArtistParam } = useParams(); // URI-encoded
  const decodedArtistName = decodeURIComponent(rawArtistParam).split(',')[0]?.trim(); // Clean name

  // Normalize spacing and casing before searching
  const searchQuery = decodedArtistName.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
  

  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: searchArtistData, isFetching: isFetchingArtistSearch, error: artistSearchError } =
  useSearchArtistQuery(searchQuery); // ← use cleaned name!

  const spotifyArtistId = searchArtistData?.artists?.items?.[0]?.id;

  const { data: artistData, isFetching: isFetchingArtistDetails, error: artistDetailsError } =
    useGetArtistDetailsQuery(spotifyArtistId, { skip: !spotifyArtistId });

  const { data: albumsData, isFetching: isFetchingAlbums, error: albumsError } =
    useGetArtistAlbumsQuery(spotifyArtistId, { skip: !spotifyArtistId });

  const { data: topTracksData, isFetching: isFetchingTopTracks } =
    useGetArtistTopTracksQuery(spotifyArtistId, { skip: !spotifyArtistId });

  if (
    isFetchingArtistSearch ||
    isFetchingArtistDetails ||
    isFetchingAlbums ||
    isFetchingTopTracks
  ) return <Loader title="Loading artist details..." />;

  if (artistSearchError || artistDetailsError || albumsError) return <Error />;

  const artist = artistData;

  if (!artist && searchArtistData?.artists?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center text-white mt-20">
        <h2 className="text-2xl font-bold">Couldn't find this artist on Spotify</h2>
        <p className="text-gray-400 mt-4">Search term: "{searchQuery}"</p>
      </div>
    );
  }
  

  const handlePauseClick = () => dispatch(playPause(false));
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topTracksData?.tracks, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
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

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Artist Overview:</h2>
        <p className="text-gray-400 text-base my-4">Followers: {artist?.followers?.total?.toLocaleString()}</p>
        <p className="text-gray-400 text-base my-4">Genres: {artist?.genres?.join(', ')}</p>
        <p className="text-gray-400 text-base my-4">Popularity Score: {artist?.popularity}/100</p>
      </div>

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Top Releases:</h2>
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

      <div className="mt-10">
        <RelatedSongs
          data={topTracksData?.tracks || []}
          artistId={spotifyArtistId}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
      </div>
    </div>
  );
};

export default ArtistDetails;
