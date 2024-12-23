import { getTranslations } from 'next-intl/server';

import { UserServiceItemSwitch } from './user-service-item-switch';

export type UserService = {
  id: number;
  app_service_id: string;
  is_enabled: boolean;
};

export async function UserServiceItem({
  user_service,
}: {
  user_service: UserService;
}) {
  const t = await getTranslations(`AppServices.${user_service.app_service_id}`);
  return (
    <UserServiceItemSwitch user_service={user_service}>
      <div className="flex w-full flex-col gap-3">
        <h3 className="mb-3 mr-10 text-base font-bold">{t('title')}</h3>
        <p>{t('info')}</p>
      </div>
    </UserServiceItemSwitch>
  );
}
