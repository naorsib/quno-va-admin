/* eslint-disable unicorn/prevent-abbreviations */
'use client';

import { Label } from '@radix-ui/react-label';
import { useTranslations } from 'next-intl';
import { JSX, useCallback, useRef, useState } from 'react';

import DialSvgComponent from '@/components/react-svg-components/dial';
import RadioWavesSvgComponent from '@/components/react-svg-components/radio-waves';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { captionsMap } from '@/consts/demo-captions/captions';
import { cn } from '@/lib/utils';
import { EnumsTrans } from '@/types/translations';

import { AudioControls } from '../audio-controls';
import EditCaptionsList from './edit-captions-list';

const MAX_RETRY_ATTEMPTS = 3;
export type AudioBarButton = keyof typeof captionsMap;

const allButtons: AudioBarButton[] = Object.keys(
  captionsMap,
) as AudioBarButton[];

export default function EditAudioBar(): JSX.Element {
  const [selectedAudioButton, setSelectedAudioButton] = useState<
    AudioBarButton | undefined
  >(allButtons[0]);
  const [audioSrc, setAudioSrc] = useState<string>(
    selectedAudioButton
      ? captionsMap[selectedAudioButton as AudioBarButton].audioSrc
      : '',
  );
  const [selectedAudioSrc, setSelectedAudioSrc] = useState<string>(
    selectedAudioButton
      ? captionsMap[selectedAudioButton as AudioBarButton].audioSrc
      : '',
  );
  //simulate
  const [isApplying, setIsApplying] = useState(false);
  const [isFatalError, setIsFatalError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [retryAttempts, setRetryAttempts] = useState(0); // Added retryAttempts state
  const audioSrcInputRef = useRef<HTMLInputElement>(null);

  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');

  const handleButtonClick = useCallback((button?: AudioBarButton) => {
    setSelectedAudioButton(button);

    if (button) {
      setSelectedAudioSrc(captionsMap[button].audioSrc);
      setAudioSrc(captionsMap[button].audioSrc);
      setIsLoading(true);
      setError(undefined);
      setRetryAttempts(0);
    } else {
      setTimeout(() => {
        audioSrcInputRef.current?.focus();
      });
    }

    // Reset retry attempts when button is clicked
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsApplying(true);

    setTimeout(() => {
      setIsApplying(false);
      setSelectedAudioSrc(audioSrc);
    }, 500);
  };

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
        <div className="mb-4 flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-row items-center gap-4"
          >
            <Label className="text-white" htmlFor="audio_src">
              Audio src:
            </Label>
            <Input
              id="audio_src"
              value={audioSrc}
              onChange={e => setAudioSrc(e.target.value)}
              required
              disabled={!!selectedAudioButton || isApplying}
              className="flex-1"
              ref={audioSrcInputRef}
            />

            <Button
              variant="secondary"
              className={cn(
                'text-white',
                selectedAudioButton ? 'pointer-events-none invisible' : '',
              )}
              type="submit"
              disabled={isApplying}
            >
              Apply
            </Button>
          </form>
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
          <Button
            onClick={() => handleButtonClick()}
            className={cn(
              'border px-4 py-2',
              selectedAudioButton
                ? 'border-black bg-audioControl text-black hover:bg-audioControl/90'
                : 'pointer-events-none relative flex flex-row overflow-hidden border-audioControl bg-transparent text-audioControl',
            )}
            disabled={isLoading}
          >
            <P className="relative text-base/6 font-normal">
              Your own audio
              {!selectedAudioButton && (
                <RadioWavesSvgComponent className="absolute -bottom-3 left-0" />
              )}
            </P>
          </Button>
        </div>
      </div>
      <div className="border-input-border flex h-14 w-full flex-row items-center justify-between gap-2 rounded-tl-xl rounded-tr-xl border bg-white px-6">
        <div className="flex flex-row items-center gap-2 overflow-x-hidden">
          <DialSvgComponent />
          <P fontFamily="poppins" className="truncate text-xl font-semibold">
            {selectedAudioButton
              ? tCallEventTypeEnumTrans(selectedAudioButton)
              : 'Your own audio'}
          </P>
        </div>
        <AudioControls
          audioSrc={selectedAudioSrc}
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

      <EditCaptionsList
        initial_captions={
          selectedAudioButton ? captionsMap[selectedAudioButton].captions : []
        }
      />
    </>
  );
}
