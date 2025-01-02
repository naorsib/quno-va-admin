import { CallEvent } from '@/types/call-events';
import { CallEventTypes } from '@/types/enums';

import { CallEventLogBoxes } from './call-event-log-boxes';

type Props = {
  existing_call_events: CallEvent<CallEventTypes>[];
};
export async function CallEventLogs({ existing_call_events }: Props) {
  return (
    <div className="flex w-full flex-col">
      <CallEventLogBoxes existing_call_events={existing_call_events} />
    </div>
  );
}
