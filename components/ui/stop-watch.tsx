'use client';

import { useEffect, useState } from 'react';

import { secondsToTime } from '@/utils/utils';

type StopWatchProps = {
  elapsedOnStart: number;
};

export function StopWatch({ elapsedOnStart }: StopWatchProps) {
  const [timeElapsedInSeconds, setTimeElapsedInSeconds] =
    useState(elapsedOnStart);

  useEffect(() => {
    const interval = setInterval(
      () => setTimeElapsedInSeconds(timeElapsedInSeconds + 1),
      1000,
    );

    return () => {
      clearInterval(interval);
    };
  }, [timeElapsedInSeconds]);

  return timeElapsedInSeconds === undefined ? (
    <></>
  ) : (
    <div>{secondsToTime(timeElapsedInSeconds)}</div>
  );
}
