'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { resendOtp, verifyOtp } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { FormButtonsTrans } from '@/types/translations';

type Props = ComponentProps<'div'> & {
  phone: string;
};

export function OtpCodeForm({ phone, ...props }: Props) {
  const [value, setValue] = useState('');
  const [otpReady, setOtpReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const tb: FormButtonsTrans<'otp'> = useTranslations('Forms.buttons.otp');
  const onComplete = () => {
    setOtpReady(true);
  };
  const onResendClicked = async () => {
    setIsResending(true);
    const error = await resendOtp(phone);
    if (error) {
      // TODO - Toast? Error? Anyway - translate
      console.log('Error resending OTP!!', error);
    }
    setIsResending(false);
  };

  // TODO - Toast? Error? Anyway - translate
  const onSubmit = async () => {
    setIsVerifying(true);
    const error = await verifyOtp(value, phone);
    if (error) {
      console.log('wrong OTP!!');
      setIsVerifying(false);
    } else {
      console.log('correct OTP YAY! we should redirect here');
    }
  };

  return (
    <div className="grid gap-20">
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
        className="w-fit bg-card-button font-normal text-white"
        disabled={!otpReady}
        onClick={onSubmit}
        pendingText={tb('submitting')}
      >
        {tb('submit')}
      </SubmitButton>

      <Button
        disabled={isResending || isVerifying}
        className="w-fit cursor-pointer justify-self-center bg-transparent text-xs hover:bg-background hover:underline"
        onClick={onResendClicked}
      >
        {tb('resend')}
      </Button>
    </div>
  );
}
