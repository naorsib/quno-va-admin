import Link from 'next/link';
import { ComponentProps } from 'react';

import { routeConsts } from '@/costs/routing.const';
import { cn } from '@/lib/utils';

const emptyLinkKey = 'empty';

type PropsNoHref = Omit<
  ComponentProps<typeof Link> & {
    routeTo: keyof typeof routeConsts | typeof emptyLinkKey;
  },
  'href'
>;

export function StaticRouteLink({
  routeTo,
  className,
  children,
  ...props
}: PropsNoHref) {
  const isEmptyLink = routeTo == emptyLinkKey;
  const routeHref = isEmptyLink ? '#' : routeConsts[routeTo];

  return (
    <Link
      href={routeHref}
      className={cn(className, isEmptyLink ? 'pointer-events-none' : '')}
      {...props}
    >
      {children}
    </Link>
  );
}
