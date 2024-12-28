/* eslint-disable unicorn/no-null */
'use server';

import { PostgrestError } from '@supabase/supabase-js';

import { UserCallEvent } from '@/components/quincy-dashboard/user-services/user-call-event-item';
import en from '@/messages/en.json';
import {
  CallEventTypes,
  DiseaseSymptomType,
  PrescriptionType,
} from '@/types/enums';
import { createAdminClient } from '@/utils/supabase/admin-server';
import { createClient } from '@/utils/supabase/server';
import { genRandomListItem } from '@/utils/utils';

type RandEventFunction = (
  user_id: string,
  active_call_id: number,
) => Promise<void>;

// #region insertion functions

const insertDoctorCallCallTypeEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const supabase_admin = await createAdminClient();

  const doctor_full_name = 'Dr. john Doe';

  const { data, error } = await supabase_admin.rpc(
    'insert_doctor_call_call_type_event',
    {
      active_call_id,
      user_id,
      doctor_full_name,
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

  const disease_symptom_type_ids: DiseaseSymptomType[] = [];

  const all_types = Object.keys(
    en.Enums.disease_symptom_types,
  ) as DiseaseSymptomType[];
  all_types.forEach(t => {
    if (Math.random() < 1 / (all_types.length / 2 + 1)) {
      disease_symptom_type_ids.push(t);
    }
  });
  if (disease_symptom_type_ids.length === 0) {
    disease_symptom_type_ids.push(all_types[0]);
  }

  const { data, error } = await supabase_admin.rpc(
    'insert_get_sick_leave_call_type_event',
    {
      active_call_id,
      user_id,
      disease_symptom_type_ids,
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
  const prescription_type_id = genRandomListItem(all_types) as PrescriptionType;

  const { data, error } = await supabase_admin.rpc(
    'insert_prescription_renewal_call_type_event',
    {
      active_call_id,
      user_id,
      prescription_type_id,
    },
  );
  if (error) {
    throw error;
  }

  console.log(data);
};

const insertScheduledAppointmentDemoCallEvent: RandEventFunction = async (
  user_id: string,
  active_call_id: number,
) => {
  const supabase_admin = await createAdminClient();
  const available_appointment_id = await getRandomAvailableAppointmentId();

  if (!available_appointment_id) {
    throw 'No appointments available';
  }

  const { data, error } = await supabase_admin.rpc(
    'insert_schedule_appointment_call_type_event',
    {
      available_appointment_id,
      active_call_id,
      user_id,
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
    throw 'User doesnt have an existing future scheduled appointments';
  }
  let old_schedule_reschedule_appointment_demo_call_event_id =
    await getUserRandomScheduleEventId(user_id);
  let is_rescheduling_a_reschedule = false;
  if (!old_schedule_reschedule_appointment_demo_call_event_id) {
    old_schedule_reschedule_appointment_demo_call_event_id =
      await getUserRandomRescheduleEventId(user_id);
    is_rescheduling_a_reschedule = true;
  }

  if (old_schedule_reschedule_appointment_demo_call_event_id) {
    const { data, error } = await supabase_admin.rpc(
      'insert_reschedule_cancel_appointment_call_type_event',
      {
        old_schedule_reschedule_appointment_demo_call_event_id,
        active_call_id,
        user_id,
        is_rescheduling_a_reschedule,
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
  const supabase_admin = await createAdminClient();
  const available_appointments = await getAllAvailableFutureAppointmens();

  const random_available_appointment = genRandomListItem(
    available_appointments,
  );

  return random_available_appointment?.id;
}

async function getUserRandomRescheduleEventId(
  user_id: string,
): Promise<number | undefined> {
  const supabase_admin = await createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase_admin
    .from('reschedule_appointment_demo_call_events')
    .select(
      'id, abstract_demo_call_events(*), appointments(*), reschedule_appointment_demo_call_event_id',
    )
    .is('reschedule_appointment_demo_call_event_id', null)
    .eq('abstract_demo_call_events.user_id', user_id)
    .gt('appointments.time', now);
  if (error) {
    throw error;
  }
  return genRandomListItem(data?.map(d => d.id));
}

async function getUserRandomScheduleEventId(
  user_id: string,
): Promise<number | undefined> {
  const supabase_admin = await createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase_admin
    .from('schedule_appointment_demo_call_events')
    .select(
      'id, abstract_demo_call_events(*), appointments(*), reschedule_appointment_demo_call_event_id',
    )
    .is('reschedule_appointment_demo_call_event_id', null)
    .eq('abstract_demo_call_events.user_id', user_id)
    .gt('appointments.time', now);
  if (error) {
    throw error;
  }
  return genRandomListItem(data?.map(d => d.id));
}

async function getUserActiveCallId(
  user_id: string,
): Promise<number | undefined> {
  const supabase_admin = await createAdminClient();

  const { data: incomingDemoCall, error: incomingError } = (await supabase_admin
    .from('incoming_demo_calls')
    .select('id, demo_service_phone_assignments(*), ended_at')
    .is('ended_at', null)
    .eq('demo_service_phone_assignments.assigned_to', user_id)
    .eq('demo_service_phone_assignments.is_deleted', false)
    .limit(1)
    .maybeSingle()) as { data?: { id: number }; error?: PostgrestError | null };

  if (incomingError) {
    throw `Error fetching incoming demo calls: ${incomingError}`;
  }

  return incomingDemoCall?.id;
}

type AppoointmentCoreData = {
  id: number;
  time: Date;
};
async function getAllAvailableFutureAppointmens(): Promise<
  AppoointmentCoreData[] | undefined
> {
  const supabase_admin = await createAdminClient();

  const now = new Date().toISOString();
  let availableAppointmentsQuery = supabase_admin
    .from('appointments')
    .select('id, time')
    .gt('time', now);

  const { data: appointments, error: appointmentError } =
    (await availableAppointmentsQuery) as {
      data?: { id: number; time: string }[];
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
      .from('schedule_appointment_demo_call_events')
      .select('appointment_id, reschedule_appointment_demo_call_event_id')
      .is('reschedule_appointment_demo_call_event_id', null)) as {
      data?: { appointment_id: number }[];
      error: PostgrestError | null;
    };

  if (scheduledError || !scheduledAppointments) {
    throw `Error fetching scheduled appointments: ${scheduledError}`;
  }

  const { data: reScheduledAppointments, error: reScheduledError } =
    (await supabase_admin
      .from('schedule_appointment_demo_call_events')
      .select('appointment_id, reschedule_appointment_demo_call_event_id')
      .not('appointment_id', 'is', null)
      .is('reschedule_appointment_demo_call_event_id', null)) as {
      data?: { appointment_id: number }[];
      error: PostgrestError | null;
    };

  if (reScheduledError || !reScheduledAppointments) {
    throw `Error fetching rescheduled appointments: ${reScheduledError}`;
  }

  const appointmentIds = new Set([
    ...scheduledAppointments.map(app => app.appointment_id),
    ...reScheduledAppointments.map(app => app.appointment_id),
  ]);
  return appointments
    .map(a => ({ ...a, time: new Date(a.time) }))
    .filter(a => !appointmentIds.has(a.id));
}
//#endregion
const insertionFunctionMap: Record<CallEventTypes, RandEventFunction> = {
  schedule_appointment: insertScheduledAppointmentDemoCallEvent,
  cancel_appointment: insertCancelAppointmentDemoCallEvent,
  reschedule_appointment: insertRescheduleAppointmentDemoCallEvent,
  prescription_renewal: insertPrescriptionRenewalDemoCallEvent,
  get_sick_leave: insertGetSickLeaveCallTypeEvent,
  doctor_call: insertDoctorCallCallTypeEvent,
};

// This file is just for faking call events while user is logged in
export const insert_random_call_event = async () => {
  // we assume here there user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;

  try {
    const active_call_id: number | undefined =
      await getUserActiveCallId(userId);

    if (!active_call_id) {
      throw 'No active incoming call for user!';
    }

    const { data: enabled_user_call_events, error } = (await supabase
      .from('user_call_events')
      .select('id, call_event_type_id, is_enabled')
      .eq('user_id', userId)
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
        ](userId, active_call_id);
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
};

export const end_call = async () => {
  // we assume here there user is logged in
  console.log('attempting call end');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;
  try {
    const active_call_id: number | undefined =
      await getUserActiveCallId(userId);

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
    console.log('end_call_result:', data);
  } catch (error) {
    console.error('FATAL ERROR:', error);
  }
};

export const start_call = async () => {
  // we assume here there user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;
  try {
    const existingNonDeletedDemo = await supabase
      .from('demo_service_phone_assignments')
      .select('id, phone, is_deleted')
      .eq('is_deleted', false)
      .eq('assigned_to', userId)
      .limit(1)
      .maybeSingle();

    if (!existingNonDeletedDemo) {
      throw 'No existing active for user!';
    }

    const supabase_admin = await createAdminClient();
    const demo_service_phone_assignment_id = existingNonDeletedDemo.data?.id;
    const { data, error } = await supabase_admin
      .from('incoming_demo_calls')
      .insert({ demo_service_phone_assignment_id });
    if (error) {
      throw error;
    }
    console.log('start_call_result:', data);
  } catch (error) {
    console.error('FATAL ERROR:', error);
  }
};
