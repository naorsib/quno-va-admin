import { ArrowDown, PhoneCall, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import CalendarSvgComponent from '@/components/react-svg-components/calendar';
import DialSvgComponent from '@/components/react-svg-components/dial';
import RobotSvgComponent from '@/components/react-svg-components/robot';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { EnumsTrans } from '@/types/translations';

import { CaptionManager } from './caption-manager';
export type EditTools = {
  deleteCaption: (id: number) => void;
  insertAfterCaption: (id: number) => void;
};
export type CaptionType = 'ai' | 'call_event' | 'dial_event' | 'user';

export type Caption = BaseCaption | CallEventCaption;

export type CallEventType = keyof typeof en.Enums.call_event_types;

export interface BaseCaption {
  id: number;
  text: string;
  startTime: number;
  type: CaptionType;
}

export interface CallEventCaption extends BaseCaption {
  type: 'call_event';
  callEventType: CallEventType;
  time: string;
}

const callEventTypeToIconMap: Record<CallEventType, React.ComponentType> = {
  schedule_appointment: DialSvgComponent,
  cancel_appointment: CalendarSvgComponent,
  reschedule_appointment: DialSvgComponent,
  prescription_renewal: DialSvgComponent,
  get_sick_leave: DialSvgComponent,
  doctor_call: DialSvgComponent,
};

interface AudioCaptionPlayerProps {
  captions: Caption[];
  editTools?: EditTools;
}

export default function AudioCaptionPlayer({
  captions,
  editTools = undefined,
}: AudioCaptionPlayerProps): JSX.Element {
  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');

  return (
    <div
      className={cn(
        'border-input-border relative h-96 space-y-4 rounded-bl-xl rounded-br-xl border border-t-0 bg-gray-100 p-6 pt-8',
        editTools ? 'overflow-y-auto' : 'scrollbar-none overflow-hidden',
      )}
    >
      <div id="caption-container" className="absolute left-0 w-full">
        {captions.map(caption => (
          <CaptionRenderer
            key={caption.id}
            caption={caption}
            tCaptionEvents={tCallEventTypeEnumTrans}
            editTools={editTools}
          />
        ))}
      </div>
      <CaptionManager isEditMode={!!editTools} />
    </div>
  );
}

function CaptionRenderer({
  caption,
  tCaptionEvents,
  editTools,
}: {
  caption: Caption;
  tCaptionEvents: EnumsTrans<'call_event_types'>;
  editTools?: EditTools;
}): JSX.Element {
  return (
    <div
      data-start-time={caption.startTime}
      className={cn(
        'grid-row invisible grid w-full translate-y-full transform rounded-lg p-2 transition-all duration-500 ease-in-out',
      )}
    >
      {caption.type === 'ai' ? (
        <AiCaptionRender caption={caption} editTools={editTools} />
      ) : caption.type === 'user' ? (
        <UserCaptionRender caption={caption} editTools={editTools} />
      ) : caption.type === 'call_event' ? (
        <CallEventCaptionRender
          caption={caption as CallEventCaption}
          t={tCaptionEvents}
          editTools={editTools}
        />
      ) : (
        <CallCaptionRender caption={caption} editTools={editTools} />
      )}
    </div>
  );
}

function EditToolsRender({
  caption,
  editTools,
  side = 'right',
}: {
  caption: BaseCaption;
  editTools: EditTools;
  side?: 'left' | 'right';
}): JSX.Element {
  return (
    <div
      className={cn(
        'absolute top-0 flex flex-col',
        side === 'right' ? '-right-5' : '-left-5',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => editTools.deleteCaption(caption.id)}
      >
        <Trash className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => editTools.insertAfterCaption(caption.id)}
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
    </div>
  );
}

function AiCaptionRender({
  caption,
  editTools,
}: {
  caption: BaseCaption;
  editTools?: EditTools;
}): JSX.Element {
  return (
    <div className="relative flex w-full max-w-xl flex-row items-start justify-start gap-2.5">
      <div className="mx-x mt-1 rounded-full bg-primary p-2">
        <RobotSvgComponent />
      </div>
      <div className="flex-1 rounded-lg bg-primary/85 p-4 text-white">
        <P className="text-lg/6">{caption.text}</P>
      </div>
      {editTools && <EditToolsRender caption={caption} editTools={editTools} />}
    </div>
  );
}

function UserCaptionRender({
  caption,
  editTools,
}: {
  caption: BaseCaption;
  editTools?: EditTools;
}): JSX.Element {
  return (
    <div className="relative w-full max-w-xl justify-self-end">
      <div className="rounded-lg bg-white p-4 text-primary">
        <P className="text-lg/6">{caption.text}</P>
      </div>
      {editTools && (
        <EditToolsRender side="left" caption={caption} editTools={editTools} />
      )}
    </div>
  );
}

function CallEventCaptionRender({
  caption,
  t,
  editTools,
}: {
  caption: CallEventCaption;
  t: EnumsTrans<'call_event_types'>;
  editTools?: EditTools;
}): JSX.Element {
  const IconComponent = callEventTypeToIconMap[caption.callEventType];
  return (
    <div className="relative w-full max-w-lg justify-self-center text-black">
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

      {editTools && <EditToolsRender caption={caption} editTools={editTools} />}
    </div>
  );
}

function CallCaptionRender({
  caption,
  editTools,
}: {
  caption: BaseCaption;
  editTools?: EditTools;
}): JSX.Element {
  return (
    <div className="relative w-full max-w-lg justify-self-center text-hero-description">
      <div className="rounded-[40px] bg-border p-4">
        <div className="flex flex-row items-center gap-2.5">
          <PhoneCall
            className="h-5 w-5 shrink-0 text-success"
            fill="currentColor"
          />
          <P className="flex-1 text-lg/6">{caption.text}</P>
        </div>
      </div>
      {editTools && <EditToolsRender caption={caption} editTools={editTools} />}
    </div>
  );
}
