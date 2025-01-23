import { handlePendingAction } from '@/external-actions/slack-actions';
import { createAdminClient } from '@/utils/supabase/admin-server';

const MAX_RETRIES = 3;
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
  const supabase_admin = await createAdminClient();

  const { data, error } = await supabase_admin
    .from('pending_actions')
    .select()
    .eq('completed', false);

  if (error) {
    const json_error = JSON.stringify(error);
    console.log(json_error);
    return new Response(`Failure: ${json_error}`);
  }
  data?.forEach(async action => {
    if (action.data) {
      const pending_action_data = Object.assign(action.data, {
        pending_action_type_id: action.pending_action_type_id,
      }) as PendingActionData;
      const error_ = await handlePendingAction(pending_action_data);

      if (error) {
        const errors = [...(action.errors || []), error_];
        const update_object = { errors };
        if (errors.length === MAX_RETRIES) {
          Object.assign(update_object, { completed: true });
        }
        await supabase_admin
          .from('pending_actions')
          .update(update_object)
          .eq('id', action.id);
      } else {
        const success_at = new Date().toISOString();
        await supabase_admin
          .from('pending_actions')
          .update({ success_at, completed: true })
          .eq('id', action.id);
      }
    }
  });
  return new Response(`Success`);
}
