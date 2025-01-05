/* eslint-disable unicorn/no-null */
'use server';
import { PostgrestError } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import { sleep } from 'retell-sdk/core';

import { UserCallEvent } from '@/components/quincy-dashboard/user-services/user-call-event-item';
import en from '@/messages/en.json';
import { CallEventTypes, PrescriptionType } from '@/types/enums';
import { createAdminClient } from '@/utils/supabase/admin-server';
import { createClient } from '@/utils/supabase/server';
import { genRandomListItem } from '@/utils/utils';

export type AppointmentType = keyof typeof en.Enums.appointment_types;

type RandEventFunction = (
  user_id: string,
  active_call_id: number,
) => Promise<void>;

// #region insertion functions

const insertDoctorCallCallTypeEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const t: any = await getTranslations('CallAssistives');
  const supabase_admin = await createAdminClient();

  const doctor_full_name = 'Dr. john Doe';
  const info = t('doctorNoteDefault');
  const { data, error } = await supabase_admin.rpc(
    'insert_doctor_call_call_event',
    {
      active_call_id,
      user_id,
      doctor_full_name,
      info,
    },
  );
  if (error) {
    throw error;
  }
  console.log(data);
};

const insertGetSickLeaveCallTypeEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const supabase_admin = await createAdminClient();

  const info = 'I feel very weak today';
  const { data, error } = await supabase_admin.rpc(
    'insert_sick_leave_call_event',
    {
      active_call_id,
      user_id,
      info,
    },
  );
  if (error) {
    throw error;
  }
  console.log(data);
};

const insertPrescriptionRenewalDemoCallEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const supabase_admin = await createAdminClient();

  const all_types = Object.keys(
    en.Enums.prescription_types,
  ) as PrescriptionType[];
  const info = 'I need a prescription for Ritalin';

  const { data, error } = await supabase_admin.rpc(
    'insert_prescription_renewal_call_event',
    {
      active_call_id,
      user_id,
      info,
    },
  );
  if (error) {
    throw error;
  }

  console.log(data);
};

const insertNewAppointmentDemoCallEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const supabase_admin = await createAdminClient();
  const new_appointment_id = await getRandomAvailableAppointmentId();

  if (!new_appointment_id) {
    throw 'No appointments available';
  }

  const { data, error } = await supabase_admin.rpc(
    'insert_new_appointment_call_event',
    {
      active_call_id,
      user_id,
      new_appointment_id,
    },
  );
  if (error) {
    throw error;
  }
  console.log(data);
};

const insertCancelAppointmentDemoCallEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  return insertCancelOrRescheduledAppointmentDemoCallEvent(
    user_id,
    active_call_id,
    true,
  );
};

const insertRescheduleAppointmentDemoCallEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  return insertCancelOrRescheduledAppointmentDemoCallEvent(
    user_id,
    active_call_id,
    false,
  );
};

// #endregion

// #region helper functions
const insertCancelOrRescheduledAppointmentDemoCallEvent = async (
  user_id: string,
  active_call_id: number,
  shouldCancel: boolean = false,
): Promise<void> => {
  const supabase_admin = await createAdminClient();
  const new_appointment_id = shouldCancel
    ? null
    : await getRandomAvailableAppointmentId();

  if (!new_appointment_id && !shouldCancel) {
    throw 'No appointments available!';
  }
  const old_appointment_demo_call_event_id =
    await getUserRandomActiveFutureAppointmentEventId(user_id);
  if (!old_appointment_demo_call_event_id) {
    throw 'User doesnt have any existing future scheduled appointments';
  }
  if (old_appointment_demo_call_event_id) {
    const { data, error } = await supabase_admin.rpc(
      'insert_reschedule_cancel_appointment_call_event',
      {
        active_call_id,
        user_id,
        old_appointment_demo_call_event_id,
        new_appointment_id,
      },
    );
    if (error) {
      throw error;
    }

    console.log(data);
  }
};
async function getRandomAvailableAppointmentId(): Promise<number | undefined> {
  const available_appointments = await getAllAvailableFutureAppointmens();

  const random_available_appointment = genRandomListItem(
    available_appointments,
  );

  return random_available_appointment?.id;
}

async function getUserRandomActiveFutureAppointmentEventId(
  user_id: string,
): Promise<number | undefined> {
  const supabase_admin = await createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase_admin
    .from('appointment_demo_call_events')
    .select(
      'id, abstract_demo_call_events(*), appointments(*), reschedule_appointment_demo_call_event_id',
    )
    .not('appointment_id', 'is', null)
    .is('reschedule_appointment_demo_call_event_id', null)
    .eq('abstract_demo_call_events.user_id', user_id)
    .gt('appointments.time', now);
  if (error) {
    throw error;
  }
  return genRandomListItem(data?.map(d => d.id));
}

