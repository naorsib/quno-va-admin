import { PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { P } from '@/components/typography/text';
import { captionsMap } from '@/consts/captions.consts';
import en from '@/messages/en.json';
import { CallEventsTrans, GenericTrans } from '@/types/translations';

import CalendarSvgComponent from '../../react-svg-components/calendar';
import DialSvgComponent from '../../react-svg-components/dial';
import RobotSvgComponent from '../../react-svg-components/robot';
import { AudioControls } from '../audio-controls';
import { AudioBarButton } from './audio-bar';
import { CaptionManager } from './caption-manager';

interface Caption<T extends 'ai' | 'call_event' | 'dial_event' | 'user'> {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
  type: T;
}
interface AiCaption extends Caption<'ai'> {}

interface UserCaption extends Caption<'user'> {}
interface DialEventCaption extends Caption<'dial_event'> {}

const callEventTypeMap = {
  appointment_cancelled: CalendarSvgComponent,
  appointment_scheduled: DialSvgComponent,
};

interface CallEventCaption extends Caption<'call_event'> {
  callEventType: 'appointment_cancelled' | 'appointment_scheduled';
  time: string;
}

// interface AudioCaptionPlayerProps {
//   title: string;
//   audioSrc: string;
//   captions: Caption<'ai' | 'call_event' | 'dial_event' | 'user'>[];
// }

interface AudioCaptionPlayerProps {
  selectedAudioButton: AudioBarButton;
}
type AudioDemoTrans = GenericTrans<keyof typeof en.Landing.heros.audioDemo>;

export default function AudioCaptionPlayer({
  selectedAudioButton,
}: AudioCaptionPlayerProps) {
  const tCallEvents: CallEventsTrans = useTranslations('CallEvents');
  const t: AudioDemoTrans = useTranslations(`Landing.heros.audioDemo`);

  const { audioSrc, captions } = captionsMap[selectedAudioButton];
  const title = selectedAudioButton;

  return (
    <div>
      <div className="border-input-border flex h-14 w-full flex-row items-center justify-between gap-2 rounded-tl-xl rounded-tr-xl border bg-white px-6">
        <div className="flex flex-row items-center gap-2 overflow-x-hidden">
          <DialSvgComponent />
          <P fontFamily="poppins" className="truncate text-xl font-semibold">
            {t(title)}
          </P>
        </div>
        <AudioControls audioSrc={audioSrc} />
      </div>
      <div
        id="caption-container"
        className="scrollbar-none border-input-border h-96 space-y-4 overflow-y-auto rounded-bl-xl rounded-br-xl border border-t-0 bg-gray-100 p-6 pt-8"
      >
        {captions.map(caption => (
          <div
            key={caption.id}
            data-start-time={caption.startTime}
            data-end-time={caption.endTime}
            className={`grid-row invisible grid w-full translate-y-full transform rounded-lg p-2 opacity-0 transition-all duration-500 ease-in-out`}
          >
            {caption.type === 'ai' ? (
              <AiCaptionRender caption={caption as AiCaption} />
            ) : caption.type === 'user' ? (
              <UserCaptionRender caption={caption as UserCaption} />
            ) : caption.type === 'call_event' ? (
              <CallEventCaptionnRender
                caption={caption as CallEventCaption}
                t={tCallEvents}
              />
            ) : (
              <CallCaptionRender caption={caption as DialEventCaption} />
            )}
          </div>
        ))}
      </div>
      <CaptionManager />
    </div>
  );
}
function AiCaptionRender({ caption }: { caption: AiCaption }) {
  return (
    <div className="flex w-full max-w-xl flex-row items-start justify-start gap-2.5">
      <div className="mx-x mt-1 rounded-full bg-primary p-2">
        <RobotSvgComponent />
      </div>

      <div className="flex-1 rounded-lg bg-primary/85 p-4 text-white">
        <P className="text-lg/6">{caption.text}</P>
      </div>
    </div>
  );
}

function UserCaptionRender({ caption }: { caption: UserCaption }) {
  return (
    <div className="w-full max-w-xl justify-self-end">
      <div className="rounded-lg bg-white p-4 text-primary">
        <P className="text-lg/6">{caption.text}</P>
      </div>
    </div>
  );
}

function CallEventCaptionnRender({
  caption,
  t,
}: {
  caption: CallEventCaption;
  t: CallEventsTrans;
}) {
  const Cmp = callEventTypeMap[caption.callEventType];
  return (
    <div className="w-full max-w-lg justify-self-center text-black">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <Cmp />
            <P className="font-bold">{t(caption.callEventType)}</P>
          </div>

          <P className="text-label">{caption.time}</P>
        </div>
        <P className="text-base/6">{caption.text}</P>
      </div>
    </div>
  );
}

function CallCaptionRender({ caption }: { caption: DialEventCaption }) {
  return (
    <div className="w-full max-w-lg justify-self-center text-hero-description">
      <div className="rounded-[40px] bg-border p-4">
        <div className="flex flex-row items-center gap-2.5">
          <PhoneCall
            className="h-5 w-5 shrink-0 text-success"
            fill="currentColor"
          />
          <P className="flex-1 text-lg/6">{caption.text}</P>
        </div>
      </div>
    </div>
  );
}
