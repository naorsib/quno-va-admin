import { P } from '@/components/typography/text';
import { ClinicType } from '@/types/enums';
import { InnerPagesTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/server';

import {
  BasicDetailsForm,
  UserClinicBase,
} from './basic-details/basic-details-form';
import { ClinicTypeForm } from './basic-details/clinic-type-form';

export type UserClinicData = UserClinicBase & {
  clinic_type_id: ClinicType;
};

type Props = {
  user_id: string;
  t: InnerPagesTrans<'quincy'>;
};

export async function UserClinic({ user_id, t }: Props) {
  const supabase = await createClient();
  const { data: clinic_details } = (await supabase
    .from('user_base_details')
    .select('clinic_name, address, clinic_type_id')
    .eq('id', user_id)
    .limit(1)
    .single()) as { data: UserClinicData };

  const clinic_base: UserClinicBase = {
    clinic_name: clinic_details.clinic_name,
    address: clinic_details.address,
  };
  return (
    <div className="flex w-full flex-col">
      <P className="mb-4 text-base/6">{t('infoText1')}</P>

      <BasicDetailsForm
        user_id={user_id}
        clinic_base={clinic_base}
        className="mb-8 grid w-full max-w-xs grid-cols-1 gap-4 sm:max-w-lg sm:grid-cols-2"
      />

      <P className="mb-4 text-base/6">{t('infoText2')}</P>

      <ClinicTypeForm
        className="mb-8 grid w-full max-w-xs grid-cols-1 gap-4 sm:max-w-lg sm:grid-cols-2"
        clinic_type_id={clinic_details.clinic_type_id}
        user_id={user_id}
      />
    </div>
  );
}
