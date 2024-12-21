"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { errorConsts } from "@/costs/erroring.const";
import { routeConsts } from "@/costs/routing.const";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

const phoneExistsErrorCode = "phone_exists";

export const signUpAction = async (formData: FormData) => {
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;

  const password = formData.get("password") as string;
  const country_code = formData.get("country_code") as string;
  const phone = `${country_code}${formData.get("phone") as string}`;

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

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

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code == errorConsts.emailNotConfirmed) {
      return redirect(`${routeConsts.verifyEmail}?email=${user?.email}`);
    }
    return encodedRedirect("error", routeConsts.signIn, error.message);
  }
  if (!user?.email_confirmed_at) {
    return redirect(`${routeConsts.verifyEmail}?email=${user?.email}`);
  }
  if (!user?.phone_confirmed_at) {
    return redirect(routeConsts.verifyOtp);
  }
  return redirect(routeConsts.quincyMainDashboard);
};

export const signUpWithAuth = async () => {
  const supabase = await createClient();
  const next = "";

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${globalThis.location.origin}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`,
    },
  });
  if (error) {
    throw error;
  }
};

export const updateUser = async (formData: FormData) => {
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const country_code = formData.get("country_code") as string;
  const phone = `${country_code}${formData.get("phone") as string}`;

  console.log("finalphone", phone);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    phone,
    data: { first_name, last_name, phone },
  });
  return error;
};

const sendPhoneOtpCommon = async (phone: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: false,
    },
  });
  // console.log("error:", error);
  // console.log("error.code", error?.code);
  // TODO - Handle when we have Pro account
  if (!error || error.code == errorConsts.otpDisabled) {
    // Advanced MFA needs to be enabled (Pro account).
    // That's why we get 'otp_disabled' and it still sends out sms, currnetly surpressing this error code
    return;
  }
  return error;
};

export const sendPhoneOtp = async (formData: FormData) => {
  const user_update_error = await updateUser(formData);
  if (!!user_update_error) {
    if (user_update_error.code == phoneExistsErrorCode) {
      // Faking success in order to not reveal the existence of the phone to the user
      return encodedRedirect("success", routeConsts.verifyOtp, "true");
    }
    return encodedRedirect(
      "error",
      routeConsts.verifyOtp,
      "Could not send otp code",
    );
  }
  const country_code = formData.get("country_code") as string;
  const phone = `${country_code}${formData.get("phone") as string}`;

  const error = await sendPhoneOtpCommon(phone);

  if (!error) {
    return encodedRedirect("success", routeConsts.verifyOtp, "true");
  }
  return encodedRedirect("error", routeConsts.verifyOtp, error.message);
};

export const verifyOtp = async (token: string, phone: string) => {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    phone,
    type: "phone_change",
    token,
  });

  if (error) {
    return encodedRedirect("error", routeConsts.verifyOtp, error.message);
  }
  return redirect(routeConsts.youAreReady);
};

export const resendOtp = async (phone: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    phone,
    data: { phone },
  });
  if (!!error) {
    // Faking success in order to not reveal the existence of the phone to the user
    return error.code == phoneExistsErrorCode ? undefined : error;
  }
  return await sendPhoneOtpCommon(phone);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString() as string;

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: "testpass",
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
    return encodedRedirect(
      "error",
      routeConsts.forgotPassword,
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect("success", routeConsts.forgotPassword, "true");
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      routeConsts.resetPassword,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      routeConsts.resetPassword,
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    if (error.code == errorConsts.samePassword) {
      encodedRedirect(
        "error",
        routeConsts.resetPassword,
        "New password should be different from the old password.",
      );
    } else {
      encodedRedirect(
        "error",
        routeConsts.resetPassword,
        "Password update failed",
      );
    }
  }

  encodedRedirect("success", routeConsts.resetPassword, "true");
};

export const handleSignInWithGoogle = async (response: any) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
  });
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(routeConsts.signIn);
};
