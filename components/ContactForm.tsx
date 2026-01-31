'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultat('');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResultat('Email envoyé avec succès !');
        setFormData({ nom: '', prenom: '', email: '', message: '' });
      } else {
        setResultat('Erreur lors de l\'envoi');
      }
    } catch (error) {
      setResultat('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Prénom :</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Nom :</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email :</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Message :</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>

      {resultat && <p>{resultat}</p>}
    </form>
  );
}