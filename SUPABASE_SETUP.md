# Supabase setup

1. Create a Supabase project and copy `.env.example` to `.env.local` with its URL and anon key.
2. Run `supabase/migrations/20261001000000_customer_accounts.sql` in the SQL editor (or via the Supabase CLI).
3. In Authentication → Providers, enable Google and add your Google OAuth client credentials.
4. In Authentication → URL Configuration, add `http://localhost:3000/auth/callback` and your Vercel `/auth/callback` URL as redirect URLs.

Only the public anon key belongs in `NEXT_PUBLIC_*`; never expose the service-role key. Menu IDs intentionally reference `lib/menu-data.ts` until a managed menu table is introduced.