// async function getUserRandomScheduleEventId(
//   user_id: string,
// ): Promise<number | undefined> {
//   const supabase_admin = await createAdminClient();
//   const now = new Date().toISOString();
//   const { data, error } = await supabase_admin
//     .from('schedule_appointment_demo_call_events')
//     .select(
//       'id, abstract_demo_call_events(*), appointments(*), reschedule_appointment_demo_call_event_id',
//     )
//     .is('reschedule_appointment_demo_call_event_id', null)
//     .eq('abstract_demo_call_events.user_id', user_id)
//     .gt('appointments.time', now);
//   if (error) {
//     throw error;
//   }
//   return genRandomListItem(data?.map(d => d.id));
// }

async function getUserActiveCallId(
  user_id: string,
): Promise<number | undefined> {
  const supabase_admin = await createAdminClient();

  const { data: incomingDemoCall, error: incomingError } = (await supabase_admin
    .from('incoming_demo_calls')
    .select('id, ended_at, associated_with')
    .is('ended_at', null)
    .eq('associated_with', user_id)
    .limit(1)
    .maybeSingle()) as { data?: { id: number }; error?: PostgrestError | null };

  if (incomingError) {
    throw `Error fetching incoming calls for user: ${JSON.stringify(incomingError)}`;
  }

  return incomingDemoCall?.id;
}

type AppoointmentCoreData = {
  id: number;
  time: Date;
  appointment_type_id: AppointmentType;
};
export async function getAllAvailableFutureAppointmens(): Promise<
  AppoointmentCoreData[] | undefined
> {
  const supabase_admin = await createAdminClient();

  const now = new Date().toISOString();
  const availableAppointmentsQuery = supabase_admin
    .from('appointments')
    .select('id, time, appointment_type_id')
    .gt('time', now);

  const { data: appointments, error: appointmentError } =
    (await availableAppointmentsQuery) as {
      data?: {
        id: number;
        time: string;
        appointment_type_id: AppointmentType;
      }[];
      error: PostgrestError | null;
    };

  if (appointmentError || !appointments) {
    throw `Error fetching available appointments: ${appointmentError}`;
  }

  if (appointments.length === 0) {
    throw `No available appointments found.`;
  }

  const { data: scheduledAppointments, error: scheduledError } =
    (await supabase_admin
      .from('appointment_demo_call_events')
      .select('appointment_id, appointments(time)')
      .not('appointment_id', 'is', null)
      .is('reschedule_appointment_demo_call_event_id', null)
      .gt('appointments.time', now)) as {
      data?: { appointment_id: number }[];
      error: PostgrestError | null;
    };

  if (scheduledError || !scheduledAppointments) {
    throw `Error fetching scheduled appointments: ${scheduledError}`;
  }

  const scheduledAppointmentIds = new Set(
    scheduledAppointments.map(app => app.appointment_id),
  );
  return appointments
    .map(a => ({ ...a, time: new Date(a.time) }))
    .filter(a => !scheduledAppointmentIds.has(a.id));
}

//#endregion
const insertionFunctionMap: Record<CallEventTypes, RandEventFunction> = {
  schedule_appointment: insertNewAppointmentDemoCallEvent,
  cancel_appointment: insertCancelAppointmentDemoCallEvent,
  reschedule_appointment: insertRescheduleAppointmentDemoCallEvent,
  prescription_renewal: insertPrescriptionRenewalDemoCallEvent,
  get_sick_leave: insertGetSickLeaveCallTypeEvent,
  doctor_call: insertDoctorCallCallTypeEvent,
};

