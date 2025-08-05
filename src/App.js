import React, { useState, useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import AudioPlayer from './AudioPlayer'; // Suponiendo que está correcto
import VideoControls from './components/VideoControls';
import './index.css';
import './App.css';

function App() {
  const [activeVideo, setActiveVideo] = useState(1);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframe1Ref = useRef(null);
  const iframe2Ref = useRef(null);
  const audioRef = useRef(null);

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  // Init Vimeo players
  useEffect(() => {
    if (iframe1Ref.current && !player1Ref.current) {
      player1Ref.current = new Player(iframe1Ref.current);
      player1Ref.current.setVolume(muted ? 0 : volume);
    }
    if (iframe2Ref.current && !player2Ref.current) {
      player2Ref.current = new Player(iframe2Ref.current);
      player2Ref.current.setVolume(0); // Siempre muteado
    }
  }, [iframe1Ref, iframe2Ref]);

  // Play / Pause sincronizado
  useEffect(() => {
    if (player1Ref.current && player2Ref.current && audioRef.current) {
      if (playing) {
        player1Ref.current.play();
        player2Ref.current.play();
      } else {
        player1Ref.current.pause();
        player2Ref.current.pause();
      }
    }
  }, [playing]);

  // Volumen y mute sincronizados
  useEffect(() => {
    if (player1Ref.current && audioRef.current) {
      const vol = muted ? 0 : volume;
      player1Ref.current.setVolume(vol);
      player2Ref.current.setVolume(0);
      audioRef.current.volume = vol;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Sincronizar videos con audio (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioRef.current || !player1Ref.current || !player2Ref.current) return;

      const audioTime = audioRef.current.currentTime;

      player1Ref.current.getCurrentTime().then((time1) => {
        if (Math.abs(time1 - audioTime) > 0.2) {
          player1Ref.current.setCurrentTime(audioTime);
        }
      });
      player2Ref.current.getCurrentTime().then((time2) => {
        if (Math.abs(time2 - audioTime) > 0.2) {
          player2Ref.current.setCurrentTime(audioTime);
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const handleFirstInteraction = () => {
    if (player1Ref.current && audioRef.current) {
      player1Ref.current.setVolume(muted ? 0 : volume);
      player1Ref.current.play();
      audioRef.current.play();
    }
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };

  window.addEventListener('touchstart', handleFirstInteraction, { once: true });
  window.addEventListener('click', handleFirstInteraction, { once: true });

  return () => {
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };
}, [muted, volume]);

  const handleSwitchVideo = () => {
    setActiveVideo(activeVideo === 1 ? 2 : 1);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const el = document.querySelector('.pantalla-tv');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-6">
      <h1 className="titulo-mandarinas">¡MANDARINAS!</h1>

      <div className="reproductor-container relative">
        <div className="pantalla-tv relative w-full aspect-video">
          <iframe
            ref={iframe1Ref}
            src="https://player.vimeo.com/video/1107167159?autoplay=1&loop=1&muted=1&controls=0"
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              activeVideo === 1 ? 'opacity-100' : 'opacity-0'
            }`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video 1"
          />

          <iframe
            ref={iframe2Ref}
            src="https://player.vimeo.com/video/1107167522?autoplay=1&loop=1&muted=1&controls=0"
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              activeVideo === 2 ? 'opacity-100' : 'opacity-0'
            }`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video 2"
          />

          <VideoControls
            isPlaying={playing}
            onPlayPause={() => setPlaying(!playing)}
            isMuted={muted}
            onMuteToggle={toggleMute}
            onVolumeChange={setVolume}
            volume={volume}
            onFullScreen={toggleFullscreen}
            onSwitchCamera={handleSwitchVideo}
            disableButtons={false}
          />
        </div>
      </div>

      <AudioPlayer
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/audio/Mandarina.mp3`}
        playing={playing}
        volume={muted ? 0 : volume}
      />
    </div>
  );
}

export default App;
