import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type Props = ComponentProps<'div'>;

export function LandingHeroWrapper({ ...props }: Props) {
  return (
    <div
      className={cn(
        'relative z-10 w-full',
        'flex flex-col gap-3',
        'px-3 pb-8 pt-12 lg:p-20',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
