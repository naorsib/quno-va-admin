'use client';

import { useEffect, useRef } from 'react';

export function CaptionManager() {
  const lastVisibleElementRef = useRef<HTMLElement | undefined>(undefined);

  useEffect(() => {
    const updateVisibleCaptions = (time: number) => {
      const container = document.querySelector('#caption-container');
      if (container) {
        const captionElements = container.children;
        let newLastVisibleElement: HTMLElement | undefined;

        // eslint-disable-next-line unicorn/prefer-spread
        for (const captionElement of Array.from(captionElements)) {
          const element = captionElement as HTMLElement;
          const startTime = Number.parseFloat(element.dataset.startTime || '0');
          const endTime = Number.parseFloat(element.dataset.endTime || '0');

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
          newLastVisibleElement &&
          newLastVisibleElement !== lastVisibleElementRef.current
        ) {
          newLastVisibleElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
          lastVisibleElementRef.current = newLastVisibleElement;
        }
      }
    };

    const handleTimeUpdate = (event: Event) => {
      const audio = event.target as HTMLAudioElement;
      updateVisibleCaptions(audio.currentTime);
    };

    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  return <></>;
}
