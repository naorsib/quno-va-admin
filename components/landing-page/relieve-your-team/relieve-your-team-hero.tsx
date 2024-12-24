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
    <LandingHeroWrapper className="items-center bg-hero-white lg:pt-0">
      <div className="flex w-full flex-col gap-4 pb-20 lg:flex-row lg:pb-0">
        <div className="z-20 flex basis-3/5 flex-col items-center gap-2 text-start lg:items-start lg:pt-32">
          <H5 variant="bannerInfo">{t('description')}</H5>
          <div className="my-2 flex flex-col items-center text-center lg:items-start lg:text-start">
            <H1 variant="landingPage">{t('title')}</H1>
            <H2 variant="landingPage" className="max-w-xl">
              {t('subtitle')}
            </H2>
            <P variant="info" className="my-2 lg:my-6">
              {t('info')}
            </P>
          </div>
          <div className="absolute bottom-8 left-0 z-10 -mt-5 w-full bg-hero-white px-4 pb-12 lg:relative lg:mt-12 lg:flex lg:bg-transparent lg:p-0">
            <div className="flex w-full flex-col items-stretch gap-2 text-center lg:flex-row lg:items-center lg:gap-4 lg:pr-20">
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
        <div className="relative bottom-0 -mb-8 -mt-5 flex h-[500px] w-[150%] justify-center self-center lg:absolute lg:-right-8 lg:left-auto lg:-mb-40 lg:h-[125%] lg:w-[55%] lg:overflow-hidden">
          <Image
            fill={true}
            src={hero}
            decoding="async"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={t('imageAltText')}
            objectFit="contain"
          />
        </div>
      </div>
    </LandingHeroWrapper>
  );
}
