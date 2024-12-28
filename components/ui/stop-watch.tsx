'use client';

import { useEffect, useRef, useState } from 'react';

import { secondsToTime } from '@/utils/utils';

import LoaderSvgComponent from '../react-svg-components/loader';

type StopWatchProps = {
  elapsedOnStart?: number;
};

export function StopWatch({ elapsedOnStart = 0 }: StopWatchProps) {
  const [timeElapsedInSeconds, setTimeElapsedInSeconds] = useState<
    number | undefined
  >();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeElapsedInSeconds(elapsedOnStart);
    intervalRef.current = setInterval(() => {
      setTimeElapsedInSeconds(previous =>
        previous === undefined ? elapsedOnStart : previous + 1,
      );
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [elapsedOnStart]);

  return (
    <div className="w-12">
      {timeElapsedInSeconds ? (
        <div> {secondsToTime(timeElapsedInSeconds)}</div>
      ) : (
        <LoaderSvgComponent className="animate-loader-spin" />
      )}
    </div>
  );
}
