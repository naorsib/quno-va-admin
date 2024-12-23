import { QuincyDemoPropsBase } from '@/app/app/quincy-ai/demo/page';
import LoaderSvgComponent from '@/components/react-svg-components/loader';
import { P } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';

export async function DemoCall({ contract_requested, t }: QuincyDemoPropsBase) {
  const supabase = await createClient();

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2.5 rounded-[40px] bg-border px-4 py-3 lg:px-6 lg:py-4',
        contract_requested ? 'hidden' : '',
      )}
    >
      <LoaderSvgComponent className="animate-loader-spin" />
      <P className="text-base text-label lg:text-lg">
        {t('waitingForCallsButton')}
      </P>
    </div>
  );
}
