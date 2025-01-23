import { Database } from './supabase';
export type CallEventType = Database['public']['Enums']['call_event_types'];
export type ClinicType = Database['public']['Enums']['clinic_types'];
export type PendingActionTypes =
  Database['public']['Enums']['pending_action_types'];
