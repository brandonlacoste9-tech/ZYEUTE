// supabase/functions/notifications-dispatch/index.ts
// Deployed version - matches production Edge Function
// This handles efficient fan-out of notifications for publications/comments/reactions

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

interface DispatchPayload {
  type: 'publication' | 'comment' | 'reaction';
  actor_id: string; // UUID of the user causing the event
  entity_id: string; // UUID of the publication/comment/reaction entity
  owner_id?: string; // optional explicit owner/recipient
}

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseUrl || !serviceKey) {
  console.error('Missing required environment variables.');
}
const admin = createClient(supabaseUrl!, serviceKey!, {
  auth: { persistSession: false },
});

async function resolveRecipients(payload: DispatchPayload): Promise<string[]> {
  // If owner_id provided, deliver to owner and followers (for publication)
  if (payload.owner_id) return [payload.owner_id];
  
  // Fallback: try to infer recipients depending on type
  // For publications: notify followers of actor
  if (payload.type === 'publication') {
    const { data, error } = await admin
      .from('abonnements')
      .select('follower_id')
      .eq('followee_id', payload.actor_id);
    if (error) throw error;
    return (data ?? []).map((r: any) => r.follower_id);
  }
  
  // For comment/reaction: attempt to fetch publication owner via a secured RPC
  const { data, error } = await admin.rpc('get_publication_owner', { entity_uuid: payload.entity_id });
  if (error) throw error;
  if (data) return [data as string];
  return [];
}

async function insertNotifications(recipients: string[], payload: DispatchPayload) {
  if (recipients.length === 0) return { count: 0 };
  
  // Avoid notifying the actor themselves for follower fanout
  const filtered = recipients.filter((u) => u !== payload.actor_id);
  if (filtered.length === 0) return { count: 0 };

  const rows = filtered.map((user_id) => ({
    user_id,
    type: payload.type,
    entity_id: payload.entity_id,
    actor_id: payload.actor_id,
    payload: {}, // Keep payload for backward compatibility
    lu: false,
  }));
  
  const { error, count } = await admin.from('notifications').insert(rows, { count: 'exact' });
  if (error) throw error;
  return { count: count ?? rows.length };
}

async function handleDispatch(req: Request) {
  try {
    const payload = (await req.json()) as DispatchPayload;
    if (!payload?.type || !payload?.actor_id || !payload?.entity_id) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const recipients = await resolveRecipients(payload);
    const { count } = await insertNotifications(recipients, payload);

    // Optional: broadcast via Realtime private topic per user
    // Client can subscribe to `user:{id}:notifications` and a DB trigger can broadcast.

    return new Response(JSON.stringify({ ok: true, recipients: recipients.length, inserted: count }), {
      headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  if (req.method === 'POST' && url.pathname.endsWith('/notifications-dispatch/dispatch')) {
    return handleDispatch(req);
  }
  // Health endpoint
  if (req.method === 'GET' && url.pathname.endsWith('/notifications-dispatch/health')) {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not Found', { status: 404 });
});

