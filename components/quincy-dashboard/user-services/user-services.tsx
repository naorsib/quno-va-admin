import { createClient } from '@/utils/supabase/server';

import { UserService, UserServiceItem } from './user-service-item';

type Props = {
  userId: string;
};

export async function UserServices({ userId }: Props) {
  const supabase = await createClient();
  const { data: user_services } = (await supabase
    .from('user_services')
    .select('id, app_service_id, is_enabled')
    .eq('user_id', userId)
    .order('id')) as { data: UserService[] };

  return (
    <div className="flex w-full flex-col items-center gap-2 text-sm">
      <div className="max-w-nd grid w-full grid-cols-1 gap-4 sm:max-w-full md:grid-cols-2">
        {user_services.map(service => (
          <UserServiceItem key={service.id} user_service={service} />
        ))}
      </div>
    </div>
  );
}
