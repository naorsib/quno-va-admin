import { PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import CalendarSvgComponent from '@/components/react-svg-components/calendar';
import DialSvgComponent from '@/components/react-svg-components/dial';
import RobotSvgComponent from '@/components/react-svg-components/robot';
import { P } from '@/components/typography/text';
import en from '@/messages/en.json';
import { EnumsTrans, GenericTrans } from '@/types/translations';

import { CaptionManager } from './caption-manager';

type CaptionType = 'ai' | 'call_event' | 'dial_event' | 'user';

interface BaseCaption {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
  type: CaptionType;
}

interface AiCaption extends BaseCaption {
  type: 'ai';
}

interface UserCaption extends BaseCaption {
  type: 'user';
}

interface DialEventCaption extends BaseCaption {
  type: 'dial_event';
}

interface CallEventCaption extends BaseCaption {
  type: 'call_event';
  callEventType: keyof typeof en.CallEventBoxes;
  time: string;
}

export type Caption =
  | AiCaption
  | UserCaption
  | DialEventCaption
  | CallEventCaption;

const callEventTypeToIconMap: Record<
  keyof typeof en.CallEventBoxes,
  React.ComponentType
> = {
  schedule_appointment: DialSvgComponent,
  cancel_appointment: CalendarSvgComponent,
  reschedule_appointment: DialSvgComponent,
  prescription_renewal: DialSvgComponent,
  get_sick_leave: DialSvgComponent,
  doctor_call: DialSvgComponent,
};

interface AudioCaptionPlayerProps {
  captions: Caption[];
}

type AudioDemoTrans = GenericTrans<keyof typeof en.Landing.heros.audioDemo>;

export default function AudioCaptionPlayer({
  captions,
}: AudioCaptionPlayerProps): JSX.Element {
  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');
  const t: AudioDemoTrans = useTranslations(`Landing.heros.audioDemo`);

  return (
    <div className="scrollbar-none border-input-border relative h-96 space-y-4 overflow-hidden rounded-bl-xl rounded-br-xl border border-t-0 bg-gray-100 p-6 pt-8">
      <div id="caption-container" className="absolute left-0 w-full">
        {captions.map(caption => (
          <CaptionRenderer
            key={caption.id}
            caption={caption}
            tCaptionEvents={tCallEventTypeEnumTrans}
          />
        ))}
      </div>
      <CaptionManager />
    </div>
  );
}

function CaptionRenderer({
  caption,
  tCaptionEvents,
}: {
  caption: Caption;
  tCaptionEvents: EnumsTrans<'call_event_types'>;
}): JSX.Element {
  return (
    <div
      data-start-time={caption.startTime}
      data-end-time={caption.endTime}
      className="grid-row invisible grid w-full translate-y-full transform rounded-lg p-2 opacity-0 transition-all duration-500 ease-in-out"
    >
      {caption.type === 'ai' ? (
        <AiCaptionRender caption={caption} />
      ) : caption.type === 'user' ? (
        <UserCaptionRender caption={caption} />
      ) : caption.type === 'call_event' ? (
        <CallEventCaptionRender caption={caption} t={tCaptionEvents} />
      ) : (
        <CallCaptionRender caption={caption} />
      )}
    </div>
  );
}

function AiCaptionRender({ caption }: { caption: AiCaption }): JSX.Element {
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

function UserCaptionRender({ caption }: { caption: UserCaption }): JSX.Element {
  return (
    <div className="w-full max-w-xl justify-self-end">
      <div className="rounded-lg bg-white p-4 text-primary">
        <P className="text-lg/6">{caption.text}</P>
      </div>
    </div>
  );
}

function CallEventCaptionRender({
  caption,
  t,
}: {
  caption: CallEventCaption;
  t: EnumsTrans<'call_event_types'>;
}): JSX.Element {
  const IconComponent = callEventTypeToIconMap[caption.callEventType];
  return (
    <div className="w-full max-w-lg justify-self-center text-black">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <IconComponent />
            <P className="font-bold">{t(caption.callEventType)}</P>
          </div>
          <P className="text-label">{caption.time}</P>
        </div>
        <P className="text-base/6">{caption.text}</P>
      </div>
    </div>
  );
}

function CallCaptionRender({
  caption,
}: {
  caption: DialEventCaption;
}): JSX.Element {
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
