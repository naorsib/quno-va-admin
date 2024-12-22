import { getTranslations } from 'next-intl/server';

import { FormMessage, Message } from '@/components/form-message';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { H2, P } from '@/components/typography/text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export default async function ForgotPasswordPage(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const t: AuthPagesTrans<'forgotPassword'> = await getTranslations(
    `Auth.pages.forgotPassword`,
  );
  const searchParams = await props.searchParams;
  const emailSent = 'success' in searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <H2 variant="card">{t('title')}</H2>
        </CardTitle>
        <CardDescription>
          <P fontFamily="roboto" variant="info">
            {t(`${emailSent ? 'initialInfo' : 'emailSentInfo'}`)}
          </P>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSent && (
          <>
            <ForgotPasswordForm />
            <div className="w-fit justify-self-center pt-3">
              <FormMessage message={searchParams} />
            </div>
          </>
        )}
      </CardContent>

      <CardFooter />
    </Card>
  );
}
