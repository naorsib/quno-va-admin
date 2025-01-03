'use client';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import { captionsMap } from '@/consts/demo-captions/captions';
import { EnumsTrans } from '@/types/translations';

import { AudioBarButton } from '../audio-bar';
import EditCaptionsList from './edit-captions-list';

type Props = {
  selected_audio_button: AudioBarButton;
};

export default function EditCaptionsComponent({
  selected_audio_button,
}: Props): JSX.Element {
  const tCallEventTypeEnumTrans: EnumsTrans<'call_event_types'> =
    useTranslations('Enums.call_event_types');

  return (
    <EditCaptionsList
      initial_captions={captionsMap[selected_audio_button].captions}
    />
  );
}
