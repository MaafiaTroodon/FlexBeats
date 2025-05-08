import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { useGetArtistDetailsQuery, useSearchArtistQuery, useGetArtistAlbumsQuery } from '../redux/services/spotify';

const ArtistDetails = () => {
  const { id: artistName } = useParams(); // you pass artist name in URL
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Step 1: Search artist
  const { data: searchArtistData, isFetching: isFetchingArtistSearch, error: artistSearchError } = useSearchArtistQuery(artistName);
  const spotifyArtistId = searchArtistData?.data?.artists?.items?.[0]?.id;


  // Step 2: Get full artist details
  const { data: artistData, isFetching: isFetchingArtistDetails, error: artistDetailsError } = useGetArtistDetailsQuery(spotifyArtistId, { skip: !spotifyArtistId });

  // Step 3: Get artist albums/singles/eps
  const { data: albumsData, isFetching: isFetchingAlbums, error: albumsError } = useGetArtistAlbumsQuery(spotifyArtistId, { skip: !spotifyArtistId });

  if (isFetchingArtistSearch || isFetchingArtistDetails || isFetchingAlbums) return <Loader title="Loading artist details..." />;
  if (artistSearchError || artistDetailsError || albumsError) return <Error />;

const artist = artistData?.artists?.[0]; // ✅ correct



  return (
    <div className="flex flex-col">
      {/* Artist Header */}
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

      {/* Artist Stats */}
      <div className="mt-10">
        <h2 className="text-white text-3xl font-bold">Artist Overview:</h2>
        <p className="text-gray-400 text-base my-4">Followers: {artist?.followers?.total?.toLocaleString()}</p>
        <p className="text-gray-400 text-base my-4">Genres: {artist?.genres?.join(', ')}</p>
        <p className="text-gray-400 text-base my-4">Popularity Score: {artist?.popularity}/100</p>
      </div>

      {/* Artist Albums */}
      {/* Artist Albums */}
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

    </div>
  );
};

export default ArtistDetails;
