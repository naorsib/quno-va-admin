import { createClient } from '@/utils/supabase/server';

import { UserCallEvent, UserCallEventItem } from './user-call-event-item';

type Props = {
  userId: string;
};

export async function UserCallEvents({ userId }: Props) {
  const supabase = await createClient();
  const { data: user_call_events } = (await supabase
    .from('user_call_events')
    .select('id, call_event_type_id, is_enabled')
    .eq('user_id', userId)
    .order('id')) as { data: UserCallEvent[] };

  return (
    <div className="flex w-full flex-col items-center gap-2 text-sm">
      <div className="max-w-nd grid w-full auto-rows-fr grid-cols-1 gap-4 sm:max-w-full md:grid-cols-2">
        {user_call_events.map(call_event => (
          <UserCallEventItem key={call_event.id} user_call_event={call_event} />
        ))}
      </div>
    </div>
  );
}
