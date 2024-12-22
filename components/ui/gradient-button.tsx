import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'h-16 w-full rounded-lg bg-buttonGradient p-1 shadow-lg',
          className,
        )}
      >
        <Button
          className="h-full w-full bg-primary text-white"
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  },
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
