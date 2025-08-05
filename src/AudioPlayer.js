import React, { forwardRef, useEffect, useRef } from 'react';

const AudioPlayer = forwardRef(({ src, playing, volume }, ref) => {
  const internalRef = useRef(null);

  useEffect(() => {
    if (internalRef.current) {
      if (playing) {
        internalRef.current.play();
      } else {
        internalRef.current.pause();
      }
      internalRef.current.volume = volume;
    }
  }, [playing, volume]);

  // Enlazamos el ref externo al elemento audio
  React.useImperativeHandle(ref, () => internalRef.current);

  return <audio ref={internalRef} src={src} preload="auto" />;
});

export default AudioPlayer;
