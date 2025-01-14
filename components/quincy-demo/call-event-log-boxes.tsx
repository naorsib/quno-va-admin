'use client';

import { RealtimeChannel } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { Stethoscope } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import AppointmentCancelledSvgComponent from '@/components/react-svg-components/appointment-event-icons';
import PrescriptionSvgComponent from '@/components/react-svg-components/prescription';
import SickLeaveSvgComponent from '@/components/react-svg-components/sick-leave';
import { P } from '@/components/typography/text';
import {
  Appointment,
  CallEvent,
  CancelAppointmentEventType,
  DoctorCallEventType,
  GetSickLeaveEventType,
  PrescriptionRenewalEventType,
  RescheduleAppointmentEventType,
  ScheduleAppointmentEventType,
} from '@/types/call-events';
import { CallEventType } from '@/types/enums';
import { combineDates } from '@/utils/date-utils';
import { createClient } from '@/utils/supabase/client';

type Props = {
  existing_call_events: CallEvent<CallEventType>[];
};
export function CallEventLogBoxes({ existing_call_events = [] }: Props) {
  const [callEvents, setCallEvents] = useState(existing_call_events);
  // TODO - Figure out how to add typing here efficiently
  const t = useTranslations();
  const supabase = createClient();
  const insertSubscriptionRef = useRef<RealtimeChannel | undefined>(undefined);

  const listenToLogEventsIncoming = useCallback(() => {
    return supabase
      .channel('demo_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'abstract_demo_call_events',
        },
        payload => {
          setCallEvents([
            payload.new as CallEvent<CallEventType>,
            ...callEvents,
          ]);
        },
      )
      .subscribe(console.log);
  }, [callEvents, supabase]);

  useEffect(() => {
    insertSubscriptionRef.current?.unsubscribe();
    insertSubscriptionRef.current = listenToLogEventsIncoming();
    return () => {
      insertSubscriptionRef.current?.unsubscribe();
    };
  }, [listenToLogEventsIncoming]);

  return (
    <div className="flex w-full flex-col gap-4">
      {callEvents.map(call_event => {
        return (
          <CallEventLogBoxWrapper
            className="rounded border border-border bg-white p-4 sm:p-5"
            call_event={call_event}
            t={t}
            key={call_event.id}
          >
            {call_event.call_event_type_id === 'schedule_appointment' && (
              <ScheduleAppointmentCallEventLogBox
                call_event={call_event as ScheduleAppointmentEventType}
                t={t}
              />
            )}
            {call_event.call_event_type_id === 'reschedule_appointment' && (
              <RescheduleAppointmentCallEventLogBox
                call_event={call_event as RescheduleAppointmentEventType}
                t={t}
              />
            )}
            {call_event.call_event_type_id === 'cancel_appointment' && (
              <CancelAppointmentCallEventLogBox
                call_event={call_event as CancelAppointmentEventType}
                t={t}
              />
            )}
            {call_event.call_event_type_id === 'prescription_renewal' && (
              <PrescriptionRenewalCallEventLogBox
                call_event={call_event as PrescriptionRenewalEventType}
                t={t}
              />
            )}
            {call_event.call_event_type_id === 'get_sick_leave' && (
              <GetSickLeaveCallEventLogBox
                call_event={call_event as GetSickLeaveEventType}
                t={t}
              />
            )}
            {call_event.call_event_type_id === 'doctor_call' && (
              <DoctorCallCallEventLogBox
                call_event={call_event as DoctorCallEventType}
                t={t}
              />
            )}
          </CallEventLogBoxWrapper>
        );
      })}
    </div>
  );
}

type CallEventLogBoxesProps<T extends CallEventType> = {
  call_event: CallEvent<T>;
  t: any;
};

type ScheduleAppointmentCallEventLogBoxProps =
  CallEventLogBoxesProps<'schedule_appointment'> & {
    call_event: ScheduleAppointmentEventType;
  };

type CancelAppointmentCallEventLogBoxProps =
  CallEventLogBoxesProps<'cancel_appointment'> & {
    call_event: CancelAppointmentEventType;
  };

type RescheduleAppointmentCallEventLogBoxProps =
  CallEventLogBoxesProps<'reschedule_appointment'> & {
    call_event: RescheduleAppointmentEventType;
  };

type PrescriptionRenewalCallEventLogBoxProps =
  CallEventLogBoxesProps<'prescription_renewal'> & {
    call_event: PrescriptionRenewalEventType;
  };

type GetSickLeaveCallEventLogBoxProps =
  CallEventLogBoxesProps<'get_sick_leave'> & {
    call_event: GetSickLeaveEventType;
  };

