import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../contexts/AuthContext'; // Assurez-vous que le chemin est bon
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  // --- ÉTATS ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [loading, setLoading] = useState(false); // Pour l'effet de chargement

  // --- HOOKS ---
  const { login } = useAuth(); // On récupère la fonction login du contexte
  const navigate = useNavigate();

  // --- GESTION DE LA SOUMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialisation des états
    setError('');
    setLoading(true);

    try {
      // Appel au Backend Django via le Contexte
      await login(email, password);
      
      // Si succès, redirection vers le dashboard
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error(err);
      // Gestion des erreurs spécifiques
      if (err.response && err.response.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        setError("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      // On arrête le chargement quoi qu'il arrive
      setLoading(false);
    }
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

      {/* Affichage des erreurs ici */}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '5px' }}>
          {error}
        </div>
      )}

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
            disabled={loading} // Désactivé pendant le chargement
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
            placeholder="Votre mot de passe"
            required
            disabled={loading}
          />
        </div>

        {/* Lien Mot de passe oublié */}
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Mot de passe oublié ?
        </Link>

        {/* Bouton de Connexion */}
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading} // Empêche de cliquer 2 fois
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <div className={styles.divider}>ou</div>

      <div className={styles.socialLogin}>
        <button className={styles.socialButton} aria-label="Connexion Google"></button>
        <button className={styles.socialButton} aria-label="Connexion Facebook"></button>
        <button className={styles.socialButton} aria-label="Connexion Apple"></button>
      </div>
    </div>
  );
};

export default LoginPage;