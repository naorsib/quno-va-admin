import { getTranslations } from 'next-intl/server';

import LogoSvgComponent from '@/components/react-svg-components/logo';
import { StaticRouteLink } from '@/components/static-route-link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations(`Landing.header`);

  return (
    <div className="h-screen w-full overflow-auto bg-primary">
      <div className="flex flex-col items-start items-center gap-12 p-2 pt-9 md:px-6">
        <StaticRouteLink routeTo="baseUrl">
          <LogoSvgComponent
            desc={t('logoDesc')}
            className="text-white lg:self-start"
          />
        </StaticRouteLink>
        {children}
      </div>
    </div>
  );
}
