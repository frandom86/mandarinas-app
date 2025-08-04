import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const AudioPlayer = forwardRef(({ src, playing, volume }, ref) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (playing) {
        audioRef.current.play().catch(err => {
          console.error("Error al reproducir el audio:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
    }
  }, [src]);

  useImperativeHandle(ref, () => ({
    current: audioRef.current
  }));

  return <audio ref={audioRef} />;
});

export default AudioPlayer;
