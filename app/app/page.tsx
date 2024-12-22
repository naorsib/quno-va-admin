import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import { routeConsts } from '@/consts/routing.const';
import { createClient } from '@/utils/supabase/server';

export default async function AppPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(routeConsts.signIn);
  }
  if (!user.email_confirmed_at) {
    return redirect(`${routeConsts.verifyEmail}?email=${user.email}`);
  }
  if (!user.phone_confirmed_at) {
    return redirect(routeConsts.verifyOtp);
  }

  const { data: user_services } = await supabase
    .from('user_services')
    .select('id, app_service_id, is_enabled')
    .eq('user_id', user.id)
    .order('id');

  return (
    <div className="flex w-full max-w-xl flex-col sm:max-w-5xl">
      <div className="flex w-full flex-1 flex-col gap-12">
        <div className="w-full">
          <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
            <InfoIcon size="16" strokeWidth={2} />
            This is a protected page that you can only see as an authenticated
            user
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2 className="mb-4 text-2xl font-bold">Your user details</h2>
          <pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
            {JSON.stringify(user, undefined, 2)}
          </pre>
          <pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
            {JSON.stringify(user_services, undefined, 2)}
          </pre>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">Next steps</h2>
        </div>
      </div>
    </div>
  );
}
