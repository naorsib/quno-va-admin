import { getTranslations } from 'next-intl/server';

import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import { StaticRouteLink } from '@/components/static-route-link';
import { H2, H5, P } from '@/components/typography/text';
import { GradientButton } from '@/components/ui/gradient-button';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

import { BoxFieldsTrans, YourBenefitsInfoBox } from './your-benefits-info-box';

type BenefitTrans = GenericTrans<keyof typeof en.Landing.heros.yourBenefits>;

export default async function YourBenefitsHero() {
  const t: BenefitTrans = await getTranslations(`Landing.heros.yourBenefits`);
  const tBenefitBoxes: BoxFieldsTrans = await getTranslations(
    `Landing.heros.yourBenefits.boxes`,
  );
  return (
    <LandingHeroWrapper className="items-center bg-hero-lightgreen text-center">
      <H5 variant="bannerInfo">{t('description')}</H5>
      <H2 variant="landingPage" className="font-semibold">
        {t('title')}
      </H2>
      <P className="max-w-xl text-base/6">{t('subtitle')}</P>
      <div className="mt-3 flex grow flex-col gap-6 text-start lg:flex-row">
        <YourBenefitsInfoBox tr={tBenefitBoxes} boxName={'moreTime'} />
        <YourBenefitsInfoBox tr={tBenefitBoxes} boxName={'costSave'} />
        <YourBenefitsInfoBox tr={tBenefitBoxes} boxName={'timeSave'} />
      </div>
      <div className="mt-3 flex w-full flex-col items-center gap-2 lg:hidden">
        <StaticRouteLink routeTo="signUp" className="w-full">
          <GradientButton asChild additions="landingButton">
            <P>{t('buttonText')}</P>
          </GradientButton>
        </StaticRouteLink>
        <P className="text-xs">{t('buttonDisclaimer')}</P>
      </div>
    </LandingHeroWrapper>
  );
}
