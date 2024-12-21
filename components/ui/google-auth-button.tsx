'use client';

// import { GoogleOAuthButton } from '@supabase/auth-ui-react'
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

export type GoogleButtonType = 'signin' | 'signup';

type Props = ComponentProps<'div'> & {
  buttonType: GoogleButtonType;
};

export function GoogleAuthButton({ buttonType, ...props }: Props) {
  const t = useTranslations('Auth.googleButton.text');
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${globalThis.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ''
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch {
      // TODO - Remove? If so - how do we notify?
      toast({
        title: 'There was an error logging in with Google.',
        description: 'please try again',
      });
      setIsGoogleLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="outline"
      additions="main"
      className="border-card-googleButton bg-white text-card-googleButton"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
    >
      {isGoogleLoading ? (
        <Icons.loaderCircle className="mr-2 size-6 animate-spin" />
      ) : (
        <Icons.google className="mr-2 size-10" />
      )}

      {t(buttonType)}
    </Button>
  );
}
