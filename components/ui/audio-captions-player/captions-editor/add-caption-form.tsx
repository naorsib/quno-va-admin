/* eslint-disable unicorn/prevent-abbreviations */

'use client';
import { Bot, Calendar, Phone, PhoneCall, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import en from '@/messages/en.json';
import { EnumsTrans } from '@/types/translations';

import {
  BaseCaption,
  CallEventCaption,
  CallEventType,
  Caption,
  CaptionType,
} from '../audio-caption-player';

interface AddCaptionFormProps {
  onAddCaption: (caption: Omit<Caption, 'id'>) => void;
  onCancel: () => void;
  totalDuration?: number;
  existingCaptions: Caption[];
  captionToDuplicate: Caption | null;
}

const all_call_event_types = Object.keys(
  en.Enums.call_event_types,
) as CallEventType[];

export default function AddCaptionForm({
  onAddCaption,
  onCancel,
  totalDuration = 5000, //TODO ?
  existingCaptions,
  captionToDuplicate,
}: AddCaptionFormProps) {
  const [captionType, setCaptionType] = useState<CaptionType>('ai');
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState('');
  const [callEventType, setCallEventType] = useState<CallEventType>(
    'schedule_appointment',
  );
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');
  const textTimeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (captionToDuplicate) {
      setCaptionType(captionToDuplicate.type);
      setText('');
      setStartTime(`${Number(captionToDuplicate.startTime) + 1}`);
      if (captionToDuplicate.type === 'call_event') {
        setCallEventType(
          (captionToDuplicate as CallEventCaption).callEventType,
        );
        setTime((captionToDuplicate as CallEventCaption).time);
      }
    }
    // Focus and scroll to the text input
    if (textTimeInputRef.current) {
      textTimeInputRef.current.focus();
      textTimeInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [captionToDuplicate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startTimeNumber = Number.parseInt(startTime, 10);

    if (Number.isNaN(startTimeNumber)) {
      setErrorMessage('Start time must be a valid number');
      return;
    }

    if (startTimeNumber < 0 || startTimeNumber > totalDuration) {
      setErrorMessage(`Start time must be between 0 and ${totalDuration}`);
      return;
    }

    setErrorMessage('');
    const newCaption: Omit<BaseCaption, 'id'> = {
      text,
      startTime: startTimeNumber,
      type: captionType,
    };
    if (captionType === 'call_event') {
      (newCaption as CallEventCaption).callEventType = callEventType;
      (newCaption as CallEventCaption).time = time;
    }
    onAddCaption(newCaption);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label htmlFor="captionType">Caption Type</Label>
            <Select
              onValueChange={(value: CaptionType) => setCaptionType(value)}
              value={captionType}
            >
              <SelectTrigger id="captionType">
                <SelectValue placeholder="Select caption type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>AI</span>
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>User</span>
                  </div>
                </SelectItem>
                <SelectItem value="dial_event">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Dial Event</span>
                  </div>
                </SelectItem>
                <SelectItem value="call_event">
                  <div className="flex items-center">
                    <PhoneCall className="mr-2 h-4 w-4" />
                    <span>Call Event</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="text">Text</Label>
            <Input
              id="text"
              value={text}
              onChange={e => setText(e.target.value)}
              required
              ref={textTimeInputRef}
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="number"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
              min="0"
              max={totalDuration ? totalDuration.toString() : undefined}
            />
          </div>
          {captionType === 'call_event' && (
            <>
              <div>
                <Label htmlFor="callEventType">Call Event Type</Label>
                <Select
                  onValueChange={(value: CallEventType) =>
                    setCallEventType(value)
                  }
                  value={callEventType}
                >
                  <SelectTrigger id="callEventType">
                    <SelectValue placeholder="Select a call event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {all_call_event_types.map(e => (
                      <SelectItem key={e} value={e}>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{tCallEventTypeEnumTrans(e)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                />
              </div>
            </>
          )}
        </CardContent>
        {errorMessage && (
          <div className="px-6 pb-4 text-sm text-red-500" role="alert">
            {errorMessage}
          </div>
        )}
        <CardFooter className="mt-4 justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" className="text-white" type="submit">
            Add Caption
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
