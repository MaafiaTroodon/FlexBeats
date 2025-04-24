/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

import 'swiper/css';
import 'swiper/css/free-mode';

const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  const title = song?.attributes?.name || song?.title;
  const subtitle = song?.attributes?.artistName || song?.subtitle;
  const image = song?.attributes?.artwork?.url?.replace('{w}', '125').replace('{h}', '125') || song?.images?.coverart;
  const songId = song?.id || song?.key;

  const isActive = activeSong?.id === songId;

  return (
    <div
      className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
        isActive ? 'bg-[#4c426e]' : 'bg-transparent'
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <img className="w-20 h-20 rounded-lg" src={image} alt={title} />
        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${songId}`}>
            <p className="text-xl font-bold text-white truncate">{title}</p>
          </Link>
          <p className="text-base text-gray-300 mt-1 truncate">{subtitle}</p>
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    </div>
  );
};

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetTopChartsQuery();
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const topPlays = data?.data?.slice(0, 5) || [];

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topPlays, i }));
    dispatch(playPause(true));
  };

  return (
    <div ref={divRef} className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col">
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Charts</h2>
          <Link to="/top-charts">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays.map((song, i) => (
            <TopChartCard
              key={song?.id || song?.key || i}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={handlePlayClick}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {topPlays.map((artist, i) => {
            const artistId = artist?.relationships?.artists?.data?.[0]?.id || artist?.artists?.[0]?.adamid;
            const img =
              artist?.attributes?.artwork?.url?.replace('{w}', '250').replace('{h}', '250') ||
              artist?.images?.background;

            if (!artistId || !img) return null;

            return (
              <SwiperSlide
                key={artistId || i}
                style={{ width: '25%', height: 'auto' }}
                className="shadow-lg rounded-full animate-slideright"
              >
                <Link to={`/artists/${artistId}`}>
                  <img src={img} alt="Artist" className="rounded-full w-full object-cover" />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
