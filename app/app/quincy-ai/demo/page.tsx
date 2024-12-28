import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { requestContract } from '@/app/actions';
import { CallEventLogs } from '@/components/quincy-demo/call-event-logs';
import { DemoCall, OngoingCall } from '@/components/quincy-demo/demo-call';
import { DemoSuccessBox } from '@/components/quincy-demo/demo-success-box';
import { ThankYouDialog } from '@/components/quincy-demo/thank-you-dialog';
import SettingsSvgComponent from '@/components/react-svg-components/settings';
import { StaticRouteLink } from '@/components/static-route-link';
import { H1, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { routeConsts } from '@/consts/routing.const';
import { InnerPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export type DemoRequestedData = {
  requested_contract: boolean;
};

export type QuincyDemoPropsBase = DemoRequestedData & {
  t: InnerPagesTrans<'quincyDemo'>;
};

export default async function QuincyDemoPage(props: {
  searchParams: Promise<{ requested?: boolean }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id as string;
  const { data: demo_data } = (await supabase
    .from('user_base_details')
    .select('requested_contract')
    .eq('id', userId)
    .limit(1)
    .single()) as { data: DemoRequestedData };

  const existingNonDeletedDemo = await supabase
    .from('demo_service_phone_assignments')
    .select('id, phone, is_deleted')
    .eq('is_deleted', false)
    .eq('assigned_to', userId)
    .limit(1)
    .maybeSingle();

  const searchParams = await props.searchParams;
  const demoOngoing = !!existingNonDeletedDemo.data;
  if (!demoOngoing && !demo_data.requested_contract) {
    // should've never gotten here
    return redirect(routeConsts.quincyDashboard);
  }
  let ongoingCall: OngoingCall | undefined;

  if (existingNonDeletedDemo.data) {
    const { data: activeCall } = await supabase
      .from('incoming_demo_calls')
      .select('id , created_at')
      // eslint-disable-next-line unicorn/no-null
      .is('ended_at', null)
      .eq('demo_service_phone_assignment_id', existingNonDeletedDemo.data.id)
      .limit(1)
      .maybeSingle();

    if (activeCall) {
      const { id: userOngoingCallId, created_at: callStartTime } = activeCall;
      ongoingCall = {
        userOngoingCallId,
        callStartTime: new Date(callStartTime),
      };
    }
  }
  // requested now
  const requested = !!searchParams.requested;
  const t: InnerPagesTrans<'quincyDemo'> = await getTranslations(
    `InnerPages.quincyDemo`,
  );

  const { data: existing_call_events } = await supabase
    .from('abstract_demo_call_events')
    .select('id, created_at, call_event_type_id, extra_data')
    .order('id', { ascending: false });

  return (
    // max-h-[calc(100vh-64px)]
    <div className="flex flex-col">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-6 py-10 lg:max-h-none">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-1 flex-row items-center justify-between gap-3 lg:flex-initial">
            <H1 variant="innerPage">{t('title')}</H1>

            <StaticRouteLink routeTo="quincyDashboard">
              <div className="flex flex-row items-center gap-1 text-secondary-foreground hover:text-secondary hover:underline">
                <SettingsSvgComponent />
                <P className="text-sm text-inherit">{t('settingsLink')}</P>
              </div>
            </StaticRouteLink>
          </div>
          <div className="hidden lg:block">
            <form>
              <Button
                formAction={requestContract}
                variant="secondary"
                disabled={demo_data.requested_contract}
              >
                <P className="font-normal">{t('requestContractButton')}</P>
              </Button>
            </form>
          </div>
        </div>
        <DemoSuccessBox
          requested_contract={demo_data.requested_contract}
          phone={existingNonDeletedDemo.data?.phone}
          t={t}
        />
        {!demo_data.requested_contract && (
          <DemoCall ongoingCall={ongoingCall} />
        )}
        {!demo_data.requested_contract && (
          <CallEventLogs existing_call_events={existing_call_events || []} />
        )}
        <ThankYouDialog requested_contract={requested} t={t} />
      </div>

      <div className="sticky bottom-0 lg:hidden">
        <form>
          <Button
            variant="secondary"
            className="h-14 w-full"
            formAction={requestContract}
            disabled={demo_data.requested_contract}
          >
            <P className="font-normal">{t('requestContractButton')}</P>
          </Button>
        </form>
      </div>
    </div>
  );
}
