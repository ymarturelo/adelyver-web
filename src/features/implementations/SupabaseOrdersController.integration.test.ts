import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SupabaseOrdersController } from './SupabaseOrdersController';
import { supabaseAdmin } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const describeIf = hasEnv ? describe : describe.skip;

describeIf('SupabaseOrdersController - integración', () => {
  let userId: string | undefined;
  let orderId: string | undefined;
  const phone = `+200${Date.now()}`;
  const email = `vitest-orders+${Date.now()}@example.com`;
  const password = 'Test1234!';

  beforeAll(async () => {
    // create a test user using admin API
    const { data: created, error } = await supabaseAdmin().auth.admin.createUser({
      email,
      phone,
      password,
    } as any);

    if (error) {
      throw error;
    }
    userId = created.user?.id;

    // insert profile
    await supabaseAdmin().from('profiles').insert({ id: userId, full_name: 'Vitest Orders', phone, email, role: 'user' });
  });

  afterAll(async () => {
    // cleanup: delete products, orders and user/profile
    try {
      if (orderId) {
        await supabaseAdmin().from('products').delete().eq('order_id', orderId);
        await supabaseAdmin().from('orders').delete().eq('id', orderId);
      }

      if (userId) {
        await supabaseAdmin().from('profiles').delete().eq('id', userId);
        await supabaseAdmin().auth.admin.deleteUser(userId);
      }
    } catch (e) {
      // ignore
    }
  });

  it('crea un pedido por admin y lo recupera', async () => {
    const createRes = await SupabaseOrdersController.createOrderByAdmin({
      clientId: userId!,
      status: 'pending',
      packagePrice: 10,
      deliveryPrice: 2,
    });

    expect(createRes.success).toBe(true);
    expect(createRes.status).toBe(201);
    orderId = (createRes.data as any)?.id;
    expect(orderId).toBeTruthy();

    const getRes = await SupabaseOrdersController.getClientOrderById(orderId!);
    expect(getRes.success).toBe(true);
    expect((getRes.data as any).id).toBe(orderId);
  });

  it('añade producto, lo actualiza y lo elimina', async () => {
    const unique = randomUUID();
    const createProd = await SupabaseOrdersController.createProductByAdmin({
      orderId: orderId!,
      idFromShop: `shop-${unique}`,
      url: 'https://example.com/item',
      name: `Test Product ${unique}`,
      trackingNumber: `TRACK-${unique}`,
    });

    expect(createProd.success).toBe(true);
    expect(createProd.status).toBe(201);

    // fetch product
    const { data: products } = await supabaseAdmin().from('products').select('*').eq('order_id', orderId);
    expect(Array.isArray(products)).toBe(true);
    const prod = (products ?? []).find((p: any) => p.tracking_number === `TRACK-${unique}`);
    expect(prod).toBeDefined();

    const productId = prod.id as string;

    // update product
    const update = await SupabaseOrdersController.updateProductByAdmin({ id: productId, name: 'Updated Name', trackingNumber: `TRACK-UPDATED-${unique}` });
    expect(update.success).toBe(true);

    // verify update
    const { data: updated } = await supabaseAdmin().from('products').select('*').eq('id', productId).single();
    expect(updated.name).toBe('Updated Name');
    expect(updated.tracking_number).toBe(`TRACK-UPDATED-${unique}`);

    // delete product
    const del = await SupabaseOrdersController.deleteProductByAdmin(productId);
    expect(del.success).toBe(true);
  });

  it('actualiza pedido por admin', async () => {
    const upd = await SupabaseOrdersController.updateOrderByAdmin({
      orderId: orderId!,
      status: 'cancelled',
    });
    expect(upd.success).toBe(true);

    const getRes = await SupabaseOrdersController.getClientOrderById(orderId!);
    expect(getRes.success).toBe(true);
    expect((getRes.data as any).status).toBe('cancelled');
  });
});
