import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import hero from '@/assets/images/relieve-image.png';
import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import { StaticRouteLink } from '@/components/static-route-link';
import { H1, H2, H5, P } from '@/components/typography/text';
import { GradientButton } from '@/components/ui/gradient-button';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type RelieveTrans = GenericTrans<keyof typeof en.Landing.heros.relieveYourTeam>;

export default async function RelieveYourTeamHero() {
  const t: RelieveTrans = await getTranslations(
    `Landing.heros.relieveYourTeam`,
  );

  return (
    <LandingHeroWrapper className="items-center bg-hero-white lg:pr-0">
      <div className="mb-8 flex w-full flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-1 lg:basis-1/6 lg:flex-row">
          <div className="flex-col items-center gap-3 text-center lg:items-start lg:text-start">
            <H5 variant="bannerInfo">{t('description')}</H5>
            <div className="my-2 flex flex-col items-center lg:items-start">
              <H1 variant="landingPage">{t('title')}</H1>
              <H2 variant="landingPage" className="max-w-lg">
                {t('subtitle')}
              </H2>
              <P variant="info" className="my-2 lg:my-6">
                {t('info')}
              </P>
            </div>
            <div className="absolute bottom-8 left-0 z-10 -mt-5 w-full bg-hero-white px-4 pb-12 lg:relative lg:mt-12 lg:flex lg:p-0">
              <div className="w-full flex-row items-center gap-4 lg:flex lg:pr-20">
                <StaticRouteLink routeTo="signUp">
                  <GradientButton
                    asChild
                    className="-mt-5 lg:mt-0"
                    additions="landingButton"
                  >
                    <P>{t('buttonText')}</P>
                  </GradientButton>
                </StaticRouteLink>
                <P className="shrink-0 text-xs">{t('buttonDisclaimer')}</P>
              </div>
            </div>
          </div>
          <div className="relative -ml-8 h-[500px] w-[120%] self-center lg:-mr-32 lg:ml-0 lg:mt-40 lg:h-[190%] lg:basis-5/6">
            <Image
              fill={true}
              src={hero}
              decoding="async"
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={t('imageAltText')}
            />
          </div>
        </div>
      </div>
    </LandingHeroWrapper>
  );
}
