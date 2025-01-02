'use client';

import { RealtimeChannel } from '@supabase/realtime-js';
import { useTranslations } from 'next-intl';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  end_call,
  initiateCallFromClient,
  insert_random_call_event,
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
  id: number;
  created_at: Date;
};

type Props = {
  ongoingCall: OngoingCall | null;
};

function useSupabaseSubscription(initialCall: OngoingCall | null) {
  const [call, setCall] = useState<OngoingCall | null>(initialCall);
  const [recentlyFinishedCallDuration, setRecentlyFinishedCallDuration] =
    useState<number | undefined>();
  const supabase = useMemo(() => createClient(), []);
  const subscriptionRef = useRef<RealtimeChannel | undefined>(undefined);

  const updateState = useCallback(
    (newCall: OngoingCall | null, duration?: number) => {
      requestAnimationFrame(() => {
        setCall(newCall);
        setRecentlyFinishedCallDuration(duration);
      });
    },
    [],
  );

  useEffect(() => {
    const setupSubscriptions = () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      // eslint-disable-next-line unicorn/prefer-ternary
      if (call) {
        subscriptionRef.current = supabase
          .channel(`call_end_${call.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'incoming_demo_calls',
              filter: `id=eq.${call.id}`,
            },
            payload => {
              if (!payload.old.ended_at && payload.new.ended_at) {
                // eslint-disable-next-line unicorn/no-null
                updateState(null, secondsFromDate(call.created_at));
              }
            },
          )
          .subscribe();
      } else {
        subscriptionRef.current = supabase
          .channel('incoming_calls')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'incoming_demo_calls' },
            payload => {
              if (!payload.old.associated_with) {
                updateState({
                  id: payload.new.id,
                  created_at: new Date(payload.new.created_at),
                });
              }
            },
          )
          .subscribe();
      }
    };

    setupSubscriptions();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [call, supabase, updateState]);

  return { call, recentlyFinishedCallDuration };
}

export function DemoCall({ ongoingCall }: Props) {
  const { call, recentlyFinishedCallDuration } =
    useSupabaseSubscription(ongoingCall);
  const t = useTranslations(`InnerPages.quincyDemo`);

  const renderCallContent = useMemo(
    () => (
      <div className="flex flex-col items-center">
        <SubmitButton
          formAction={insert_random_call_event}
          variant="link"
          className="cursor-pointer"
          pendingText={call ? 'Recalculating...' : ''}
        >
          Trigger fake call event (temporary - dev only)
        </SubmitButton>

        <LabelWrapper className="text-successDarkr bg-successLight">
          <PhoneSvgComponent className="text-success" />
          <P>{t('incomingCall')}</P>
          {call && (
            <StopWatch elapsedOnStart={secondsFromDate(call.created_at)} />
          )}
        </LabelWrapper>
        <SubmitButton
          formAction={end_call}
          variant="link"
          className="cursor-pointer"
          pendingText="Loading..."
        >
          Fake call end (temporary - dev only)
        </SubmitButton>
      </div>
    ),
    [call, t],
  );

  const renderWaitingContent = useMemo(
    () => (
      <>
        <SubmitButton
          formAction={initiateCallFromClient}
          variant="link"
          className="cursor-pointer"
          pendingText="Loading..."
        >
          Fake call start (temporary - dev only)
        </SubmitButton>

        <LabelWrapper className="bg-border">
          <LoaderSvgComponent className="text-secondary" />
          <P className="text-label">{t('waitingForCallsButton')}</P>
        </LabelWrapper>
      </>
    ),
    [t],
  );

  return (
    <form className="flex flex-col items-center">
      {call ? renderCallContent : renderWaitingContent}
      {recentlyFinishedCallDuration && (
        <LabelWrapper className="text-destructive">
          <DialSvgComponent />
          <P>{t('callEnded')}</P>
          <div>{secondsToTime(recentlyFinishedCallDuration)}</div>
        </LabelWrapper>
      )}
    </form>
  );
}

type LabelWrapperProps = ComponentProps<'div'>;
function LabelWrapper({ className, children }: LabelWrapperProps) {
  return (
    <div
      className={cn(
        'rounded-[40px] px-4 py-3 text-base text-destructive lg:px-6 lg:py-4 lg:text-lg',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2.5">
        {children}
      </div>
    </div>
  );
}
