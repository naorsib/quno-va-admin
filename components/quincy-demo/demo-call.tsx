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

import DialSvgComponent from '@/components/react-svg-components/dial';
import LoaderSvgComponent from '@/components/react-svg-components/loader';
import PhoneSvgComponent from '@/components/react-svg-components/phone';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
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
  //TODO - we only really need this to mock the call initiation - Remove once development is done
  demo_service_phone_assignment_id: number;
};

export function DemoCall({
  demo_service_phone_assignment_id,
  ongoingCall,
}: Props) {
  const [call, setCall] = useState(ongoingCall);
  const [triggerring, setTriggering] = useState(false);
  const [recentlyFinishedCallDuration, setRecentlyFinishedCallDuration] =
    useState<number | undefined>();

  const supabase = createClient();
  const t = useTranslations(`InnerPages.quincyDemo`);

  const updateSubscriptionRef = useRef<RealtimeChannel | undefined>(undefined);
  const insertSubscriptionRef = useRef<RealtimeChannel | undefined>(undefined);

  const listenToCallEnd = useCallback(
    (incomingCallId: number) => {
      console.log(`Listening to calls ending on id ${incomingCallId}`);
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
                secondsFromDate(new Date(call.callStartTime)),
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
    console.log('Subscribing to incoming calls');
    return supabase
      .channel('incoming_demo_calls')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incoming_demo_calls' },
        payload => {
          insertSubscriptionRef.current?.unsubscribe();
          setCall({
            userOngoingCallId: payload.new.id,
            callStartTime: payload.new.created_at,
          });
          console.log('New call received!', payload);
        },
      )
      .subscribe(console.log);
  }, [supabase]);

  const triggerFakeCallEvent = async () => {
    setTriggering(true);
    setTimeout(async () => {
      console.log('fake triggering call event');

      setTriggering(false);
    }, 2000);
  };

  const startCall = async () => {
    setTriggering(true);
    setTimeout(async () => {
      console.log('starting fake call');
      // TODO - remove the insert&update policies from users when development is done and this function is removed
      await supabase
        .from('incoming_demo_calls')
        .insert({ demo_service_phone_assignment_id });

      setTriggering(false);
    }, 2000);
  };

  const endCall = async () => {
    setTriggering(true);
    setTimeout(async () => {
      console.log('fake ending call');
      // TODO - remove the insert&update policies from users when development is done and this function is removed
      const ended_at = new Date().toISOString();
      await supabase
        .from('incoming_demo_calls')
        .update({ ended_at })
        .eq(
          'demo_service_phone_assignment_id',
          demo_service_phone_assignment_id,
        );
      setTriggering(false);
    }, 2000);
  };

  useEffect(() => {
    if (call) {
      updateSubscriptionRef.current?.unsubscribe();
      updateSubscriptionRef.current = listenToCallEnd(call.userOngoingCallId);
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
            <Button
              disabled={triggerring}
              onClick={() => triggerFakeCallEvent()}
              variant="link"
              className="pointer-cursor"
            >
              Trigger fake call event
            </Button>
            <LabelWrapper className="text-successDarkr bg-successLight">
              <PhoneSvgComponent className="text-success" />
              <P>{t('incomingCall')}</P>
              <StopWatch
                elapsedOnStart={secondsFromDate(new Date(call.callStartTime))}
              />
            </LabelWrapper>
          </div>
          <Button disabled={triggerring} onClick={() => endCall()}>
            Fake call end (temporary - dev only)
          </Button>
        </>
      ) : (
        <>
          <Button disabled={triggerring} onClick={() => startCall()}>
            Fake call start (temporary - dev only)
          </Button>

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
