'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { sleep } from 'retell-sdk/core';

import { ForgotPasswordFormData } from '@/components/forms/forgot-password-form';
import { ResetPasswordFormData } from '@/components/forms/reset-password-form';
import { SigninFormData } from '@/components/forms/signin-form';
import { SignupFormData } from '@/components/forms/signup-form';
import { UserSignupDetails } from '@/components/forms/verify-otp-form';
import {
  COULD_NOT_RESET_PASSWORD,
  EMAIL_NOT_CONFIRMED,
  OTP_DISABLED,
  PASSWORD_UPDATE_FAILED,
  SAME_PASSWORD,
  UNEXPECTED_ERROR,
} from '@/consts/erroring.const';
import { routeConsts } from '@/consts/routing.const';
import { FormFieldsTrans } from '@/lib/validations';
import { ErrorsTrans } from '@/types/translations';
import { createAdminClient } from '@/utils/supabase/admin-server';
import { createClient } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';

import { end_call } from './random-call-events-actions';

const MAX_RESEND_ALLOWED = 10;
const RESEND_COOLDOWN_MINUTES = 15;

const transformPhone = (phone: string) => {
  return phone.replaceAll(/^0{1}/g, '');
};

const phoneExistsErrorCode = 'phone_exists';

export const signUpAction = async (formData: SignupFormData) => {
  const first_name = formData.first_name;
  const last_name = formData.last_name;
  const email = formData.email;

  const password = formData.password;
  const country_code = formData.country_code;
  const phone = `${country_code}${transformPhone(formData.phone)}`;

  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name, last_name, phone },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  return redirect(`${routeConsts.verifyEmail}?email=${user?.email}`);
};

export const signInAction = async (formData: SigninFormData) => {
  const email = formData.email;
  const password = formData.password;
  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code == EMAIL_NOT_CONFIRMED) {
      return redirect(`${routeConsts.verifyEmail}?email=${user?.email}`);
    }
    return encodedRedirect('error', routeConsts.signIn, error.message);
  }
  if (!user?.email_confirmed_at) {
    return redirect(`${routeConsts.verifyEmail}?email=${user?.email}`);
  }
  if (!user?.phone_confirmed_at) {
    return redirect(routeConsts.verifyOtp);
  }
  return redirect(routeConsts.quincyDashboard);
};

export const signUpWithAuth = async () => {
  const supabase = await createClient();
  const next = '';

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
};

export const updateUser = async (formData: UserSignupDetails) => {
  const first_name = formData.first_name;
  const last_name = formData.last_name;
  const country_code = formData.country_code;
  const phone = `${country_code}${transformPhone(formData.phone)}`;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    phone,
    data: { first_name, last_name, phone },
  });
  return error;
};

const sendPhoneOtpCommon = async (phone: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const number_of_resends = (user?.user_metadata.num_of_resends || 0) + 1;
  const last_otp_sent = new Date().toISOString();
  supabase.auth.updateUser({
    data: { last_otp_sent, num_of_resends: number_of_resends },
  });

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: false,
    },
  });
  // console.log("error:", error);
  // console.log("error.code", error?.code);
  // TODO - Handle when we have Pro account
  if (!error || error.code == OTP_DISABLED) {
    // Advanced MFA needs to be enabled (Pro account).
    // That's why we get 'otp_disabled' and it still sends out sms, currnetly surpressing this error code
    return;
  }

  return error;
};

export const resendOtp = async (phone: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    phone,
    data: { phone },
  });

  if (!!error) {
    // Faking success in order to not reveal the existence of the phone to the user
    console.log(JSON.stringify(error));
    return;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tErrors: ErrorsTrans = await getTranslations('Errors');

  if (user?.user_metadata.last_otp_sent) {
    const now = new Date();
    const last_otp_sent = new Date(user.user_metadata.last_otp_sent);
    const timeDifference = now.getTime() - last_otp_sent.getTime();
    if (timeDifference < RESEND_COOLDOWN_MINUTES * 60 * 1000) {
      return tErrors('resend_cooldown', { RESEND_COOLDOWN_MINUTES });
    }
  }
  if (user?.user_metadata.num_of_resends >= MAX_RESEND_ALLOWED) {
    return tErrors('resend_limit');
  }

  const error_ = await sendPhoneOtpCommon(phone);
  if (error_) {
    return tErrors('unexpected_error_otp');
  }
};

