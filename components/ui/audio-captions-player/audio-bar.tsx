'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import AudioCaptionPlayer from '@/components/ui/audio-captions-player/audio-caption-player';
import { captionsMap } from '@/consts/captions.consts';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

import DialSvgComponent from '../../react-svg-components/dial';
import RadioWavesSvgComponent from '../../react-svg-components/radio-waves';
import { H4, P } from '../../typography/text';
import { Button } from '../button';

type AudioDemoTrans = GenericTrans<keyof typeof en.Landing.heros.audioDemo>;
export type AudioBarButton = keyof typeof captionsMap;

const allButtons: AudioBarButton[] = Object.keys(
  captionsMap,
) as AudioBarButton[];

export default function AudioBar() {
  const [selectedAudioButton, setSelectedAudioButton] = useState(allButtons[0]);
  const t: AudioDemoTrans = useTranslations(`Landing.heros.audioDemo`);

  return (
    <>
      <div className="my-4 lg:my-6">
        <div className="mb-2 flex flex-row items-center gap-2 text-white">
          <DialSvgComponent />
          <H4 className="text-lg">{t('quincyHelpsWith')}</H4>
        </div>
        <div className="flex flex-row gap-2.5">
          {allButtons.map(b => (
            <Button
              key={b}
              onClick={() => setSelectedAudioButton(b)}
              className={cn(
                'border px-4 py-2',
                selectedAudioButton == b
                  ? 'pointer-events-none relative flex flex-row overflow-hidden border-audioControl bg-transparent text-audioControl'
                  : 'border-black bg-audioControl text-black hover:bg-audioControl/90',
              )}
            >
              <P className="text-base/6 font-normal">{t(b)}</P>
              {selectedAudioButton == b && (
                // If at some point we want to animate, this would be the way to go
                // <div className="animate-wave-forms absolute bottom-0">
                //   <RadioWavesSvgComponent />
                //   <RadioWavesSvgComponent />
                // </div>
                <RadioWavesSvgComponent className="absolute bottom-0 left-0" />
              )}
            </Button>
          ))}
        </div>
      </div>
      <AudioCaptionPlayer selectedAudioButton={selectedAudioButton} />
    </>
  );
}
