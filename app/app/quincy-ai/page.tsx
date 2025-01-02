import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { startDemo } from '@/app/actions';
import { UserClinic } from '@/components/quincy-dashboard/user-clinic/user-clinic';
import { UserCallEvents } from '@/components/quincy-dashboard/user-services/user-call-events';
import { SubmitButton } from '@/components/submit-button';
import { H1, P } from '@/components/typography/text';
import { routeConsts } from '@/consts/routing.const';
import { InnerPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export default async function QuincyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_id = user?.id as string;
  const t: InnerPagesTrans<'quincy'> =
    await getTranslations(`InnerPages.quincy`);

  const { data } = await supabase
    .from('user_base_details')
    .select('user_demo_status_type_id')
    .eq('id', user_id)
    .limit(1)
    .single();

  const demoPaused = data?.user_demo_status_type_id === 'paused';
  if (data?.user_demo_status_type_id && !demoPaused) {
    return redirect(routeConsts.quincyDemo);
  }

  return (
    // max-h-[calc(100vh-64px)]
    <div className="flex flex-col">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-4 py-10 lg:max-h-none lg:pb-4">
        <div className="flex w-full flex-row items-center justify-between">
          <H1 variant="innerPage">{t('title')}</H1>

          <form className="hidden lg:block">
            <SubmitButton
              variant="secondary"
              formAction={startDemo}
              pendingType="loader"
            >
              <P className="font-normal">
                {t(demoPaused ? 'continueDemoButton' : 'startDemoButton')}
              </P>
            </SubmitButton>
          </form>
        </div>
        <UserClinic user_id={user_id} t={t} />
        <UserCallEvents user_id={user_id} />
      </div>

      <form className="sticky bottom-3.5 lg:hidden">
        <SubmitButton
          formAction={startDemo}
          pendingType="loader"
          variant="secondary"
          className="h-14 w-full"
        >
          <P className="font-normal">
            {t(demoPaused ? 'continueDemoButton' : 'startDemoButton')}
          </P>
        </SubmitButton>
      </form>
    </div>
  );
}
