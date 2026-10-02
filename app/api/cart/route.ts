import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { menu } from '@/lib/menu-data';

type RequestedLine = { menuItemId: string; quantity: number };

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { data, error } = await supabase.from('carts').select('id,cart_items(menu_item_id,quantity,selected_options,special_instructions)').eq('user_id', user.id).eq('status', 'active').maybeSingle();
  if (error) return NextResponse.json({ error: 'Unable to load cart.' }, { status: 500 });
  return NextResponse.json({ cart: data });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const body = await request.json() as { items?: RequestedLine[] };
  const items = body.items || [];
  if (items.some(item => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || !menu.some(dish => dish.id === item.menuItemId && dish.available))) return NextResponse.json({ error: 'Your cart contains an unavailable or invalid item.' }, { status: 400 });
  const { data: cart, error: cartError } = await supabase.from('carts').upsert({ user_id: user.id, status: 'active' }, { onConflict: 'user_id,status' }).select('id').single();
  if (cartError || !cart) return NextResponse.json({ error: 'Unable to save cart.' }, { status: 500 });
  const { error: clearError } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  if (clearError) return NextResponse.json({ error: 'Unable to save cart.' }, { status: 500 });
  if (items.length) { const { error } = await supabase.from('cart_items').insert(items.map(item => ({ cart_id: cart.id, menu_item_id: item.menuItemId, quantity: item.quantity }))); if (error) return NextResponse.json({ error: 'Unable to save cart.' }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
