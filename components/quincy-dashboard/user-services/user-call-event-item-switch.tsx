'use client';

import { ComponentProps, useState } from 'react';

import { CustomToggleBox } from '@/components//ui/custom-toggle-box';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase/client';

import { UserCallEvent } from './user-call-event-item';

type Props = ComponentProps<'div'> & {
  user_call_event: UserCallEvent;
};
export function UserCallEventItemSwitch({ user_call_event, ...props }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(user_call_event.is_enabled);
  const supabase = createClient();
  const toggleService = async (is_enabled: boolean) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('user_call_events')
      .update({ is_enabled })
      .eq('id', user_call_event.id);
    if (error) {
      // revert failed action
      setIsEnabled(!is_enabled);
      // TODO - Handle failure. Toast?
    } else {
      setIsEnabled(is_enabled);
    }
    setIsUpdating(false);
  };
  return (
    <CustomToggleBox pressed={isEnabled} className="relative w-full p-4">
      <Switch
        className="absolute right-4 top-4"
        checked={isEnabled}
        onCheckedChange={toggleService}
        disabled={isUpdating}
      ></Switch>
      {props.children}
    </CustomToggleBox>
  );
}