export const sendPhoneOtp = async (formData: UserSignupDetails) => {
  const user_update_error = await updateUser(formData);
  if (!!user_update_error) {
    if (user_update_error.code == phoneExistsErrorCode) {
      // Faking success in order to not reveal the existence of the phone to the user
      return encodedRedirect('success', routeConsts.verifyOtp, 'true');
    }
    return encodedRedirect(
      'error',
      routeConsts.verifyOtp,
      'Could not send otp code',
    );
  }
  const country_code = formData.country_code;
  const phone = `${country_code}${transformPhone(formData.phone)}`;

  const error = await sendPhoneOtpCommon(phone);

  if (!error) {
    return encodedRedirect('success', routeConsts.verifyOtp, 'true');
  }
  return encodedRedirect('error', routeConsts.verifyOtp, error.message);
};

export const verifyOtp = async (token: string, phone: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect('error', routeConsts.verifyOtp, UNEXPECTED_ERROR);
  }
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    phone,
    type: 'phone_change',
    token,
  });

  if (error) {
    return encodedRedirect('error', routeConsts.verifyOtp, error.message);
  }
  const supabase_admin = await createAdminClient();
  // const sb_admin = await createAdminClient();
  const result = await supabase_admin.from('user_base_details').insert({
    id: user.id,
    first_name: user.user_metadata.first_name,
    last_name: user.user_metadata.last_name,
    email: user.user_metadata.email,
    phone: user.user_metadata.phone,
  });
  console.log('result:', result);
  if (result.error) {
    return encodedRedirect('error', routeConsts.verifyOtp, UNEXPECTED_ERROR);
  }

  return redirect(routeConsts.youAreReady);
};

