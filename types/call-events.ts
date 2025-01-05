import { CallEventTypes } from './enums';

export type Appointment = {
  time: Date;
  duration: number;
  appointment_type_id: string;
  person_full_name: string;
};

type CancelAppointmentAdditions = {
  appointment: Appointment;
};

type RescheduleAppointmentAdditions = {
  appointment: Appointment;
  old_data: {
    appointment: Appointment;
  };
};

type ScheduleAppointmentAdditions = {
  appointment: Appointment;
};

type InfoAdditions = {
  info: string;
};

type PrescriptionRenewalAdditions = InfoAdditions & {};
type GetSickLeaveAdditions = InfoAdditions & {};

type DoctorCallAdditions = InfoAdditions & {
  doctor_full_name: string;
};

export type CallEvent<T extends CallEventTypes> = {
  id: number;
  call_event_type_id: T;
  created_at: string;
  extra_data:
    | CancelAppointmentAdditions
    | ScheduleAppointmentAdditions
    | RescheduleAppointmentAdditions
    | GetSickLeaveAdditions
    | PrescriptionRenewalAdditions
    | DoctorCallAdditions;
};

type ScheduleAppointmentEventType = CallEvent<'schedule_appointment'> & {
  extra_data: ScheduleAppointmentAdditions;
};

type CancelAppointmentEventType = CallEvent<'cancel_appointment'> & {
  extra_data: CancelAppointmentAdditions;
};

type RescheduleAppointmentEventType = CallEvent<'reschedule_appointment'> & {
  extra_data: RescheduleAppointmentAdditions;
};

type PrescriptionRenewalEventType = CallEvent<'prescription_renewal'> & {
  extra_data: PrescriptionRenewalAdditions;
};

type GetSickLeaveEventType = CallEvent<'get_sick_leave'> & {
  extra_data: GetSickLeaveAdditions;
};
type DoctorCallEventType = CallEvent<'doctor_call'> & {
  extra_data: DoctorCallAdditions;
};

export type {
  CancelAppointmentEventType,
  DoctorCallEventType,
  GetSickLeaveEventType,
  PrescriptionRenewalEventType,
  RescheduleAppointmentEventType,
  ScheduleAppointmentEventType,
};
