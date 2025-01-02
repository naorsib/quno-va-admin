import { getTranslations } from 'next-intl/server';

import { P } from '@/components/typography/text';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogsTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

export async function ThankYouDialog({
  should_show,
}: {
  should_show: boolean;
}) {
  const supabase = await createClient();
  const t: DialogsTrans<'thank_you'> =
    await getTranslations(`Dialogs.thank_you`);
  return (
    should_show && (
      <Dialog defaultOpen={true}>
        <DialogContent aria-describedby={t('dialogSubtitle')}>
          <div className="mt-1 flex flex-col items-center gap-3 text-center">
            <div className="text-5xl">🙌</div>
            <DialogTitle>
              <P className="text-base font-bold"> {t('dialogTitle')}</P>
            </DialogTitle>

            <DialogDescription className="hidden">
              {t('dialogSubtitle')}
            </DialogDescription>
            <P className="text-base/6">{t('dialogSubtitle')}</P>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
