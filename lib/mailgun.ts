import { orderEmail } from '@/lib/orders/email';

type ConfirmationOrder = { number: string; name: string; email: string; fulfilment: string; total: number; subtotal: number; delivery: number; items: { name: string; quantity: number; total: number }[] };

export async function sendOrderConfirmation(order: ConfirmationOrder) {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL;
  if (!key || !domain || !from) return { sent: false, reason: 'not_configured' };
  const form = new URLSearchParams({ from: `Miwa's Kitchen <${from}>`, to: order.email, subject: `We received order ${order.number}`, html: orderEmail(order) });
  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString() });
  return { sent: response.ok, reason: response.ok ? undefined : 'provider_error' };
}
