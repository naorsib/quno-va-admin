import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import hero from '@/assets/images/bookYourDemo-hero.png';
import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import { StaticRouteLink } from '@/components/static-route-link';
import { H2, H5, P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type BookTrans = GenericTrans<keyof typeof en.Landing.heros.bookYourDemo>;

export default async function BookYourDemoHero() {
  const t: BookTrans = await getTranslations(`Landing.heros.bookYourDemo`);

  return (
    <LandingHeroWrapper className="items-center bg-hero-lightbrown lg:bg-hero-white lg:pt-0">
      <div className="flex w-full flex-col gap-4 pb-20 lg:flex-row lg:pb-0">
        <div className="z-20 flex basis-3/5 flex-col items-start gap-2 text-start lg:pt-28">
          <H5 variant="bannerInfo">{t('description')}</H5>
          <div>
            <H2 variant="landingPage" className="max-w-2xl">
              <span className="font-semibold">{t('titlePart1')} - </span>{' '}
              {t('titlePart2')}
            </H2>
          </div>
          <P variant="info" className="mt-2 lg:my-4">
            {t('info')}
          </P>
          <div className="mt-12 hidden w-full flex-row items-center gap-5 lg:flex">
            <StaticRouteLink routeTo="signUp">
              <Button
                asChild
                className="h-fit w-56 rounded-2xl border border-primary bg-primary py-2.5 text-white"
                additions="landingButton"
              >
                <P>{t('buttonText')}</P>
              </Button>
            </StaticRouteLink>
            <StaticRouteLink routeTo="empty">
              <Button
                asChild
                className="border-primary-overlay h-fit w-56 rounded-2xl border bg-white py-2.5 text-primary hover:text-white"
                additions="landingButton"
              >
                <P>{t('button2Text')}</P>
              </Button>
            </StaticRouteLink>
          </div>
        </div>
        <div className="relative bottom-0 -mt-5 flex h-[500px] w-[120%] justify-center lg:absolute lg:-right-8 lg:left-auto lg:h-[125%] lg:w-[55%] lg:overflow-hidden">
          <div className="relative -ml-14 w-full flex-1 lg:ml-0 lg:h-[120%] lg:min-w-[auto] lg:flex-none">
            <Image
              fill={true}
              src={hero}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={t('imageAltText')}
              objectFit="contain"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 w-full px-4 pb-20 lg:hidden">
        <div className="flex w-full flex-col items-center gap-4 bg-hero-lightbrown">
          <StaticRouteLink routeTo="signUp" className="w-full">
            <GradientButton asChild additions="landingButton">
              <P>{t('buttonText')}</P>
            </GradientButton>
          </StaticRouteLink>
          <StaticRouteLink routeTo="empty" className="w-full">
            <Button
              asChild
              className="border-card-primary text-primary-overlay pointer-events-none h-fit w-full rounded-2xl border bg-white py-4 hover:text-white"
              additions="landingButton"
            >
              <P>{t('button2Text')}</P>
            </Button>
          </StaticRouteLink>
        </div>
      </div>
    </LandingHeroWrapper>
  );
}
