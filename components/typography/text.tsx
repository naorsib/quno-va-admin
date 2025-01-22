import { cva, VariantProps } from 'class-variance-authority';
import { Inter, Poppins, Roboto } from 'next/font/google';
import React from 'react';

import { cn } from '@/lib/utils';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});
const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const fontsMap = {
  inter: inter,
  poppins: poppins,
  roboto: roboto,
};

type TypographyComponentType = {
  fontFamily?: keyof typeof fontsMap;
};

type VariantMap = typeof variantsMap;
// Generic text prop
type TextProperty<T extends keyof VariantMap> = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> &
  VariantProps<VariantMap[T]> &
  TypographyComponentType;

type H1Props = TextProperty<'h1'>;
type H2Props = TextProperty<'h2'>;
type H3Props = TextProperty<'h3'>;
type H4Props = TextProperty<'h4'>;
type H5Props = TextProperty<'h5'>;
type H6Props = TextProperty<'h6'>;
type PProps = TextProperty<'p'>;

const h1Variants = cva('', {
  variants: {
    variant: {
      default: '',
      landingPage: 'text-4xl lg:text-5xl font-bold',
      innerPage: 'text-2xl font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
  ({ fontFamily = 'inter', className, variant, ...props }, ref) => {
    return (
      <h1
        className={cn(
          fontsMap[fontFamily].className,
          h1Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H1.displayName = 'H1';

const h2Variants = cva('', {
  variants: {
    variant: {
      default: 'font-semibold',
      card: `text-2xl lg:text-3xl ${fontsMap['inter'].className}`,
      landingPage: 'text-3xl/snug lg:text-4xl/normal font-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ fontFamily = 'poppins', className, variant, ...props }, ref) => {
    return (
      <h2
        className={cn(
          fontsMap[fontFamily].className,
          h2Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H2.displayName = 'H2';

const h3Variants = cva('', {
  variants: {
    variant: {
      default: 'font-semibold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(
  ({ fontFamily = 'poppins', className, variant, ...props }, ref) => {
    return (
      <h3
        className={cn(
          fontsMap[fontFamily].className,
          h3Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H3.displayName = 'H3';

const h4Variants = cva('', {
  variants: {
    variant: {
      default: 'font-semibold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H4 = React.forwardRef<HTMLHeadingElement, H4Props>(
  ({ fontFamily = 'poppins', className, variant, ...props }, ref) => {
    return (
      <h4
        className={cn(
          fontsMap[fontFamily].className,
          h4Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H4.displayName = 'H4';

const h5Variants = cva('', {
  variants: {
    variant: {
      default: '',
      bannerInfo:
        'text-sm lg:text-lg text-hero-description/75 tracking-description pb-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H5 = React.forwardRef<HTMLHeadingElement, H5Props>(
  ({ fontFamily = 'inter', className, variant, ...props }, ref) => {
    return (
      <h5
        className={cn(
          fontsMap[fontFamily].className,
          h5Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H5.displayName = 'H5';

const h6Variants = cva('', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const H6 = React.forwardRef<HTMLHeadingElement, H6Props>(
  ({ fontFamily = 'inter', className, variant, ...props }, ref) => {
    return (
      <h6
        className={cn(
          fontsMap[fontFamily].className,
          h6Variants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

H6.displayName = 'H6';

const pVariants = cva('', {
  variants: {
    variant: {
      default: '',
      info: 'text-base/6 lg:text-lg/6',
      textInButton: 'text-xl font-normal',
      sidebar: 'text-lg font-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const P = React.forwardRef<HTMLParagraphElement, PProps>(
  ({ fontFamily = 'inter', variant, className, ...props }, ref) => {
    return (
      <p
        className={cn(
          fontsMap[fontFamily].className,
          pVariants({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

P.displayName = 'P';

const variantsMap = {
  h1: h1Variants,
  h2: h2Variants,
  h3: h3Variants,
  h4: h4Variants,
  h5: h5Variants,
  h6: h6Variants,
  p: pVariants,
};

export { H1, H2, H3, H4, H5, H6, P };
