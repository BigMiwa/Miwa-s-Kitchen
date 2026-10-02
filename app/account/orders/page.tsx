import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { business } from '@/lib/business-config';

type OrderRow = { order_number: string; created_at: string; fulfilment_type: 'collection' | 'delivery'; fulfilment_status: string; payment_status: string; total_amount: number };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/account');
  const { data, error } = await supabase.from('orders').select('order_number,created_at,fulfilment_type,fulfilment_status,payment_status,total_amount').eq('user_id', user.id).order('created_at', { ascending: false });
  const orders = (data || []) as OrderRow[];
  return <main className="shell max-w-4xl pb-24 pt-10"><p className="eyebrow">Your table</p><h1 className="mt-2 text-4xl font-black text-[#481d38]">My orders</h1>{error ? <div className="card mt-7 p-6"><p>We couldn’t load your orders just now.</p><Link className="btn-secondary mt-4" href="/account/orders">Try again</Link></div> : orders.length ? <div className="mt-7 space-y-3">{orders.map(order => <Link key={order.order_number} href={`/orders/${order.order_number}`} className="card block p-5 transition hover:-translate-y-0.5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black text-[#481d38]">{order.order_number}</p><p className="mt-1 text-sm text-[#65595a]">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(order.created_at))} · {order.fulfilment_type === 'delivery' ? 'Delivery' : 'Collection'}</p></div><b>{business.currencySymbol}{(order.total_amount / 100).toFixed(2)}</b></div><p className="mt-3 text-sm"><span className="font-bold">Payment:</span> {order.payment_status === 'pending' ? 'Pending' : order.payment_status} · <span className="font-bold">Fulfilment:</span> {order.fulfilment_status.replaceAll('_', ' ')}</p></Link>)}</div> : <div className="card mt-7 p-10 text-center"><h2 className="text-2xl font-black text-[#481d38]">No orders yet.</h2><p className="mt-2 text-[#65595a]">When you place an order, you’ll find it here.</p><Link className="btn-primary mt-6" href="/menu">Browse the menu</Link></div>}</main>;
}
