import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { H2, P } from '@/components/typography/text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { routeConsts } from '@/costs/routing.const';
import { AuthPagesTrans } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ email?: string }>;
}) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!user) {
    return redirect(routeConsts.quincyMainDashboard);
  }
  if (!searchParams.email) {
    return redirect(routeConsts.quincyMainDashboard);
  }

  const t: AuthPagesTrans<'verifyEmail'> = await getTranslations(
    'Auth.pages.verifyEmail',
  );
  const email = searchParams.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">{t('title')}</H2>
        </CardTitle>
        <CardDescription className="text-center">
          <P variant="info">{t('checkEmail')}</P>
          <div className="pb-4 pt-12">
            <P variant="info">{t('confirmAccount')}</P>
            <P variant="info" className="font-bold">
              {email}
            </P>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter />
    </Card>
  );
}
