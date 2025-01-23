import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import hero_v1 from '@/assets/images/easysetting-hero.png';
import hero_v2 from '@/assets/images/octopus_tasks.png';
import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import { H2, H5, P } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

import { BoxFieldsTrans, EasySettingsInfoBox } from './easy-settings-info-box';

type BenefitTrans = GenericTrans<keyof typeof en.Landing.heros.easySetting>;

const herosMap = {
  v1: hero_v1,
  v2: hero_v2,
};

export default async function EasySettingHero() {
  const t: BenefitTrans = await getTranslations(`Landing.heros.easySetting`);
  const tEasySettingsBoxes: BoxFieldsTrans = await getTranslations(
    `Landing.heros.easySetting.boxes`,
  );
  const iv = (process.env.ILLUSTRATION_VERSION || '1') as '1' | '2';

  return (
    <LandingHeroWrapper className="items-center bg-hero-lightbrown text-center">
      <H5 variant="bannerInfo" className="z-10">
        {t('description')}
      </H5>
      <H2 variant="landingPage" className="z-10 max-w-xl font-semibold">
        {t('title')}
      </H2>
      <P className="z-10 max-w-xl text-base/6 lg:mb-4">{t('subtitle')}</P>
      <div
        className={cn(
          'relative -mb-20 -mt-4 flex h-[500px] w-[200%] sm:mt-0 lg:absolute lg:m-0 lg:h-full lg:w-4/5',
          iv === '1' ? 'lg:left-[-300px]' : 'lg:right-[-200px]',
        )}
      >
        <Image
          fill={true}
          src={herosMap[`v${iv}`]}
          decoding="async"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={t('imageAltText')}
          className="object-contain"
        />
      </div>

      <div
        className={cn(
          'z-10 my-2 flex w-full max-w-[600px] grow flex-col gap-4 text-start lg:w-3/5 lg:gap-6',
          iv === '1' ? 'lg:self-end' : 'lg:self-start',
        )}
      >
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
