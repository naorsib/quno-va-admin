'use client';

import { RealtimeChannel } from '@supabase/realtime-js';
import { useTranslations } from 'next-intl';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  end_call,
  insert_random_call_event,
  start_call,
} from '@/app/random-call-events-actions';
import DialSvgComponent from '@/components/react-svg-components/dial';
import LoaderSvgComponent from '@/components/react-svg-components/loader';
import PhoneSvgComponent from '@/components/react-svg-components/phone';
import { SubmitButton } from '@/components/submit-button';
import { P } from '@/components/typography/text';
import { StopWatch } from '@/components/ui/stop-watch';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { secondsFromDate, secondsToTime } from '@/utils/utils';

export type OngoingCall = {
  userOngoingCallId: number;
  callStartTime: Date;
};

type Props = {
  ongoingCall?: OngoingCall;
};

export function DemoCall({ ongoingCall }: Props) {
  const [call, setCall] = useState(ongoingCall);
  const [recentlyFinishedCallDuration, setRecentlyFinishedCallDuration] =
    useState<number | undefined>();

  const supabase = createClient();
  const t = useTranslations(`InnerPages.quincyDemo`);

  const updateSubscriptionRef = useRef<RealtimeChannel | undefined>(undefined);
  const insertSubscriptionRef = useRef<RealtimeChannel | undefined>(undefined);

  const listenToCallEnd = useCallback(
    (incomingCallId: number) => {
      return supabase
        .channel(`call_end_${incomingCallId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'incoming_demo_calls',
            filter: `id=eq.${incomingCallId}`,
          },
          () => {
            if (call) {
              setRecentlyFinishedCallDuration(
                secondsFromDate(call.callStartTime),
              );
            }
            updateSubscriptionRef.current?.unsubscribe();
            setCall(undefined);
          },
        )
        .subscribe(console.log);
    },
    [call, supabase],
  );

  const listenToCallIncoming = useCallback(() => {
    return supabase
      .channel('incoming_demo_calls')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incoming_demo_calls' },
        payload => {
          insertSubscriptionRef.current?.unsubscribe();
          setCall({
            userOngoingCallId: payload.new.id,
            callStartTime: new Date(payload.new.created_at),
          });
        },
      )
      .subscribe(console.log);
  }, [supabase]);

  useEffect(() => {
    if (call) {
      updateSubscriptionRef.current?.unsubscribe();
      updateSubscriptionRef.current = listenToCallEnd(call.userOngoingCallId);

      //TODO - This is not relevant for after development stage and can be safely removed
      if (secondsFromDate(call.callStartTime) > 3599) {
        end_call();
      }
    } else {
      insertSubscriptionRef.current?.unsubscribe();
      insertSubscriptionRef.current = listenToCallIncoming();
    }

    return () => {
      updateSubscriptionRef.current?.unsubscribe();
      insertSubscriptionRef.current?.unsubscribe();
    };
  }, [call, listenToCallEnd, listenToCallIncoming]);

  return (
    <>
      {call ? (
        <>
          <div className="flex flex-col items-center">
            <form className="flex flex-col items-center">
              <SubmitButton
                formAction={insert_random_call_event}
                variant="link"
                className="cursor-pointer"
              >
                Trigger fake call event (temporary - dev only)
              </SubmitButton>

              <LabelWrapper className="text-successDarkr bg-successLight">
                <PhoneSvgComponent className="text-success" />
                <P>{t('incomingCall')}</P>
                <StopWatch
                  elapsedOnStart={secondsFromDate(call.callStartTime)}
                />
              </LabelWrapper>
              <SubmitButton
                formAction={end_call}
                variant="link"
                className="cursor-pointer"
              >
                Fake call end (temporary - dev only)
              </SubmitButton>
            </form>
          </div>
        </>
      ) : (
        <>
          <form>
            <SubmitButton
              formAction={start_call}
              variant="link"
              className="cursor-pointer"
            >
              Fake call start (temporary - dev only)
            </SubmitButton>
          </form>

          <LabelWrapper className="bg-border">
            <LoaderSvgComponent className="animate-loader-spin" />
            <P className="text-base text-label lg:text-lg">
              {t('waitingForCallsButton')}
            </P>
          </LabelWrapper>
        </>
      )}
      {recentlyFinishedCallDuration && (
        <LabelWrapper className="bg-destructive/40 text-destructive">
          <DialSvgComponent />
          <P>{t('callEnded')}</P>

          <div>{secondsToTime(recentlyFinishedCallDuration)}</div>
        </LabelWrapper>
      )}
    </>
  );
}

type LabelWrapperProps = ComponentProps<'div'>;
function LabelWrapper({ className, children }: LabelWrapperProps) {
  return (
    <div
      className={cn(
        'rounded-[40px] bg-destructive/40 px-4 py-3 text-destructive lg:px-6 lg:py-4',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2.5">
        {children}
      </div>
    </div>
  );
}