type DoctorCallCallEventLogBoxProps = CallEventLogBoxesProps<'doctor_call'> & {
  call_event: DoctorCallEventType;
};

export function ScheduleAppointmentCallEventLogBox({
  call_event,
  t,
}: ScheduleAppointmentCallEventLogBoxProps) {
  const appointment = call_event.extra_data.appointment;

  return AppointmentDisplay(t, call_event.extra_data.appointment);
}
export function CancelAppointmentCallEventLogBox({
  call_event,
  t,
}: CancelAppointmentCallEventLogBoxProps) {
  return AppointmentDisplay(t, call_event.extra_data.appointment);
}
export function RescheduleAppointmentCallEventLogBox({
  call_event,
  t,
}: RescheduleAppointmentCallEventLogBoxProps) {
  return AppointmentDisplay(
    t,
    call_event.extra_data.appointment,
    call_event.extra_data.old_data.appointment,
  );
}
export function PrescriptionRenewalCallEventLogBox({
  call_event,
  t,
}: PrescriptionRenewalCallEventLogBoxProps) {
  return (
    <>
      <span className="font-bold">{call_event.extra_data.info}</span>
    </>
  );
}
export function GetSickLeaveCallEventLogBox({
  call_event,
  t,
}: GetSickLeaveCallEventLogBoxProps) {
  return (
    <>
      {t(`CallEventLogBoxes.${call_event.call_event_type_id}.patientDescribed`)}{' '}
      <b>{call_event.extra_data.info}</b>
    </>
  );
}
export function DoctorCallCallEventLogBox({
  call_event,
  t,
}: DoctorCallCallEventLogBoxProps) {
  return (
    <>
      {t(`CallEventLogBoxes.${call_event.call_event_type_id}.forDoctor`, {
        doctorName: call_event.extra_data.doctor_full_name,
      })}{' '}
      {call_event.extra_data.info}
    </>
  );
}

type WrapperProps = ComponentProps<'div'> &
  CallEventLogBoxesProps<CallEventType>;

const callEventTypeIconMap = {
  schedule_appointment: AppointmentCancelledSvgComponent,
  reschedule_appointment: AppointmentCancelledSvgComponent,
  cancel_appointment: AppointmentCancelledSvgComponent,
  prescription_renewal: PrescriptionSvgComponent,
  get_sick_leave: SickLeaveSvgComponent,
  doctor_call: Stethoscope,
};

function CallEventLogBoxWrapper({
  call_event,
  children,
  className,
  t,
  ...props
}: WrapperProps) {
  const Cmp = callEventTypeIconMap[call_event.call_event_type_id];

  return (
    <div className={className}>
      <div className="flex w-full flex-row gap-2">
        <Cmp
          height="25"
          width="25"
          desc={t(`CallEventLogBoxes.${call_event.call_event_type_id}.title`)}
          desc_id={call_event.call_event_type_id}
        />
        <div
          className="flex flex-1 flex-col gap-2"
          suppressHydrationWarning={true}
        >
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <P className="font-bold">
              {t(`CallEventLogBoxes.${call_event.call_event_type_id}.title`)}
            </P>
            <P fontFamily="roboto" className="text-hero-description">
              <label className="hidden md:block">
                {format(call_event.created_at, "d MMMM yyyy 'at' HH:mm")}
              </label>
              <label className="md:hidden">
                {format(call_event.created_at, 'd/MM HH:mm')}
              </label>
            </P>
          </div>

          <P fontFamily="roboto">{children}</P>
        </div>
      </div>
    </div>
  );
  // const appointment = call_event.extra_data.appointment;
}

// type CallEventLogBoxComponent<T extends CallEventType> = React.ComponentType<CallEventLogBoxesProps<T>>;

// const EventTypeToComponentMap: Record<string, CallEventLogBoxComponent<CallEventType>> = {
//   schedule_appointment: ScheduleAppointmentCallEventLogBox,
//   cancel_appointment: CancelAppointmentCallEventLogBox,
//   reschedule_appointment: RescheduleAppointmentCallEventLogBox,
//   prescription_renewal: PrescriptionRenewalCallEventLogBox,
//   get_sick_leave: GetSickLeaveScheduleCallEventLogBox,
//   doctor_call: DoctorCallCallEventLogBox
// }

function AppointmentDisplay(
  t: any,
  appointment: Appointment,
  old_appointment?: Appointment,
) {
  return (
    <>
      {appointment.person_full_name}
      {', '}
      {t(`Enums.appointment_types.${appointment.appointment_type_id}`)}
      {', '}
      {old_appointment ? (
        combineDates(old_appointment.time, appointment.time)
      ) : (
        <>{format(appointment.time, 'HH:mm do MMMM')}</>
      )}
    </>
  );
}
