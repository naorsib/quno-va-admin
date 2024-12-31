'use client';

import { useTranslations } from 'next-intl';
import { JSX, useCallback, useEffect, useState } from 'react';

import DialSvgComponent from '@/components/react-svg-components/dial';
import RadioWavesSvgComponent from '@/components/react-svg-components/radio-waves';
import { H4, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { captionsMap } from '@/consts/demo-captions/captions';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { EnumsTrans, GenericTrans } from '@/types/translations';

import AudioCaptionPlayer, { Caption } from './audio-caption-player';
import { AudioControls } from './audio-controls';

type AudioDemoTrans = GenericTrans<keyof typeof en.Landing.heros.audioDemo>;
export type AudioBarButton = keyof typeof captionsMap;

const allButtons: AudioBarButton[] = Object.keys(
  captionsMap,
) as AudioBarButton[];

export default function AudioBar(): JSX.Element {
  const [selectedAudioButton, setSelectedAudioButton] =
    useState<AudioBarButton>(allButtons[0]);
  const [shouldTriggerAudioWithFakePlay, setShouldTriggerAudioWithFakePlay] =
    useState(true);

  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');
  const t: AudioDemoTrans = useTranslations(`Landing.heros.audioDemo`);

  const handleFirstAudioSignal = useCallback(() => {
    setShouldTriggerAudioWithFakePlay(false);
  }, []);

  useEffect(() => {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement && shouldTriggerAudioWithFakePlay) {
      audioElement.addEventListener('timeupdate', handleFirstAudioSignal);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleFirstAudioSignal);
      }
    };
  }, [
    selectedAudioButton,
    shouldTriggerAudioWithFakePlay,
    handleFirstAudioSignal,
  ]);

  const handleButtonClick = useCallback((button: AudioBarButton) => {
    setShouldTriggerAudioWithFakePlay(false);
    setSelectedAudioButton(button);
  }, []);

  return (
    <>
      <div className="my-4 lg:my-6">
        <div className="mb-2 flex flex-row items-center gap-2 text-white">
          <DialSvgComponent />
          <H4 className="text-lg">{t('quincyHelpsWith')}</H4>
        </div>
        <div className="flex flex-row flex-wrap gap-2.5">
          {allButtons.map(button => (
            <Button
              key={button}
              onClick={() => handleButtonClick(button)}
              className={cn(
                'border px-4 py-2',
                selectedAudioButton === button
                  ? 'pointer-events-none relative flex flex-row overflow-hidden border-audioControl bg-transparent text-audioControl'
                  : 'border-black bg-audioControl text-black hover:bg-audioControl/90',
              )}
            >
              <P className="relative text-base/6 font-normal">
                {tCallEventTypeEnumTrans(button)}
                {selectedAudioButton === button && (
                  <RadioWavesSvgComponent className="absolute -bottom-3 left-0" />
                )}
              </P>
            </Button>
          ))}
        </div>
      </div>
      <div className="border-input-border flex h-14 w-full flex-row items-center justify-between gap-2 rounded-tl-xl rounded-tr-xl border bg-white px-6">
        <div className="flex flex-row items-center gap-2 overflow-x-hidden">
          <DialSvgComponent />
          <P fontFamily="poppins" className="truncate text-xl font-semibold">
            {tCallEventTypeEnumTrans(selectedAudioButton)}
          </P>
        </div>
        <AudioControls
          audioSrc={captionsMap[selectedAudioButton].audioSrc}
          shouldFakePlay={shouldTriggerAudioWithFakePlay}
        />
      </div>
      <AudioCaptionPlayer
        captions={captionsMap[selectedAudioButton].captions as Caption[]}
      />
    </>
  );
}
