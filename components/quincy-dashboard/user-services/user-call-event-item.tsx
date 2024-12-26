import { getTranslations } from 'next-intl/server';

import { UserCallEventItemSwitch } from './user-call-event-item-switch';

export type UserCallEvent = {
  id: number;
  call_event_type_id: string;
  is_enabled: boolean;
};

export async function UserCallEventItem({
  user_call_event,
}: {
  user_call_event: UserCallEvent;
}) {
  const t = await getTranslations(
    `CallEvents.${user_call_event.call_event_type_id}`,
  );
  return (
    <UserCallEventItemSwitch user_call_event={user_call_event}>
      <div className="flex w-full flex-col gap-3">
        <h3 className="mb-3 mr-10 text-base font-bold">{t('title')}</h3>
        <p>{t('info')}</p>
      </div>
    </UserCallEventItemSwitch>
  );
}
