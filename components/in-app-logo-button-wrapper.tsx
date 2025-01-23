'use client';

import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

import { pauseDemo } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { routeConsts } from '@/consts/routing.const';

type Props = ComponentProps<'div'>;

export function InAppLogoButtonWrapper({
  children,
  className,
  ...props
}: Props) {
  const pathname = usePathname();
  const isDisabled = pathname.endsWith(routeConsts.quincyAiBase);

  return (
    <form className={isDisabled ? 'pointer-events-none' : ''}>
      <SubmitButton
        className={className}
        formAction={pauseDemo}
        variant="link"
        // eslint-disable-next-line unicorn/no-null
        pendingText={null}
      >
        {children}
      </SubmitButton>
    </form>
  );
}
