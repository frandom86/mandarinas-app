import React from 'react';
import { ReactComponent as PlayIcon } from '../assets/icons/reproducir.svg';
import { ReactComponent as PauseIcon } from '../assets/icons/pausar.svg';
import { ReactComponent as VolumeIcon } from '../assets/icons/volumen.svg';
import { ReactComponent as MuteIcon } from '../assets/icons/silenciar-volumen.svg';
import { ReactComponent as ExpandIcon } from '../assets/icons/expandir.svg';
import { ReactComponent as CameraIcon } from '../assets/icons/camara-de-pelicula.svg';

import '../index.css';
import '../App.css';

export default function VideoControls({
  isPlaying,
  onPlayPause,
  isMuted,
  onMuteToggle,
  onVolumeChange,
  volume,
  onFullScreen,
  onSwitchCamera,
  disableButtons
}) {
  return (
    <div className="controles-en-tv">
      <div className="seccion-izquierda">
        <button onClick={onPlayPause} disabled={disableButtons} title={isPlaying ? 'Pausar' : 'Reproducir'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="seccion-centro">
        <button onClick={onSwitchCamera} disabled={disableButtons} title="Cambiar cámara">
          <CameraIcon />
        </button>
      </div>

      <div className="seccion-derecha">
        <button onClick={onMuteToggle} disabled={disableButtons} title={isMuted ? 'Activar sonido' : 'Silenciar'}>
          {isMuted ? <MuteIcon /> : <VolumeIcon />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          disabled={disableButtons}
          className="w-24"
        />

        <button onClick={onFullScreen} title="Pantalla completa">
          <ExpandIcon />
        </button>
      </div>
    </div>
  );
}
