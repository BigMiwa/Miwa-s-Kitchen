import { createServerClient } from '@supabase/ssr'; import { cookies } from 'next/headers';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://tubnwdidtqovuunwzvkw.supabase.co';const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_ljpESmJLs9bXplcrxF6PZg_phNDg1uh';
export async function createClient(){const jar=await cookies();return createServerClient(url,key,{cookies:{getAll:()=>jar.getAll(),setAll:()=>{}}})}
