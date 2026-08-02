'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

const EMPTY_FORM = { prenom: '', nom: '', email: '', message: '' };

export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResult('Message sent successfully.');
        setFormData(EMPTY_FORM);
      } else {
        setResult('Something went wrong. Please try again.');
      }
    } catch {
      setResult('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="prenom" className={styles.label}>First name:</label>
          <input
            id="prenom"
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
          <label htmlFor="nom" className={styles.label}>Last name:</label>
          <input
            id="nom"
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
        <label htmlFor="email" className={styles.label}>Email:</label>
        <input
          id="email"
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
        <label htmlFor="message" className={styles.label}>Message:</label>
        <textarea
          id="message"
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

      {result && <p className={styles.result} role="status">{result}</p>}
    </form>
  );
}
