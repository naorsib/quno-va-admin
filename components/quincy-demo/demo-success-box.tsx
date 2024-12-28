import { QuincyDemoPropsBase } from '@/app/app/quincy-ai/demo/page';
import PhoneSvgComponent from '@/components/react-svg-components/phone';
import { P } from '@/components/typography/text';
import { parsePhone } from '@/utils/utils';

type Props = QuincyDemoPropsBase & { phone: string };

export async function DemoSuccessBox({ phone, requested_contract, t }: Props) {
  return (
    <>
      <div className="flex w-full flex-col items-center gap-4 rounded border border-successDark bg-successLight px-10 py-5">
        {requested_contract ? (
          <>
            <PhoneSvgComponent />
            <div className="text-center">
              <P className="text-base/6 font-bold">{t('contractRequested')}</P>
              <P className="text-base/6">{t('contractRequestedInfo')}</P>
            </div>
          </>
        ) : (
          <>
            <PhoneSvgComponent />
            <div className="text-center">
              <P className="text-base/6 font-bold">{t('innerBoxText1')}</P>
              <P className="text-base/6">{t('innerBoxText2')}</P>
            </div>
            <P fontFamily="roboto" className="text-2xl font-bold">
              +{parsePhone(phone)}
            </P>
          </>
        )}
      </div>
    </>
  );
}
