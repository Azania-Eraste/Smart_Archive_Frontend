import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  // Gérer l'état des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Gérer la soumission du formulaire
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // C'est ici que vous appellerez votre API backend (Python)
    console.log('Tentative de connexion avec:', { email, password });

    // TODO: Implémenter la logique d'authentification réelle (appel API, gestion des erreurs)
    // Pour l'instant, on redirige vers /app après le submit
    navigate('/app');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Archive</h1>
        <p className={styles.subtitle}>
          Connectez-vous pour accéder aux différents
          services de SmartArchive
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Champ Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="school@gmail.com"
            required
          />
        </div>

        {/* Champ Mot de passe */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Mot de passe</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="MonMotDePasse"
            required
          />
        </div>

        {/* Lien Mot de passe oublié */}
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Mot de passe oublié ?
        </Link>

        {/* Bouton de Connexion */}
        <button type="submit" className={styles.submitButton}>
          Se connecter
        </button>
      </form>

      {/* Séparateur "OU" */}
      <div className={styles.divider}>ou</div>

      {/* Boutons de connexion sociale (Google, etc.) */}
      <div className={styles.socialLogin}>
        <button className={styles.socialButton} aria-label="Connexion Google"></button>
        <button className={styles.socialButton} aria-label="Connexion Facebook"></button>
        <button className={styles.socialButton} aria-label="Connexion Apple"></button>
      </div>
    </div>
  );
};

export default LoginPage;