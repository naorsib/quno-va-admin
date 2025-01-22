type UserRegisteredData = {
  pending_action_type_id: 'user_registered';
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type ContractRequestedData = {
  pending_action_type_id: 'contract_requested';
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type IncomingCallData = {
  pending_action_type_id: 'incoming_call';
  call_id: number;
  first_name: string;
  last_name: string;
  email: string;
  duration: number;
};

type PendingActionData =
  | UserRegisteredData
  | ContractRequestedData
  | IncomingCallData;
