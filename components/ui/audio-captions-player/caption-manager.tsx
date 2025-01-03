'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  isEditMode?: boolean;
};

export function CaptionManager({ isEditMode = false }: Props): null {
  const [isSimulated, setIsSimulated] = useState(false);
  const lastVisibleElementRef = useRef<HTMLElement | undefined>(undefined);
  const updateVisibleCaptions = useCallback(
    (time: number) => {
      const container = document.querySelector(
        '#caption-container',
      ) as HTMLElement;
      if (!container) return;
      if (time === 0) {
        container.style.top = '50px';
        lastVisibleElementRef.current = undefined;
      }

      const captionElements = container.children;
      let newLastVisibleElement: HTMLElement | undefined;

      // eslint-disable-next-line unicorn/prefer-spread
      for (const captionElement of Array.from(captionElements)) {
        const element = captionElement as HTMLElement;
        const startTime = Number.parseFloat(element.dataset.startTime || '0');

        if (time >= startTime) {
          element.classList.remove('invisible');
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
          newLastVisibleElement = element;
        } else {
          element.classList.add('invisible');
          element.style.transform = 'translateY(100%)';
          element.style.opacity = '0';
        }
      }

      if (
        !isEditMode &&
        newLastVisibleElement &&
        newLastVisibleElement !== lastVisibleElementRef.current
      ) {
        // if new box exceeds container, move the container upper to contain it and eliminate old messages
        const newElementLocation =
          newLastVisibleElement.offsetTop +
          newLastVisibleElement.clientHeight +
          70;
        if (
          newElementLocation + container.offsetTop >
          container.parentElement!.clientHeight
        ) {
          const top = `${-(newElementLocation - container.parentElement!.clientHeight)}px`;
          container.style.top = top;
        }

        lastVisibleElementRef.current = newLastVisibleElement;
      }
    },
    [isEditMode],
  );
  useEffect(() => {
    const handleTimeUpdate = (event: Event) => {
      setIsSimulated(false);
      globalThis.removeEventListener(
        'simulatedtimeupdate',
        handleSimulatedTimeUpdate as EventListener,
      );
      const audio = event.target as HTMLAudioElement;
      updateVisibleCaptions(audio.currentTime);
    };

    const handleSimulatedTimeUpdate = (event: CustomEvent) => {
      updateVisibleCaptions(event.detail.currentTime);
    };

    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    if (!isSimulated) {
      globalThis.addEventListener(
        'simulatedtimeupdate',
        handleSimulatedTimeUpdate as EventListener,
      );
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }

      globalThis.removeEventListener(
        'simulatedtimeupdate',
        handleSimulatedTimeUpdate as EventListener,
      );
    };
  }, [isSimulated, updateVisibleCaptions]);
  // eslint-disable-next-line unicorn/no-null
  return null;
}
