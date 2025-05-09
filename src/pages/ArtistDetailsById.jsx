import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetArtistDetailsQuery, useGetArtistAlbumsQuery, useGetArtistTopTracksQuery } from '../redux/services/spotify';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';

const ArtistDetailsById = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: artist, isFetching: loadingDetails, error: errorDetails } = useGetArtistDetailsQuery(id);
  const { data: albumsData, isFetching: loadingAlbums, error: errorAlbums } = useGetArtistAlbumsQuery(id);
  const { data: topTracksData, isFetching: loadingTracks } = useGetArtistTopTracksQuery(id);

  if (loadingDetails || loadingAlbums || loadingTracks) return <Loader title="Loading artist..." />;
  if (errorDetails || errorAlbums || !artist) return <Error />;

  const handlePauseClick = () => dispatch(playPause(false));
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topTracksData?.tracks, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={id}
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
        <p className="text-gray-400 text-base my-4">Followers: {artist.followers?.total?.toLocaleString()}</p>
        <p className="text-gray-400 text-base my-4">Genres: {artist.genres?.join(', ')}</p>
        <p className="text-gray-400 text-base my-4">Popularity Score: {artist.popularity}/100</p>
      </div>

      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Top Releases:</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          {albumsData?.data?.albums?.items?.slice(0, 10).map((album) => (
            <div key={album.data.uri} className="w-[150px] flex flex-col items-center">
              <img src={album.data.coverArt?.sources?.[0]?.url} alt={album.data.name} className="w-full h-auto rounded-lg mb-2" />
              <p className="text-white text-center text-sm">{album.data.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <RelatedSongs
          data={topTracksData?.tracks || []}
          artistId={id}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
      </div>
    </div>
  );
};

export default ArtistDetailsById;
