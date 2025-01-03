/* eslint-disable unicorn/prevent-abbreviations */
'use client';

import { useTranslations } from 'next-intl';
import { JSX, useCallback, useState } from 'react';

import DialSvgComponent from '@/components/react-svg-components/dial';
import RadioWavesSvgComponent from '@/components/react-svg-components/radio-waves';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { captionsMap } from '@/consts/demo-captions/captions';
import { cn } from '@/lib/utils';
import { EnumsTrans } from '@/types/translations';

import { AudioControls } from '../audio-controls';
import EditCaptionsComponent from './edit-captions';

const MAX_RETRY_ATTEMPTS = 3;
export type AudioBarButton = keyof typeof captionsMap;

const allButtons: AudioBarButton[] = Object.keys(
  captionsMap,
) as AudioBarButton[];

export default function EditAudioBar(): JSX.Element {
  const [selectedAudioButton, setSelectedAudioButton] =
    useState<AudioBarButton>(allButtons[0]);
  const [isFatalError, setIsFatalError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [retryAttempts, setRetryAttempts] = useState(0); // Added retryAttempts state

  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');

  const handleButtonClick = useCallback((button: AudioBarButton) => {
    setSelectedAudioButton(button);
    setIsLoading(true);
    setError(undefined);
    setRetryAttempts(0); // Reset retry attempts when button is clicked
  }, []);

  const handleError = useCallback(() => {
    if (retryAttempts < MAX_RETRY_ATTEMPTS) {
      if (!isLoading) {
        setIsLoading(true);
      }
      setRetryAttempts(previous => previous - 1);
      setError(
        new Error(
          `Error loading audio. Retrying... (Attempt ${retryAttempts}/${MAX_RETRY_ATTEMPTS})`,
        ),
      );
      setTimeout(() => {
        setError(undefined);
      }, 2000);
    } else {
      setIsFatalError(true);
      setError(
        new Error(
          `Error loading audio after ${MAX_RETRY_ATTEMPTS} attempts. Please reload the page`,
        ),
      );
    }
  }, [retryAttempts, isLoading]);

  return (
    <>
      <div
        className={cn(
          'my-4 lg:my-6',
          isFatalError ? 'pointer-events-none opacity-50' : '',
        )}
      >
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
              disabled={isLoading}
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
          isLoading={isLoading}
          shouldFakePlay={false}
          setIsLoading={setIsLoading}
          onError={handleError}
        />
      </div>
      {error && (
        <div className="mt-2 text-center text-red-500">
          <P>{error.message}</P>
        </div>
      )}
      <EditCaptionsComponent selected_audio_button={selectedAudioButton} />
    </>
  );
}