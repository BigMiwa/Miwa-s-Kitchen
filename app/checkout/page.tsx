'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/miwas-kitchen/navigation';
import { useKitchen } from '@/components/miwas-kitchen/kitchen-provider';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutEntry() {
  const router = useRouter(); const { cart } = useKitchen(); const [message, setMessage] = useState('Checking your secure checkout…');
  useEffect(() => { const client = createClient(); if (!cart.length) { router.replace('/cart'); return; } if (!client) { setMessage('Sign-in is being configured.'); return; } client.auth.getUser().then(async ({ data }) => { if (data.user) return router.replace('/checkout/delivery'); setMessage('Sign in with Google to continue to delivery details.'); await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback?next=/checkout/delivery` } }); }); }, [cart.length, router]);
  return <><Navigation /><main className="shell grid min-h-[65vh] place-items-center pb-24 text-center"><div><p className="eyebrow">Secure checkout</p><h1 className="mt-3 text-3xl font-black text-[#481d38]">{message}</h1><p className="mt-3 text-[#65595a]">Your cart stays with you while you sign in.</p><Link className="btn-secondary mt-6" href="/cart">Back to cart</Link></div></main></>;
}
