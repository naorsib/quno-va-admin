import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { signOutAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { OtpCodeForm } from '@/components/forms/otp-code-form';
import { VerifyOtpForm } from '@/components/forms/verify-otp-form';
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
import { AuthPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export default async function VerifyOtpPage(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(routeConsts.signIn);
  }

  if (!!user.phone_confirmed_at) {
    return redirect(routeConsts.quincyMainDashboard);
  }

  const searchParams = await props.searchParams;
  const verifyOtpSent = 'success' in searchParams;

  const t: AuthPagesTrans<'verifyOtp'> = await getTranslations(
    'Auth.pages.verifyOtp',
  );
  let first_name = user.user_metadata.first_name;
  let last_name = user.user_metadata.last_name || '';
  if (!first_name) {
    const full_name = user.user_metadata.full_name as string;
    const lastSpaceInd = full_name.lastIndexOf(' ');
    if (lastSpaceInd == -1) {
      first_name = full_name;
    } else {
      first_name = full_name.slice(0, Math.max(0, lastSpaceInd)).trim();
      last_name = full_name.slice(Math.max(0, lastSpaceInd + 1)).trim();
    }
  }

  let phone = (user.phone || user.user_metadata.phone || '') as string;

  const country_code = phone.length > 0 ? phone.slice(0, 2) : '49';

  // remove country code
  phone = phone.slice(2);

  const signupDetails = {
    country_code,
    first_name,
    last_name,
    phone,
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">
            {t(`${verifyOtpSent ? 'otpSent' : 'initialTitle'}`)}
          </H2>
        </CardTitle>
        <CardDescription className="text-center">
          {verifyOtpSent ? (
            <>
              <P variant="info">{t('checkPhone')}</P>
              <div className="pb-4 pt-12">
                <P variant="info">{t('confirmAccount')}</P>
                <P variant="info" className="font-bold">
                  {user.phone}
                </P>
              </div>
            </>
          ) : (
            <P variant="info">{t('verifyAndAdd')}</P>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!verifyOtpSent && (
          <>
            <VerifyOtpForm signupDetails={signupDetails}></VerifyOtpForm>
            <div className="w-fit justify-self-center pt-3">
              <FormMessage message={searchParams} />
            </div>
          </>
        )}
        {verifyOtpSent && <OtpCodeForm phone={`${country_code}${phone}`} />}
      </CardContent>
      <CardFooter>
        <Button
          className="w-fit cursor-pointer bg-transparent text-xs hover:bg-background hover:underline"
          formAction={signOutAction}
        >
          {t('signInDifferent')}
        </Button>
      </CardFooter>
    </Card>
  );
}
