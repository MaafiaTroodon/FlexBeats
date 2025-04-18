import React from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { BsArrowRepeat, BsFillPauseFill, BsFillPlayFill, BsShuffle } from 'react-icons/bs';

const Controls = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
}) => (
  <div className="flex items-center justify-between w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">

    <BsArrowRepeat
      size={20}
      color={repeat ? 'red' : 'white'}
      onClick={() => setRepeat((prev) => !prev)}
      className="cursor-pointer"
    />
    {currentSongs?.length > 0 && (
      <MdSkipPrevious size={30} color="#FFF" onClick={handlePrevSong} className="cursor-pointer" />
    )}
    {isPlaying ? (
      <BsFillPauseFill size={45} color="#FFF" onClick={handlePlayPause} className="cursor-pointer" />
    ) : (
      <BsFillPlayFill size={45} color="#FFF" onClick={handlePlayPause} className="cursor-pointer" />
    )}
    {currentSongs?.length > 0 && (
      <MdSkipNext size={30} color="#FFF" onClick={handleNextSong} className="cursor-pointer" />
    )}
    <BsShuffle
      size={20}
      color={shuffle ? 'red' : 'white'}
      onClick={() => setShuffle((prev) => !prev)}
      className="cursor-pointer"
    />
  </div>
);

export default Controls;
