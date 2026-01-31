import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const body = await request.json();
    const { prenom, nom, email, message } = body;

    const { data, error } = await resend.emails.send({
      from: 'portfolio <onboarding@resend.dev>',
      to: ['maximilien.ilic@gmail.com'],
      replyTo: email,
      subject: `Nouveau message de ${prenom} ${nom}`,
      react: EmailTemplate({ prenom, nom, email, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}