'use client';

import {
  Pause,
  Play,
  VibrateOffIcon as VolumeOff,
  Volume2,
} from 'lucide-react';
import { JSX, useCallback, useEffect, useReducer, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioControlsProps {
  audioSrc: string;
  shouldFakePlay?: boolean;
}

interface AudioState {
  isPlaying: boolean;
  isFakePlay: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
}

type AudioAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_FAKE_PLAY'; payload: boolean }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'INCREMENT_TIME' };

const initialState: AudioState = {
  isPlaying: true,
  isFakePlay: true,
  isMuted: true,
  currentTime: 0,
  duration: 0,
};

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'SET_PLAYING': {
      return { ...state, isPlaying: action.payload };
    }
    case 'SET_FAKE_PLAY': {
      return { ...state, isFakePlay: action.payload };
    }
    case 'SET_MUTED': {
      return { ...state, isMuted: action.payload };
    }
    case 'SET_CURRENT_TIME': {
      return { ...state, currentTime: action.payload };
    }
    case 'SET_DURATION': {
      return { ...state, duration: action.payload };
    }
    case 'TOGGLE_PLAY': {
      return { ...state, isPlaying: !state.isPlaying };
    }
    case 'TOGGLE_MUTE': {
      return { ...state, isMuted: !state.isMuted };
    }
    case 'INCREMENT_TIME': {
      return {
        ...state,
        currentTime: Math.min(state.currentTime + 1, state.duration),
      };
    }
    default: {
      return state;
    }
  }
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const dispatchSimulatedTimeUpdateEvent = (time: number): void => {
  const event = new CustomEvent('simulatedtimeupdate', {
    detail: { currentTime: time },
  });
  globalThis.dispatchEvent(event);
};

export function AudioControls({
  audioSrc,
  shouldFakePlay = true,
}: AudioControlsProps): JSX.Element {
  const [state, dispatch] = useReducer(audioReducer, {
    ...initialState,
    isFakePlay: shouldFakePlay,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const updateDuration = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!Number.isNaN(audio.duration)) {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    }
  }, []);

  const updateTimeFake = useCallback(() => {
    dispatch({ type: 'INCREMENT_TIME' });
    if (state.duration) {
      dispatchSimulatedTimeUpdateEvent(state.currentTime);
    } else {
      updateDuration();
    }
  }, [state.duration, state.currentTime, updateDuration]);

  useEffect(() => {
    dispatch({ type: 'SET_FAKE_PLAY', payload: shouldFakePlay });
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    if (state.isFakePlay) {
      if (!state.currentTime || state.currentTime < state.duration) {
        intervalRef.current = setInterval(updateTimeFake, 1000);
      } else {
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    } else {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('durationchange', updateDuration);

      if (state.isPlaying && audio.paused) {
        audio.play();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    updateDuration();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    audioSrc,
    state.currentTime,
    state.duration,
    state.isPlaying,
    state.isFakePlay,
    shouldFakePlay,
    updateDuration,
    updateTimeFake,
  ]);

  const togglePlayPause = useCallback(() => {
    dispatch({ type: 'SET_FAKE_PLAY', payload: false });

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = state.currentTime;
      if (state.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      dispatch({ type: 'TOGGLE_PLAY' });
    }
  }, [state.currentTime, state.isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (state.isFakePlay) {
        audio.currentTime = state.currentTime;
        dispatch({ type: 'SET_FAKE_PLAY', payload: false });
      }

      audio.muted = !state.isMuted;
      dispatch({ type: 'TOGGLE_MUTE' });
    }
  }, [state.isFakePlay, state.currentTime, state.isMuted]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    const newTime = newValue[0];
    dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
  }, []);

  return (
    <div className="flex flex-1 items-center space-x-2">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        muted={state.isMuted}
      />
      <Button
        onClick={togglePlayPause}
        variant="outline"
        size="icon"
        className="bg-white"
      >
        {state.isPlaying ? (
          <Pause fill="currentColor" className="h-4 w-4" />
        ) : (
          <Play fill="currentColor" className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[state.currentTime]}
        max={state.duration || 100}
        step={0.1}
        onValueChange={handleSliderChange}
      />
      <span className="hidden text-sm">
        {formatTime(state.currentTime)} / {formatTime(state.duration)}
      </span>
      <Button
        onClick={toggleMute}
        variant="outline"
        size="icon"
        className="bg-white"
      >
        {state.isMuted ? (
          <VolumeOff fill="currentColor" className="h-4 w-4" />
        ) : (
          <Volume2 fill="currentColor" className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
