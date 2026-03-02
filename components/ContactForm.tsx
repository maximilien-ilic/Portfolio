'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Prénom :</label>
          <input
            type="text"
            name="prenom"
            placeholder="first_name"
            value={formData.prenom}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nom :</label>
          <input
            type="text"
            name="nom"
            placeholder="last_name"
            value={formData.nom}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email :</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Message :</label>
        <textarea
          name="message"
          placeholder="your message..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={styles.textarea}
        />
      </div>

      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? '> sending...' : '> send'}
      </button>

      {resultat && <p className={styles.result}>{resultat}</p>}
    </form>
  );
}