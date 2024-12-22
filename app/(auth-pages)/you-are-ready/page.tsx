import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { StaticRouteLink } from '@/components/static-route-link';
import { H2, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { routeConsts } from '@/consts/routing.const';
import { AuthPagesTrans } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';

export default async function YouAreReadyPage() {
  const supabase = await createClient();
  const t: AuthPagesTrans<'youAreReady'> = await getTranslations(
    'Auth.pages.youAreReady',
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email_confirmed_at || !user.phone_confirmed_at) {
    return redirect(routeConsts.signIn);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">{t('title')}</H2>
        </CardTitle>
        <CardDescription className="text-center">
          <P variant="info">{t('subtitle')}</P>
        </CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter>
        <StaticRouteLink
          routeTo="quincyMainDashboard"
          className="flex w-full justify-center sm:w-3/4"
        >
          <Button
            className="bg-card-button px-6 text-white"
            additions="main"
            asChild
          >
            <P>{t('start')}</P>
          </Button>
        </StaticRouteLink>
      </CardFooter>
    </Card>
  );
}
