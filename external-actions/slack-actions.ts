import { secondsToTime } from '@/utils/utils';

export const handlePendingAction = async (data: PendingActionData) => {
  try {
    switch (data.pending_action_type_id) {
      case 'user_registered': {
        sendUserRegisteredSlackNotification(data);
        return null;
      }
      case 'contract_requested': {
        sendContractRequestedNotification(data);
        return null;
      }
      case 'incoming_call': {
        sendIncomingCallSlackNotification(data);
      }
      default: {
      }
    }
  } catch (e: any) {
    console.error(e);
    return e;
  }
};

const sendUserRegisteredSlackNotification = async (
  data: UserRegisteredData,
) => {
  const { first_name, last_name, email } = data;
  const text = `${first_name} ${last_name} ${email} has just registered`;
  const response = await fetch(process.env.MISC_SLACK_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw response.statusText;
  }
};

const sendContractRequestedNotification = async (
  data: ContractRequestedData,
) => {
  const { id, first_name, last_name, email, phone } = data;
  const text = `${first_name} ${last_name} ${email} +${phone} has requested a contract`;
  const response = await fetch(
    process.env.CONTRACT_REQUESTED_SLACK_URL as string,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    },
  );
  if (!response.ok) {
    throw response.statusText;
  }
};

const sendIncomingCallSlackNotification = async (data: IncomingCallData) => {
  const { call_id, first_name, last_name, email, duration } = data;
  const text = `Call #${call_id}: ${first_name} ${last_name} ${email} just finished a call with a total length of ${secondsToTime(duration)}`;
  const response = await fetch(process.env.MISC_SLACK_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw response.statusText;
  }
};
