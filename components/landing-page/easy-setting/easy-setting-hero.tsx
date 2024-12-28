import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import hero from '@/assets/images/easysetting-hero.png';
import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import { H2, H5, P } from '@/components/typography/text';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

import { BoxFieldsTrans, EasySettingsInfoBox } from './easy-settings-info-box';

type BenefitTrans = GenericTrans<keyof typeof en.Landing.heros.easySetting>;

export default async function EasySettingHero() {
  const t: BenefitTrans = await getTranslations(`Landing.heros.easySetting`);
  const tEasySettingsBoxes: BoxFieldsTrans = await getTranslations(
    `Landing.heros.easySetting.boxes`,
  );

  return (
    <LandingHeroWrapper className="items-center bg-hero-lightbrown text-center">
      <H5 variant="bannerInfo" className="z-10">
        {t('description')}
      </H5>
      <H2 variant="landingPage" className="z-10 max-w-xl font-semibold">
        {t('title')}
      </H2>
      <P className="z-10 max-w-xl text-base/6 lg:mb-4">{t('subtitle')}</P>
      <div className="relative -mb-20 -mt-4 flex h-[500px] w-[200%] sm:mt-0 lg:absolute lg:left-[-300px] lg:m-0 lg:h-full lg:w-4/5">
        <Image
          fill={true}
          src={hero}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={t('imageAltText')}
          className="object-contain"
        />
      </div>

      <div className="z-10 my-2 flex w-full max-w-[600px] grow flex-col gap-4 text-start lg:w-3/5 lg:gap-6 lg:self-end">
        <EasySettingsInfoBox
          tr={tEasySettingsBoxes}
          boxName="setUpSystem"
          number={1}
        />
        <EasySettingsInfoBox
          tr={tEasySettingsBoxes}
          boxName="testIt"
          number={2}
        />
        <EasySettingsInfoBox
          tr={tEasySettingsBoxes}
          boxName="setUpPhone"
          number={3}
        />
      </div>
    </LandingHeroWrapper>
  );
}
