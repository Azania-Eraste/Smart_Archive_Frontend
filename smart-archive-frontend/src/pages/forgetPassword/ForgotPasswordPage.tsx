import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';

// Type pour définir les étapes
type Step = 'email' | 'code' | 'reset';

const ForgotPasswordPage: React.FC = () => {
  // Gérer l'étape actuelle du formulaire
  const [step, setStep] = useState<Step>('email');
  
  // Gérer les données du formulaire
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(new Array(4).fill('')); // Pour les 4 cases
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // --- Logique de soumission ---

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email soumis:', email);
    // TODO: Appeler l'API pour envoyer le code
    setStep('code'); // Passer à l'étape suivante
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Code soumis:', code.join(''));
    // TODO: Appeler l'API pour valider le code
    setStep('reset'); // Passer à l'étape suivante
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouveau mot de passe:', password);
    // TODO: Appeler l'API pour changer le mot de passe
    alert('Mot de passe réinitialisé !');
    navigate('/login'); // Renvoyer au login
  };

  // --- Rendu des différentes étapes ---

  const renderEmailStep = () => (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Archive</h1>
        <p className={styles.subtitle}>
          Entrez votre email pour recevoir le code de réinitialisation
        </p>
      </header>
      <form className={styles.form} onSubmit={handleEmailSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Suivant
        </button>
      </form>
    </>
  );

  const renderCodeStep = () => (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Archive</h1>
        <p className={styles.subtitle}>
          Entrez le code reçu par email
        </p>
      </header>
      <form className={styles.form} onSubmit={handleCodeSubmit}>
        <div className={styles.codeInputContainer}>
          {/* Gérer les 4 champs de code */}
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                // Logique pour auto-remplir
                const newCode = [...code];
                newCode[index] = e.target.value;
                setCode(newCode);
                // TODO: Gérer l'auto-focus vers le champ suivant
              }}
              className={`${styles.input} ${styles.codeInput}`}
              required
            />
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>
          Suivant
        </button>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Archive</h1>
        <p className={styles.subtitle}>
          Entrez le nouveau mot de passe
        </p>
      </header>
      <form className={styles.form} onSubmit={handleResetSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Mot de passe</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Se connecter
        </button>
      </form>
    </>
  );

  return (
    <div className={styles.container}>
      {/* Affiche la bonne étape en fonction de l'état 'step' */}
      {step === 'email' && renderEmailStep()}
      {step === 'code' && renderCodeStep()}
      {step === 'reset' && renderResetStep()}

      <Link to="/login" className={styles.backLink}>
        Retour à la connexion
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;