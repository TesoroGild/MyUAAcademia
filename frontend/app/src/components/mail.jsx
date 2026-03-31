import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const MailForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'YOUR_SERVICE_ID',     // ex: 'contact_service'
      'YOUR_TEMPLATE_ID',    // ex: 'contact_form'
      form.current,
      'YOUR_PUBLIC_KEY'      // ex: 'user_xxxxxxxx'
    )
    .then(() => {
      alert('Message envoyé avec succès !');
    })
    .catch((error) => {
      console.error('Erreur lors de l’envoi :', error);
      alert('Échec de l’envoi du message.');
    });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Nom</label>
      <input type="text" name="name" required />

      <label>Email</label>
      <input type="email" name="email" required />

      <label>Sujet</label>
      <input type="text" name="title" required />

      <label>Message</label>
      <textarea name="message" required />

      <input type="submit" value="Envoyer" />
    </form>
  );
};

export default MailForm;