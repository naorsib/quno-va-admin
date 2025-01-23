'use client';

import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

import LoaderSvgComponent from './react-svg-components/loader';

type PendingType = 'text' | 'loader';
type Props = ComponentProps<typeof Button> & {
  // pass "null" to keep original content (default button behavior)
  pendingText?: string | null;
  pendingType?: PendingType;
};

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  pendingType = 'text',
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      {...props}
      disabled={props.disabled || pending}
    >
      {pending ? (
        pendingType === 'text' ? (
          pendingText || children
        ) : (
          <div className="relative flex w-fit items-center justify-center">
            <div className="invisible">{children}</div>
            <div className="absolute">
              <LoaderSvgComponent />
            </div>
          </div>
        )
      ) : (
        children
      )}
    </Button>
  );
}
