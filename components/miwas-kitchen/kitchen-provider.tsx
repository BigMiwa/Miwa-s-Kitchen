'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Dish } from '@/lib/menu-data';
import { menu } from '@/lib/menu-data';
import { createClient } from '@/lib/supabase/client';

type CartLine = { dish: Dish; quantity: number };
type Store = { saved: string[]; cart: CartLine[]; toggleSaved: (id: string) => void; add: (dish: Dish, quantity?: number) => void; update: (id: string, quantity: number) => void; clearCart: () => void };
const KitchenContext = createContext<Store | null>(null);
export const useKitchen = () => { const value = useContext(KitchenContext); if (!value) throw new Error('Kitchen provider missing'); return value; };

export function KitchenProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]); const [cart, setCart] = useState<CartLine[]>([]); const [ready, setReady] = useState(false); const signedIn = useRef(false);
  useEffect(() => { const client = createClient(); if (!client) { setReady(true); return; } client.auth.getUser().then(async ({ data }) => { if (!data.user) { setReady(true); return; } signedIn.current = true; const response = await fetch('/api/cart'); if (response.ok) { const payload = await response.json() as { cart: { cart_items?: { menu_item_id: string; quantity: number }[] } | null }; const remote = (payload.cart?.cart_items || []).flatMap(line => { const dish = menu.find(item => item.id === line.menu_item_id); return dish ? [{ dish, quantity: line.quantity }] : []; }); setCart(current => { const merged = [...remote]; current.forEach(local => { const existing = merged.find(line => line.dish.id === local.dish.id); if (existing) existing.quantity += local.quantity; else merged.push(local); }); return merged; }); } setReady(true); }); }, []);
  useEffect(() => { if (!ready || !signedIn.current) return; void fetch('/api/cart', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart.map(line => ({ menuItemId: line.dish.id, quantity: line.quantity })) }) }); }, [cart, ready]);
  const toggleSaved = (id: string) => setSaved(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  const add = (dish: Dish, quantity = 1) => setCart(items => { const existing = items.find(item => item.dish.id === dish.id); return existing ? items.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { dish, quantity }]; });
  const update = (id: string, quantity: number) => setCart(items => quantity < 1 ? items.filter(item => item.dish.id !== id) : items.map(item => item.dish.id === id ? { ...item, quantity } : item));
  return <KitchenContext.Provider value={{ saved, cart, toggleSaved, add, update, clearCart: () => setCart([]) }}>{children}</KitchenContext.Provider>;
}
