import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'portfolio <onboarding@resend.dev>',
      to: ['maximilien.ilic@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return Response.json({ error }, { status: 500 });
    }

    console.log('Email envoyé avec succès:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Erreur catch:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}