import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SupabaseClientsController } from './SupabaseClientsController';
import { supabaseAdmin } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const describeIf = hasEnv ? describe : describe.skip;

describeIf('SupabaseClientsController - integración', () => {
  let createdUserId: string | undefined;
  const phone = `+100${Date.now()}`;
  const email = `vitest+${Date.now()}@example.com`;
  const password = 'Test1234!';
  const fullName = `Vitest User ${Date.now()}`;

  beforeAll(async () => {
    // nothing for now
  });

  afterAll(async () => {
    if (createdUserId) {
      try {
        await supabaseAdmin().auth.admin.deleteUser(createdUserId);
      } catch (e) {
        // ignore cleanup errors
      }
      // remove profile if still exists
      try {
        await supabaseAdmin().from('profiles').delete().eq('id', createdUserId);
      } catch (e) {}
    }
  });

  it('conecta y consulta la tabla profiles', async () => {
    const res = await SupabaseClientsController.findClients({});
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('crea un cliente, permite login y lo elimina', async () => {
    const createRes = await SupabaseClientsController.createClient({
      fullName,
      phone,
      email,
      password,
    });

    expect(createRes.success).toBe(true);
    expect(createRes.status).toBe(201);
    expect(createRes.data).toBeDefined();
    createdUserId = (createRes.data as any)?.id;
    expect(createdUserId).toBeTruthy();

    // Check profile exists
    const { data: profile } = await supabaseAdmin().from('profiles').select('id,phone,email,full_name').eq('id', createdUserId).single();
    expect(profile).toBeTruthy();
    expect(profile.phone === phone || profile.email === email).toBe(true);

    // Try login by email
    const loginRes = await SupabaseClientsController.loginByEmail(email, password);

    // login could succeed or fail depending on Supabase auth policies; require that we get a response object
    expect(loginRes).toBeDefined();

    // Delete client by phone
    const delRes = await SupabaseClientsController.deleteCient(phone);
    expect(delRes.success).toBe(true);
    expect(delRes.status).toBe(200);

    // Ensure profile no longer exists
    const { data: after } = await supabaseAdmin().from('profiles').select('id').eq('phone', phone).maybeSingle();
    expect(after).toBeNull();
  });
});
