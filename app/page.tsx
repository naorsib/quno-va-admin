import { getTranslations } from 'next-intl/server';

import AudioDemoHero from '@/components/landing-page/audio-demo/audio-demo-hero';
import BookYourDemo from '@/components/landing-page/book-your-demo/book-your-demo-hero';
import EasySetting from '@/components/landing-page/easy-setting/easy-setting-hero';
import RelieveYourTeam from '@/components/landing-page/relieve-your-team/relieve-your-team-hero';
import YourBenefits from '@/components/landing-page/your-benefits-hero/your-benefits-hero';
import LogoSvgComponent from '@/components/react-svg-components/logo';
import { StaticRouteLink } from '@/components/static-route-link';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type HeaderTrans = GenericTrans<keyof typeof en.Landing.header>;

export default async function Index() {
  const t: HeaderTrans = await getTranslations(`Landing.header`);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 z-20 flex h-24 w-full justify-center border-b bg-white lg:h-16 lg:border-b-0',
          `h-${process.env.HEADER_HEIGHT_MOBILE} lg:h-${process.env.HEADER_HEIGHT}`,
        )}
      >
        <div className="flex w-full items-center justify-center p-7 px-10 lg:justify-between lg:px-20 lg:py-3">
          <div className="flex items-center gap-5 font-semibold">
            <LogoSvgComponent
              desc={t('logoDesc')}
              className="self-center text-primary"
            />
          </div>

          <StaticRouteLink routeTo="signUp">
            <Button
              className="hidden h-12 border border-primary bg-card-button px-4 py-3 text-lg font-normal text-white lg:flex"
              asChild
            >
              <P>{t('requestDemoButton')}</P>
            </Button>
          </StaticRouteLink>
        </div>
      </nav>
      <div
        className={cn(
          'w-full',
          `mt-${process.env.HEADER_HEIGHT_MOBILE} lg:mt-${process.env.HEADER_HEIGHT}`,
        )}
      >
        <RelieveYourTeam />
        <AudioDemoHero />
        <YourBenefits />
        <EasySetting />
        <BookYourDemo />
      </div>
    </>
  );
}