// This function is just for faking call events while user is logged in (development purposes only)
export const insert_random_call_event = async () => {
  // we assume here there user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const user_id = user?.id as string;

  try {
    const active_call_id: number | undefined =
      await getUserActiveCallId(user_id);

    if (!active_call_id) {
      throw 'No active incoming call for user!';
    }

    const { data: enabled_user_call_events, error } = (await supabase
      .from('user_call_events')
      .select('id, call_event_type_id, is_enabled')
      .eq('user_id', user_id)
      .eq('is_enabled', true)
      .order('id')) as {
      data?: UserCallEvent[];
      error?: PostgrestError | null;
    };

    if (
      error ||
      !enabled_user_call_events ||
      enabled_user_call_events.length === 0
    ) {
      throw (
        error ||
        'Could not access user selected services(events) or non selected'
      );
    }
    const maxAttempts = enabled_user_call_events.length === 1 ? 1 : 5;
    let attemptNumber = 0;
    // loop until broken
    while (true) {
      const radomlySelectedEvent = genRandomListItem(enabled_user_call_events);

      if (!radomlySelectedEvent) {
        throw 'unexpected error';
      }
      console.log(
        `Attempt #${attemptNumber}: Attempting to insert call event of type: ${radomlySelectedEvent.call_event_type_id}`,
      );
      try {
        await insertionFunctionMap[
          radomlySelectedEvent.call_event_type_id as CallEventTypes
        ](user_id, active_call_id);
        console.log(
          `Successfully inserted call event ${radomlySelectedEvent.call_event_type_id}`,
        );
        break;
      } catch (error: any) {
        console.error(
          `Could not insert call event ${radomlySelectedEvent.call_event_type_id}:${error.message || error}`,
        );
        attemptNumber++;
        if (attemptNumber === maxAttempts) {
          throw `Max attempts reached: ${maxAttempts}`;
        }
      }
    }
  } catch (error) {
    console.error('FATAL ERROR:', error);
  }
  await sleep(1000);
};

export const end_call = async () => {
  // we assume here there user is logged in. It is okay becuase the method only really exist for development purposes
  console.log('attempting call end');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const user_id = user?.id as string;
  try {
    const active_call_id: number | undefined =
      await getUserActiveCallId(user_id);

    if (!active_call_id) {
      throw 'No active incoming call for user!';
    }
    console.log('active_call_id', active_call_id);
    const supabase_admin = await createAdminClient();
    const ended_at = new Date().toISOString();
    const { data, error } = await supabase_admin
      .from('incoming_demo_calls')
      .update({ ended_at })
      .eq('id', active_call_id);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('FATAL ERROR:', error);
  }
  await sleep(1000);
};

// TODO This only for tests and should at some point be removed
export const initiateCallFromClient = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const phone = user?.user_metadata.phone;
  return start_call({ phone });
};

// TODO This is only good right now. For later (non-finite/stable) phases, this function will probably reside in a different project and `payload.phone` would be mandatory
export const start_call = async (payload?: { phone: string }) => {
  const supabase_admin = await createAdminClient();
  const supabase = await createClient();
  //TODO - Export to env var and also maybe make environment-dependant to make fake dev calls possible
  const isReceivingRealCalls = false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // TODO - Replace with real call metadata
  const call_metadata = {};
  const phone = isReceivingRealCalls
    ? await (
        await supabase.auth.getUser()
      ).data.user?.user_metadata.phone
    : payload?.phone;

  if (!phone) {
    throw `Incoming phone number is missing`;
  }

  const { data: incoming_call, error: creation_error } = (await supabase_admin
    .from('incoming_demo_calls')
    .insert({ phone, call_metadata })
    .select('id')
    .single()) as {
    data: { id: number };
    error: PostgrestError | null;
  };

  const phone_user = await get_phone_user(phone);
  if (creation_error) {
    throw `Something went really wrong, the incoming_call couldn't be created. this can enver happen!. phone: ${phone}, call_metadata:{${call_metadata}}`;
  }

  try {
    if (phone_user?.id) {
      const { data: call_update, error: call_update_error } =
        await supabase_admin
          .from('incoming_demo_calls')
          .update({
            associated_with: phone_user.id,
            call_context: { user: phone_user },
          })
          .eq('id', incoming_call.id);

      // return {incoming_call_id: incoming_call.id}
      if (call_update_error) {
      }
    } else {
      throw {
        type: 'phone_user_not_found',
        message:
          'Incoming phone number is not associated with any clinic(user) in the database',
      };
    }
  } catch (error: any) {
    const initError = error?.message || error || '';
    const call_termination_reason_type_id = error?.type || 'unexpected_error';
    const metadata_with_error = Object.assign(call_metadata, initError);

    await supabase_admin
      .from('incoming_demo_calls')
      .update({
        call_termination_reason_type_id,
        call_metadata: metadata_with_error,
      })
      .eq('id', `${incoming_call.id}`);
  }
  await sleep(1000);
};

const get_phone_user = async (phone: string) => {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('user_base_details')
    .select('id, clinic_name, address, clinic_type_id, first_name, last_name')
    // TODO - inner-join with past appointments and return along with a user-related call_context
    .eq('phone', phone)
    .limit(1)
    .maybeSingle();

  return data;
};
