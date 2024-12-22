import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '@/components/forms/signup-form';
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

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!user) {
    await supabase.auth.signOut();
  }

  const t: AuthPagesTrans<'signup'> =
    await getTranslations('Auth.pages.signup');

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
            buttonType="signup"
          ></GoogleAuthButton>
          <div className="flex flex-row items-center space-x-6 py-6">
            <div className="h-px grow bg-border-input"></div>
            <div className="flex-none text-lg text-label">{t('or')}</div>
            <div className="h-px grow bg-border-input"></div>
          </div>
        </div>
        <SignUpForm />
      </CardContent>
      <CardFooter className="justify-self-center">
        <p className="text text-lg text-black">
          {t('haveAnAccountText')}{' '}
          <Link
            className="font-medium underline hover:text-primary"
            href="/sign-in"
          >
            {t('haveAnAccountLinkText')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
