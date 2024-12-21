import { redirect } from 'next/navigation';

import { BasicDetails } from '@/components/basic-details/basic-details';
import { UserBasicDetails } from '@/components/basic-details/basic-details-form';
import { UserServices } from '@/components/user-services/user-services';
import { routeConsts } from '@/costs/routing.const';
import { createClient } from '@/utils/supabase/server';

type UserDetails = UserBasicDetails & {
  // TODO - Turns into enum using translations or a lookup view
  clinic_type: string;
};

export default async function QuincyPage() {
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

  // const { data: user_services } = (await supabase
  //   .from("user_details")
  //   .select("id, clinic_name, address, clinic_type")
  //   .eq("user_id", props.userId)
  //   ) as { data:UserDetails };

  // TODO - Fetch when we have the new table (example query above)
  const id = 1;
  const clinic_name = 'test_clinic';
  const address = 'test_address';
  // const clinicType="test_type"

  const basicDetails: UserBasicDetails = {
    id,
    clinic_name,
    address,
  };
  return (
    <div className="flex h-screen max-h-[calc(100vh-64px)] w-full flex-1 flex-col justify-between gap-12">
      <div className="flex max-h-[calc(100%-40px)] flex-col items-start items-center gap-2 overflow-y-scroll px-3 py-10 md:max-h-none md:overflow-auto">
        <div className="flex w-full flex-col">
          <h2 className="mb-4 text-2xl font-bold">Quincy Setup</h2>
          <p className="mb-3">
            To give a realistic experience, we need you to fill out this
            information. This information are nessecary to built a special and
            customized response to the patient.
          </p>

          <BasicDetails
            basicDetails={basicDetails}
            userId={user.id}
            className="mb-3"
          />
          <p className="mb-3">
            Depending on your clinic setup you can have different scenarios of
            how to work with your patients. You can also select a preset, that
            controls the voice and type of additional information available to
            Quincy.
          </p>
          <div className="mb-3">Clinic type form dropdown</div>
        </div>

        <UserServices userId={user.id} />
      </div>
      <div className="sticky bottom-0 w-full lg:hidden">TEST</div>
    </div>
  );
}
