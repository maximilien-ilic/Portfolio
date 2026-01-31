'use client';

import { useState } from 'react';

export default function SendEmailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const envoyerEmail = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email envoyé avec succès !');
      } else {
        setMessage('Erreur lors de l\'envoi');
      }
    } catch (error) {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={envoyerEmail} disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer un email'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}