import { getTranslations } from 'next-intl/server';

import { FormMessage, Message } from '@/components/form-message';
import { SignInForm } from '@/components/forms/signin-form';
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
import { GoogleAuthButton } from '@/components/ui/google-auth-button';
import { AuthPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export default async function SigninPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const t: AuthPagesTrans<'signin'> =
    await getTranslations(`Auth.pages.signin`);

  const supabase = await createClient();

  await supabase.auth.signOut();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">{t('title')}</H2>
        </CardTitle>
        <CardDescription>
          <P variant="info">{t('subtitle')}</P>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid">
          <GoogleAuthButton
            className="align-center"
            buttonType="signin"
          ></GoogleAuthButton>
          <div className="flex flex-row items-center space-x-6 py-6">
            <div className="h-px grow bg-border-input"></div>
            <div className="flex-none text-lg text-label">{t('or')}</div>
            <div className="h-px grow bg-border-input"></div>
          </div>
        </div>
        <SignInForm />
        <div className="w-fit justify-self-center pt-3">
          <FormMessage message={searchParams} />
        </div>
      </CardContent>
      <CardFooter className="justify-self-center">
        <P className="text-lg text-black">
          {t('haveAnAccountText')}{' '}
          <StaticRouteLink
            className="font-medium underline hover:text-secondary"
            routeTo="signUp"
          >
            {t('haveAnAccountLinkText')}
          </StaticRouteLink>
        </P>
      </CardFooter>
    </Card>
  );
}
