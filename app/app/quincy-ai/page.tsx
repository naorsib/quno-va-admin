import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { UserClinic } from '@/components/quincy-dashboard/user-clinic/user-clinic';
import { UserServices } from '@/components/quincy-dashboard/user-services/user-services';
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

  if (!user) {
    // this should never happen as we're protected by the middleware
    return redirect(routeConsts.signIn);
  }

  const t: InnerPagesTrans<'quincy'> =
    await getTranslations(`InnerPages.quincy`);

  return (
    // max-h-[calc(100vh-64px)]
    <div className="flex flex-col">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-4 py-10 lg:max-h-none lg:pb-4">
        <div className="flex w-full flex-row items-center justify-between">
          <H1 variant="innerPage">{t('title')}</H1>

          <StaticRouteLink routeTo="quincyDemo" className="hidden lg:block">
            <Button asChild variant="secondary">
              <P className="font-normal">{t('startDemoButton')}</P>
            </Button>
          </StaticRouteLink>
        </div>
        <UserClinic userId={user.id} t={t} />
        <UserServices userId={user.id} />
      </div>

      <StaticRouteLink
        routeTo="quincyDemo"
        className="sticky bottom-0 lg:hidden"
      >
        <Button asChild variant="secondary" className="h-14 w-full">
          <P className="font-normal">{t('startDemoButton')}</P>
        </Button>
      </StaticRouteLink>
    </div>
  );
}
