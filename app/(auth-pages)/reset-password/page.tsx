import { getTranslations } from 'next-intl/server';

import { FormMessage, Message } from '@/components/form-message';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { StaticRouteLink } from '@/components/static-route-link';
import { H2, P } from '@/components/typography/text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { routeConsts } from '@/consts/routing.const';
import { GenericTrans } from '@/lib/utils';
import en from '@/messages/en.json';
import { createClient } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';

type ResetPasswordTrans = GenericTrans<
  keyof typeof en.Auth.pages.resetPassword
>;

export default async function ResetPasswordPage(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hrefToContinue = user?.phone_confirmed_at
    ? 'quincyMainDashboard'
    : 'verifyOtp';
  const t: ResetPasswordTrans = await getTranslations(
    'Auth.pages.resetPassword',
  );
  if (!user) {
    return encodedRedirect(
      'error',
      routeConsts.forgotPassword,
      t('expired_error'),
    );
  }

  const searchParams = await props.searchParams;
  const passwordUpdated = 'success' in searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">{t('title')}</H2>
        </CardTitle>
        <CardDescription>
          <P fontFamily="roboto" variant="info">
            {t(`${passwordUpdated ? 'passwordUpdatedInfo' : 'initialInfo'}`)}
          </P>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!passwordUpdated && (
          <>
            <ResetPasswordForm />
            <div className="w-fit justify-self-center pt-3">
              <FormMessage message={searchParams} />
            </div>
          </>
        )}
      </CardContent>

      <CardFooter>
        {passwordUpdated && (
          <StaticRouteLink
            className="font-medium underline hover:text-primary"
            routeTo={hrefToContinue}
          >
            {t('continue')}
          </StaticRouteLink>
        )}
      </CardFooter>
    </Card>
  );
}
