'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const cns =
  'inline-flex items-center justify-center border border-transparent rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=off]:bg-white data-[state=on]:text-accent-foreground data-[state=on]:border-primary-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2';

interface ToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  pressed: boolean;
}
const CustomToggleBox = React.forwardRef<HTMLDivElement, ToggleProps>(
  ({ pressed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-state={pressed ? 'on' : 'off'}
        className={cn(cns, props.className)}
      >
        {props.children}
      </div>
    );
  },
);

CustomToggleBox.displayName = 'CustomToggleBox';

export { CustomToggleBox };
