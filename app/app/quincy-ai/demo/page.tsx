import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { requestContract } from '@/app/actions';
import { AppointmentsLogs } from '@/components/quincy-demo/appointments-logs';
import { DemoCall } from '@/components/quincy-demo/demo-call';
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
  contract_requested: boolean;
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

  if (!user) {
    // this should never happen as we're protected by the middleware
    return redirect(routeConsts.signIn);
  }

  const searchParams = await props.searchParams;
  const requested = !!searchParams.requested;

  const { data: demo_data } = (await supabase
    .from('user_basic_details')
    .select('contract_requested')
    .eq('id', user.id)
    .limit(1)
    .single()) as { data: DemoRequestedData };

  const t: InnerPagesTrans<'quincyDemo'> = await getTranslations(
    `InnerPages.quincyDemo`,
  );

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
                disabled={demo_data.contract_requested}
              >
                <P className="font-normal">{t('requestContractButton')}</P>
              </Button>
            </form>
          </div>
        </div>
        <DemoSuccessBox
          contract_requested={demo_data.contract_requested}
          t={t}
        />
        <DemoCall contract_requested={demo_data.contract_requested} t={t} />
        <AppointmentsLogs
          contract_requested={demo_data.contract_requested}
          t={t}
        />
        <ThankYouDialog contract_requested={requested} t={t} />
      </div>

      <div className="sticky bottom-0 lg:hidden">
        <form>
          <Button
            variant="secondary"
            className="h-14 w-full"
            formAction={requestContract}
            disabled={demo_data.contract_requested}
          >
            <P className="font-normal">{t('requestContractButton')}</P>
          </Button>
        </form>
      </div>
    </div>
  );
}
