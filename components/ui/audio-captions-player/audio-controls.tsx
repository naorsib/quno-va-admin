'use client';

import {
  Pause,
  Play,
  VibrateOffIcon as VolumeOff,
  Volume2,
} from 'lucide-react';
import {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
const FAKE_FLOW_UNPDATE_INTERVAL_IN_SECONDS = 1.5;
interface AudioControlsProps {
  audioSrc: string;
  shouldFakePlay?: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onError: () => void;
}

interface AudioState {
  isPlaying: boolean;
  isFakePlay: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
}

type AudioAction =
  | { type: 'SET_PLAYING' | 'SET_FAKE_PLAY' | 'SET_MUTED'; payload: boolean }
  | { type: 'SET_CURRENT_TIME' | 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_PLAY' | 'TOGGLE_MUTE' | 'INCREMENT_TIME' };

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
        currentTime: Math.min(
          state.currentTime + FAKE_FLOW_UNPDATE_INTERVAL_IN_SECONDS,
          state.duration,
        ),
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
  isLoading,
  setIsLoading,
  onError,
}: AudioControlsProps): JSX.Element {
  const [state, dispatch] = useReducer(audioReducer, {
    ...initialState,
    isFakePlay: shouldFakePlay,
  });
  const [hasError, setHasError] = useState(false);

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
      setIsLoading(false);
      dispatchSimulatedTimeUpdateEvent(state.currentTime);
    } else {
      updateDuration();
    }
  }, [state.duration, state.currentTime, setIsLoading, updateDuration]);

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

  const handleCanPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!state.isFakePlay && state.isPlaying && audio.paused) {
      if (state.isMuted) {
        toggleMute();
      }

      audio.play().catch(error => {
        onError();
      });
    }
    setIsLoading(false);
    setHasError(false);
    updateDuration();
  }, [
    state.isFakePlay,
    state.isPlaying,
    state.isMuted,
    toggleMute,
    onError,
    setIsLoading,
    updateDuration,
  ]);
  useEffect(() => {
    dispatch({ type: 'SET_FAKE_PLAY', payload: shouldFakePlay });
    const audio = audioRef.current;

    if (!audio) return;
    audio.muted = state.isMuted;

    const updateTime = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', onError);

    // failproof this edge case cause by and intermittent race condition

    if (state.isFakePlay) {
      if (!state.currentTime || state.currentTime < state.duration) {
        intervalRef.current = setInterval(
          updateTimeFake,
          FAKE_FLOW_UNPDATE_INTERVAL_IN_SECONDS * 1000,
        );
      } else {
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    } else {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('durationchange', updateDuration);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (!audio.paused && isLoading) {
        onError();
        audio.load();
      }
    }
    updateDuration();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', onError);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    audioSrc,
    isLoading,
    shouldFakePlay,
    state.isFakePlay,
    state.isPlaying,
    state.currentTime,
    state.duration,
    state.isMuted,
    updateDuration,
    updateTimeFake,
    setIsLoading,
    onError,
    handleCanPlay,
  ]);

  const togglePlayPause = useCallback(() => {
    dispatch({ type: 'SET_FAKE_PLAY', payload: false });

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = state.currentTime;
      if (state.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          onError();
        });
      }
      dispatch({ type: 'TOGGLE_PLAY' });
    }
  }, [state.currentTime, state.isPlaying, onError]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    const newTime = newValue[0];
    dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
  }, []);

  const formattedCurrentTime = useMemo(
    () => formatTime(state.currentTime),
    [state.currentTime],
  );
  const formattedDuration = useMemo(
    () => formatTime(state.duration),
    [state.duration],
  );
  const PlayPauseIcon = useMemo(
    () => (state.isPlaying ? Pause : Play),
    [state.isPlaying],
  );

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
        disabled={isLoading || hasError}
      >
        <PlayPauseIcon fill="currentColor" className="h-4 w-4" />
      </Button>
      <Slider
        value={[state.currentTime]}
        max={state.duration || 100}
        step={0.1}
        onValueChange={handleSliderChange}
        disabled={isLoading || hasError}
      />
      <span className="hidden text-sm">
        {formattedCurrentTime} / {formattedDuration}
      </span>
      <Button
        onClick={toggleMute}
        variant="outline"
        size="icon"
        className="bg-white"
        disabled={isLoading || hasError}
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
