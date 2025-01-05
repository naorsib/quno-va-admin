export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      abstract_demo_call_events: {
        Row: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
        Insert: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at?: string;
          extra_data?: Json;
          id?: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
        Update: {
          call_event_type_id?: Database['public']['Enums']['call_event_types'];
          created_at?: string;
          extra_data?: Json;
          id?: number;
          incoming_demo_call_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'abstract_demo_call_events_incoming_demo_call_id_fkey';
            columns: ['incoming_demo_call_id'];
            isOneToOne: false;
            referencedRelation: 'incoming_demo_calls';
            referencedColumns: ['id'];
          },
        ];
      };
      appointment_demo_call_events: {
        Row: {
          appointment_id: number | null;
          id: number;
          reschedule_appointment_demo_call_event_id: number | null;
        };
        Insert: {
          appointment_id?: number | null;
          id?: number;
          reschedule_appointment_demo_call_event_id?: number | null;
        };
        Update: {
          appointment_id?: number | null;
          id?: number;
          reschedule_appointment_demo_call_event_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointment_demo_call_event_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointment_demo_call_event_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'abstract_demo_call_events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointment_demo_call_events_reschedule_appointment_demo_c_fkey';
            columns: ['reschedule_appointment_demo_call_event_id'];
            isOneToOne: false;
            referencedRelation: 'appointment_demo_call_events';
            referencedColumns: ['id'];
          },
        ];
      };
      appointments: {
        Row: {
          added_at: string;
          appointment_duration: number;
          appointment_type_id: Database['public']['Enums']['appointment_types'];
          id: number;
          person_full_name: string;
          time: string;
        };
        Insert: {
          added_at?: string;
          appointment_duration: number;
          appointment_type_id: Database['public']['Enums']['appointment_types'];
          id?: never;
          person_full_name: string;
          time: string;
        };
        Update: {
          added_at?: string;
          appointment_duration?: number;
          appointment_type_id?: Database['public']['Enums']['appointment_types'];
          id?: never;
          person_full_name?: string;
          time?: string;
        };
        Relationships: [];
      };
      call_event_types_defaults: {
        Row: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          default: boolean;
        };
        Insert: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          default: boolean;
        };
        Update: {
          call_event_type_id?: Database['public']['Enums']['call_event_types'];
          default?: boolean;
        };
        Relationships: [];
      };
      doctor_call_demo_call_events: {
        Row: {
          doctor_full_name: string;
          id: number;
          info: string;
        };
        Insert: {
          doctor_full_name: string;
          id: number;
          info: string;
        };
        Update: {
          doctor_full_name?: string;
          id?: number;
          info?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'doctor_call_demo_call_events_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'abstract_demo_call_events';
            referencedColumns: ['id'];
          },
        ];
      };
      get_sick_leave_demo_call_events: {
        Row: {
          id: number;
          info: string;
        };
        Insert: {
          id: number;
          info: string;
        };
        Update: {
          id?: number;
          info?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'get_sick_leave_demo_call_events_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'abstract_demo_call_events';
            referencedColumns: ['id'];
          },
        ];
      };
      incoming_demo_calls: {
        Row: {
          associated_with: string | null;
          call_context: Json | null;
          call_metadata: Json | null;
          call_termination_reason_type_id:
            | Database['public']['Enums']['call_termination_reason_types']
            | null;
          created_at: string;
          ended_at: string | null;
          id: number;
          participant_identity: string;
          phone: string | null;
        };
        Insert: {
          associated_with?: string | null;
          call_context?: Json | null;
          call_metadata?: Json | null;
          call_termination_reason_type_id?:
            | Database['public']['Enums']['call_termination_reason_types']
            | null;
          created_at?: string;
          ended_at?: string | null;
          id?: number;
          participant_identity?: string;
          phone?: string | null;
        };
        Update: {
          associated_with?: string | null;
          call_context?: Json | null;
          call_metadata?: Json | null;
          call_termination_reason_type_id?:
            | Database['public']['Enums']['call_termination_reason_types']
            | null;
          created_at?: string;
          ended_at?: string | null;
          id?: number;
          participant_identity?: string;
          phone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'incoming_demo_calls_associated_with_fkey';
            columns: ['associated_with'];
            isOneToOne: false;
            referencedRelation: 'user_base_details';
            referencedColumns: ['id'];
          },
        ];
      };
      prescription_renewal_demo_call_events: {
        Row: {
          id: number;
          info: string;
        };
        Insert: {
          id?: number;
          info: string;
        };
        Update: {
          id?: number;
          info?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prescription_renewal_demo_call_events_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'abstract_demo_call_events';
            referencedColumns: ['id'];
          },
        ];
      };
      user_base_details: {
        Row: {
          address: string | null;
          clinic_name: string | null;
          clinic_type_id: Database['public']['Enums']['clinic_types'];
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          user_demo_status_type_id:
            | Database['public']['Enums']['user_demo_status_types']
            | null;
        };
        Insert: {
          address?: string | null;
          clinic_name?: string | null;
          clinic_type_id?: Database['public']['Enums']['clinic_types'];
          created_at?: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          user_demo_status_type_id?:
            | Database['public']['Enums']['user_demo_status_types']
            | null;
        };
        Update: {
          address?: string | null;
          clinic_name?: string | null;
          clinic_type_id?: Database['public']['Enums']['clinic_types'];
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
          user_demo_status_type_id?:
            | Database['public']['Enums']['user_demo_status_types']
            | null;
        };
        Relationships: [];
      };
      user_call_events: {
        Row: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          id: number;
          is_enabled: boolean;
          user_id: string;
        };
        Insert: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at?: string;
          id?: number;
          is_enabled?: boolean;
          user_id: string;
        };
        Update: {
          call_event_type_id?: Database['public']['Enums']['call_event_types'];
          created_at?: string;
          id?: number;
          is_enabled?: boolean;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      insert_doctor_call_call_event: {
        Args: {
          active_call_id: number;
          user_id: string;
          doctor_full_name: string;
          info: string;
        };
        Returns: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
      };
      insert_new_appointment_call_event: {
        Args: {
          active_call_id: number;
          user_id: string;
          new_appointment_id: number;
        };
        Returns: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
      };
      insert_prescription_renewal_call_event: {
        Args: {
          active_call_id: number;
          user_id: string;
          info: string;
        };
        Returns: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
      };
      insert_reschedule_cancel_appointment_call_event: {
        Args: {
          active_call_id: number;
          user_id: string;
          old_appointment_demo_call_event_id: number;
          new_appointment_id?: number;
        };
        Returns: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
      };
      insert_sick_leave_call_event: {
        Args: {
          active_call_id: number;
          user_id: string;
          info: string;
        };
        Returns: {
          call_event_type_id: Database['public']['Enums']['call_event_types'];
          created_at: string;
          extra_data: Json;
          id: number;
          incoming_demo_call_id: number;
          user_id: string;
        };
      };
    };
    Enums: {
      appointment_types:
        | 'first_consultation'
        | 'laser_treatment'
        | 'teeth_alignment';
      call_event_types:
        | 'schedule_appointment'
        | 'cancel_appointment'
        | 'reschedule_appointment'
        | 'prescription_renewal'
        | 'get_sick_leave'
        | 'doctor_call';
      call_termination_reason_types:
        | 'phone_user_not_found'
        | 'user_hanged_up'
        | 'agent_hanged_up'
        | 'unexpected_error';
      clinic_types: 'clinictype1' | 'clinictype2' | 'clinictype3';
      user_demo_status_types: 'ongoing' | 'paused' | 'finished';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
