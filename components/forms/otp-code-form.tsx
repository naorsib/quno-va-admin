'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { resendOtp, verifyOtp } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { P } from '@/components/typography/text';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  AuthPagesTrans,
  ErrorsTrans,
  FormButtonsTrans,
} from '@/types/translations';

type Props = ComponentProps<'div'> & {
  phone: string;
};

export function OtpCodeForm({ phone, ...props }: Props) {
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpReady, setOtpReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const tb: FormButtonsTrans<'otp'> = useTranslations('Forms.buttons.otp');
  const tErrors: ErrorsTrans = useTranslations('Errors');

  const t: AuthPagesTrans<'verifyOtp'> = useTranslations(
    'Auth.pages.verifyOtp',
  );

  const onComplete = () => {
    setOtpReady(true);
  };
  const onResendClicked = async () => {
    setErrorMessage('');
    setIsResending(true);
    const error = await resendOtp(phone);
    if (error) {
      setErrorMessage(error);
    }
    setIsResending(false);
  };

  const onSubmit = async () => {
    setErrorMessage('');
    setIsVerifying(true);

    const error = await verifyOtp(value, phone);
    if (error) {
      setErrorMessage(tErrors('wrong_otp'));
    }
    setIsVerifying(false);
  };

  return (
    <div className="grid gap-1">
      <InputOTP
        disabled={isResending || isVerifying}
        onChange={(value: string): void => {
          setValue(value);
        }}
        onComplete={onComplete}
        pattern={REGEXP_ONLY_DIGITS}
        maxLength={6}
        value={value}
        autoFocus
      >
        <InputOTPGroup className="w-full justify-center gap-3">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <SubmitButton
        additions="main"
        className="mt-12 w-fit bg-card-button font-normal text-white"
        disabled={!otpReady}
        onClick={onSubmit}
        pendingText={tb('submitting')}
      >
        {tb('submit')}
      </SubmitButton>

      <P fontFamily="roboto" className="text-disclaimer text-center text-base">
        {t('otpDisclaimer')}
      </P>
      <button
        disabled={isResending || isVerifying}
        className="w-fit cursor-pointer justify-self-center bg-transparent text-xs hover:bg-background hover:underline"
        onClick={onResendClicked}
      >
        <P fontFamily="roboto" className="text-disclaimer text-lg">
          {tb('resend')}
        </P>
      </button>
      <P className="text-center text-xs text-destructive">{errorMessage}</P>
    </div>
  );
}