export const forgotPasswordAction = async (
  formData: ForgotPasswordFormData,
) => {
  const email = formData.email;

  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'testpass',
  });
  // console.log("error", error);
  // console.log("data.user:", data.user);
  // TODO - Test when confirm_phone is enabled (only possible in Pro account)
  // User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
  // if (data.user && data.user.identities && data.user.identities.length === 0) {
  //   console.log("TESSSSSSST!!!!!");
  //   authError = {
  //     name: "AuthApiError",
  //     message: "User already exists",
  //   };
  //   console.log("data.user:", data.user);
  //   return encodedRedirect("success", "/forgot-password", "true");
  // }
  // console.log("data.user:", data.user?.app_metadata.providers);

  const dataReset = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=${routeConsts.resetPassword}`,
  });
  // console.log("dataReset", dataReset);
  if (dataReset.error) {
    console.error(dataReset.error.message);
    const tErrors: ErrorsTrans = await getTranslations('Errors');

    return encodedRedirect(
      'error',
      routeConsts.forgotPassword,
      tErrors(COULD_NOT_RESET_PASSWORD),
    );
  }

  return encodedRedirect('success', routeConsts.forgotPassword, 'true');
};

export const resetPasswordAction = async (formData: ResetPasswordFormData) => {
  const supabase = await createClient();

  const password = formData.newPassword;
  //const confirmPassword = formData.get('confirmPassword') as string;

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    const tErrors: ErrorsTrans = await getTranslations('Errors');
    if (error.code == SAME_PASSWORD) {
      encodedRedirect(
        'error',
        routeConsts.resetPassword,
        tErrors(SAME_PASSWORD),
      );
    } else {
      encodedRedirect(
        'error',
        routeConsts.resetPassword,
        tErrors(PASSWORD_UPDATE_FAILED),
      );
    }
  }

  encodedRedirect('success', routeConsts.resetPassword, 'true');
};

export const pauseDemo = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_id = user?.id as string;
  const { error } = await supabase
    .from('user_base_details')
    .update({ user_demo_status_type_id: 'paused' })
    .eq('id', user_id);

  // end call if exists
  return await sleep(500).then(async () => {
    // TODO - move to trigger function
    await end_call(false);
    return redirect(routeConsts.quincyAiBase);
  });
};

export const requestContract = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_id = user?.id as string;
  const { error } = await supabase
    .from('user_base_details')
    .update({ user_demo_status_type_id: 'finished' })
    .eq('id', user_id);
  // end call if exists

  return await sleep(1000).then(async () => {
    // TODO - move to trigger function
    await end_call();
    return redirect(`${routeConsts.quincyDemo}?requested=true`);
  });
};
export const redirectToDemo = async () => {
  return redirect(routeConsts.quincyDemo);
};
export const startDemo = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_id = user?.id as string;

  const { data: clinic_details } = await supabase
    .from('user_base_details')
    .select('clinic_name, address, clinic_type_id')
    .eq('id', user_id)
    .limit(1)
    .single();

  const tFields: FormFieldsTrans = await getTranslations('Forms.fields');

  const updateObject = Object.assign(
    {},
    { user_demo_status_type_id: 'ongoing' },
  );
  if (!clinic_details?.clinic_name) {
    Object.assign(updateObject, {
      clinic_name: tFields('clinic_name_placeholder'),
    });
  }
  if (!clinic_details?.address) {
    Object.assign(updateObject, { address: tFields('address_placeholder') });
  }

  const { error } = await supabase
    .from('user_base_details')
    .update(updateObject)
    .eq('id', user_id);

  return error
    ? redirect(routeConsts.signIn)
    : redirect(routeConsts.quincyDemo);
  // const supabase_admin = await createAdminClient();
  // const existingNonDeletedDemo = await supabase_admin
  //   .from('demo_service_phone_assignments')
  //   .select('id, is_deleted')
  //   .eq('is_deleted', false)
  //   .eq('assigned_to', userId)
  //   .limit(1)
  //   .maybeSingle();

  // this should never happen unless the user is trying to be malicious
  // if (existingNonDeletedDemo.data) {
  //   return redirect(routeConsts.quincyDemo);
  // }
  // // get a non-assigned phone or the longest assigned one
  // const { data: phone_assignment, error: phone_assignment_err } =
  //   await supabase_admin
  //     .from('demo_service_phone_assignments')
  //     .select('id, phone, assigned_at')
  //     .eq('is_deleted', false)
  //     .order('assigned_at', {
  //       nullsFirst: true,
  //       ascending: true,
  //     })
  //     .limit(1)
  //     .single();
  // console.log(phone_assignment);
  // console.log(phone_assignment_err);
  // if (phone_assignment) {
  //   const assigned_at = new Date().toISOString();

  //   if (phone_assignment.assigned_at == undefined) {
  //     // update existing non-assigned phone record
  //     const res = await supabase
  //       .from('demo_service_phone_assignments')
  //       .update({
  //         assigned_at,
  //         assigned_to: userId,
  //       })
  //       .eq('id', phone_assignment.id);
  //   } else {
  //     // soft-delete existing phone assignment record
  //     // await supabase_admin
  //     //   .from('demo_service_phone_assignments')
  //     //   .update({ is_deleted: true })
  //     //   .eq('id', phone_assignment.id);

  //     // create a new assignment record
  //     await supabase_admin
  //       .from('demo_service_phone_assignments')
  //       .insert({
  //         phone: phone_assignment.phone,
  //         assigned_at,
  //         assigned_to: userId,
  //       })
  //       .eq('id', phone_assignment.id);
  //   }
  //   return redirect(routeConsts.quincyDemo);
  // } else {
  //   // this can never happen

  //   return redirect(routeConsts.signIn);
  // }
};

export const handleSignInWithGoogle = async (response: any) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  });
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(routeConsts.baseUrl);
};
