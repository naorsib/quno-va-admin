import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { pauseDemo, requestContract } from '@/app/actions';
import { CallEventLogs } from '@/components/quincy-demo/call-event-logs';
import { DemoCall } from '@/components/quincy-demo/demo-call';
import { DemoSuccessBox } from '@/components/quincy-demo/demo-success-box';
import { ThankYouDialog } from '@/components/quincy-demo/thank-you-dialog';
import SettingsSvgComponent from '@/components/react-svg-components/settings';
import { H1, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { routeConsts } from '@/consts/routing.const';
import { InnerPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

type DemoRequestedData = {
  user_demo_status_type_id: 'ongoing' | 'paused' | 'finished';
};

export type DemoComponentsProps = {
  requested_contract: boolean;
};
export type QuincyDemoPropsBase = DemoComponentsProps & {
  t: InnerPagesTrans<'quincyDemo'>;
};

export default async function QuincyDemoPage(props: {
  searchParams: Promise<{ requested?: boolean }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_id = user?.id as string;
  const { data: user_base_data } = (await supabase
    .from('user_base_details')
    .select('user_demo_status_type_id')
    .eq('id', user_id)
    .limit(1)
    .single()) as { data: DemoRequestedData };

  if (user_base_data?.user_demo_status_type_id === null) {
    return redirect(routeConsts.quincyDashboard);
  }

  const { data: ongoingCall } = await supabase
    .from('incoming_demo_calls')
    .select('id , created_at')
    // eslint-disable-next-line unicorn/no-null
    .is('ended_at', null)
    .eq('associated_with', user_id)
    .limit(1)
    .maybeSingle();
  if (ongoingCall?.created_at) {
    ongoingCall.created_at = new Date(ongoingCall.created_at);
  }
  const searchParams = await props.searchParams;
  // requested now
  const requested_now = !!searchParams.requested;
  const t: InnerPagesTrans<'quincyDemo'> = await getTranslations(
    `InnerPages.quincyDemo`,
  );

  const { data: existing_call_events } = await supabase
    .from('abstract_demo_call_events')
    .select('id, created_at, call_event_type_id, extra_data')
    .order('id', { ascending: false });
  const requested_contract =
    user_base_data.user_demo_status_type_id === 'finished';

  return (
    // max-h-[calc(100vh-64px)]
    <div className="flex flex-col">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-6 py-10 lg:max-h-none">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-1 flex-row items-center justify-between gap-3 lg:flex-initial">
            <H1 variant="innerPage">{t('title')}</H1>
            <form>
              <Button
                formAction={pauseDemo}
                variant="link"
                className="flex flex-row items-center gap-1 text-secondary-foreground hover:text-secondary hover:underline"
              >
                <SettingsSvgComponent />
                <P className="text-sm text-inherit">
                  {t(requested_contract ? 'restartDemo' : 'settingsLink')}
                </P>
              </Button>
            </form>
          </div>
          <div className="hidden lg:block">
            <form>
              <Button
                formAction={requestContract}
                variant="secondary"
                disabled={requested_contract}
              >
                <P className="font-normal">{t('requestContractButton')}</P>
              </Button>
            </form>
          </div>
        </div>
        <DemoSuccessBox requested_contract={requested_contract} t={t} />
        {!requested_contract && <DemoCall ongoingCall={ongoingCall} />}
        {!requested_contract && (
          <CallEventLogs existing_call_events={existing_call_events || []} />
        )}
        {!requested_contract && <ThankYouDialog should_show={requested_now} />}
      </div>

      <div className="sticky bottom-3.5 lg:hidden">
        <form>
          <Button
            variant="secondary"
            className="h-14 w-full"
            formAction={requestContract}
            disabled={requested_contract}
          >
            <P className="font-normal">{t('requestContractButton')}</P>
          </Button>
        </form>
      </div>
    </div>
  );
}
