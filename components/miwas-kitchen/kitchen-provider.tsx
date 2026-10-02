'use client';
import {createContext,useContext,useState} from 'react';
import type {Dish} from '@/lib/menu-data';
type CartLine={dish:Dish;quantity:number}; type Store={saved:string[];cart:CartLine[];toggleSaved:(id:string)=>void;add:(dish:Dish,quantity?:number)=>void;update:(id:string,quantity:number)=>void};
const C=createContext<Store|null>(null); export const useKitchen=()=>{const c=useContext(C);if(!c)throw Error('Kitchen provider missing');return c};
export function KitchenProvider({children}:{children:React.ReactNode}){const [saved,setSaved]=useState<string[]>([]);const [cart,setCart]=useState<CartLine[]>([]);const toggleSaved=(id:string)=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);const add=(dish:Dish,quantity=1)=>setCart(c=>{const line=c.find(x=>x.dish.id===dish.id);return line?c.map(x=>x.dish.id===dish.id?{...x,quantity:x.quantity+quantity}:x):[...c,{dish,quantity}]});const update=(id:string,quantity:number)=>setCart(c=>quantity<1?c.filter(x=>x.dish.id!==id):c.map(x=>x.dish.id===id?{...x,quantity}:x));return <C.Provider value={{saved,cart,toggleSaved,add,update}}>{children}</C.Provider>}
