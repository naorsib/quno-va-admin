import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { startDemo } from '@/app/actions';
import { UserClinic } from '@/components/quincy-dashboard/user-clinic/user-clinic';
import { UserCallEvents } from '@/components/quincy-dashboard/user-services/user-call-events';
import { StaticRouteLink } from '@/components/static-route-link';
import { H1, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { routeConsts } from '@/consts/routing.const';
import { InnerPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export default async function QuincyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id as string;
  const t: InnerPagesTrans<'quincy'> =
    await getTranslations(`InnerPages.quincy`);

  const { data } = await supabase
    .from('user_base_details')
    .select('requested_contract')
    .eq('id', userId)
    .limit(1)
    .single();
  if (data?.requested_contract) {
    return redirect(routeConsts.quincyDemo);
  }
  const existingNonDeletedDemo = await supabase
    .from('demo_service_phone_assignments')
    .select('id, is_deleted')
    .eq('is_deleted', false)
    .eq('assigned_to', userId)
    .limit(1)
    .maybeSingle();
  const demoOngoing = !!existingNonDeletedDemo.data;

  return (
    // max-h-[calc(100vh-64px)]
    <div className="flex flex-col">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-4 py-10 lg:max-h-none lg:pb-4">
        <div className="flex w-full flex-row items-center justify-between">
          <H1 variant="innerPage">{t('title')}</H1>
          {demoOngoing ? (
            <StaticRouteLink routeTo="quincyDemo" className="hidden lg:block">
              <Button asChild variant="secondary">
                <P className="font-normal">{t('continueDemoButton')}</P>
              </Button>
            </StaticRouteLink>
          ) : (
            <form className="hidden lg:block">
              <Button variant="secondary" formAction={startDemo}>
                <P className="font-normal">{t('startDemoButton')}</P>
              </Button>
            </form>
          )}
        </div>
        <UserClinic userId={userId} t={t} />
        <UserCallEvents userId={userId} />
      </div>
      {demoOngoing ? (
        <StaticRouteLink
          routeTo="quincyDemo"
          className="sticky bottom-3.5 lg:hidden"
        >
          <Button asChild variant="secondary" className="h-14 w-full">
            <P className="font-normal">{t('continueDemoButton')}</P>
          </Button>
        </StaticRouteLink>
      ) : (
        <form className="sticky bottom-3.5 lg:hidden">
          <Button
            formAction={startDemo}
            variant="secondary"
            className="h-14 w-full"
          >
            <P className="font-normal">{t('startDemoButton')}</P>
          </Button>
        </form>
      )}
    </div>
  );
}
