import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type SupabaseCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const requestedNext = url.searchParams.get('next');
  const next = requestedNext && requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/account';

  if (!code) return NextResponse.redirect(new URL('/cart?auth=cancelled', url.origin));

  const jar = await cookies();
  const response = NextResponse.redirect(new URL(next, url.origin));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tubnwdidtqovuunwzvkw.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ljpESmJLs9bXplcrxF6PZg_phNDg1uh';
  const client = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (items: SupabaseCookie[]) => {
          items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  await client.auth.exchangeCodeForSession(code);
  return response;
}
