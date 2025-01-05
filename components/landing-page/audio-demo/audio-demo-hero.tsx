import { getTranslations } from 'next-intl/server';

import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import CircularSVGAnimation from '@/components/react-svg-components/circular-svg-animation';
import { StaticRouteLink } from '@/components/static-route-link';
import { H2, H5, P } from '@/components/typography/text';
import AudioBar from '@/components/ui/audio-captions-player/audio-bar';
import { GradientButton } from '@/components/ui/gradient-button';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type AudioDemoTrans = GenericTrans<keyof typeof en.Landing.heros.audioDemo>;

export default async function AudioDemoHero() {
  const t: AudioDemoTrans = await getTranslations(`Landing.heros.audioDemo`);

  return (
    <LandingHeroWrapper className="items-center bg-primary">
      <div className="z-10 flex w-full flex-col">
        <div className="flex flex-col items-start text-start">
          <H5 variant="bannerInfo" className="text-border">
            {t('description')}
          </H5>
          <div className="max-w-3xl text-white">
            <H2 variant="landingPage" className="font-semibold">
              {t('title')}
            </H2>
            <P variant="info" className="mt-2 lg:my-4">
              {t('subtitle')}
            </P>
          </div>
        </div>
        <AudioBar
          showSliderAndPlay={process.env.NODE_ENV === 'development'}
        ></AudioBar>

        <StaticRouteLink
          routeTo="signUp"
          className="mt-2 w-full lg:mt-8 lg:w-1/2 lg:self-center"
        >
          <GradientButton asChild additions="landingButton">
            <P>{t('buttonText')}</P>
          </GradientButton>
        </StaticRouteLink>
      </div>
      <CircularSVGAnimation />
    </LandingHeroWrapper>
  );
}
