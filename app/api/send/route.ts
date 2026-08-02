import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/EmailTemplate';
import { CONTACT_EMAIL } from '@/data/site';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One spec per accepted field: adding a field means adding a line here.
const FIELDS = {
  prenom: { maxLength: 100 },
  nom: { maxLength: 100 },
  email: { maxLength: 254, pattern: EMAIL_PATTERN },
  message: { maxLength: 5000 },
} as const;

type ContactForm = Record<keyof typeof FIELDS, string>;

/** Returns the trimmed fields, or null if any one of them is missing or invalid. */
function parseContactForm(body: Record<string, unknown>): ContactForm | null {
  const parsed = {} as ContactForm;

  for (const [name, spec] of Object.entries(FIELDS)) {
    const value = body[name];
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (!trimmed || trimmed.length > spec.maxLength) return null;
    if ('pattern' in spec && !spec.pattern.test(trimmed)) return null;

    parsed[name as keyof ContactForm] = trimmed;
  }

  return parsed;
}

export async function POST(request: NextRequest) {
  // Read at request time: `new Resend()` throws on a missing key, and doing that
  // at module scope fails `next build` whenever the env var is absent.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set; the contact form cannot send email.');
    return Response.json({ error: 'Unable to send the message.' }, { status: 500 });
  }

  try {
    const form = parseContactForm(await request.json());
    if (!form) {
      return Response.json({ error: 'Invalid form submission.' }, { status: 400 });
    }

    const { error } = await new Resend(apiKey).emails.send({
      from: 'portfolio <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: form.email,
      subject: `Nouveau message de ${form.prenom} ${form.nom}`,
      react: EmailTemplate(form),
    });

    if (error) {
      console.error('Resend failed to send the contact email:', error);
      return Response.json({ error: 'Unable to send the message.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Unexpected error in the contact endpoint:', error);
    return Response.json({ error: 'Unable to send the message.' }, { status: 500 });
  }
}
