import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListPage.module.css'; 
import Toast from '../components/ui/Toast';

// --- Données factices ---
// (Simule les dossiers soumis par la Secrétaire)
const inscriptionsData = [
  { 
    id: 'inscription-123', 
    name: 'Warren Zaïre-Emery', 
    class: '6ème B', 
    date: 'Soumis le 05/11/2025' 
  },
  { 
    id: 'inscription-124', 
    name: 'Bradley Barcola', 
    class: 'CM2 A', 
    date: 'Soumis le 04/11/2025' 
  },
];

const InscriptionsAttentePage: React.FC = () => {
  // Le hook 'navigate' nous permettra de rediriger l'utilisateur
  const navigate = useNavigate();

  // Selection et action
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [action, setAction] = useState<'accept' | 'reject' | 'ask'>("accept");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const applyAction = () => {
    if (!selectedId) {
      setToastMessage('Veuillez sélectionner une inscription.');
      setTimeout(() => setToastMessage(null), 1500);
      return;
    }

    // Logique temporaire : afficher toast puis (optionnel) redirection
    let label = '';
    if (action === 'accept') label = 'Acceptée';
    if (action === 'reject') label = 'Rejetée';
    if (action === 'ask') label = 'Demande d\'informations envoyée';

    setToastMessage(`Inscription ${label} (${selectedId})`);
    setTimeout(() => setToastMessage(null), 1200);

    // Optionnel : rediriger vers la page de détail
    // navigate(`/app/inscriptions/attente/${selectedId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Inscriptions en attente ({inscriptionsData.length})</h1>

      {/* Barre d'actions : select + appliquer */}
      <div className={styles.actionBar}>
        <select
          className={styles.select}
          value={action}
          onChange={(e) => setAction(e.target.value as any)}
          aria-label="Choisir une action"
        >
          <option value="accept">Accepter</option>
          <option value="reject">Rejeter</option>
          <option value="ask">Demander des informations</option>
        </select>

        <button className={styles.applyButton} onClick={applyAction}>
          Appliquer
        </button>
      </div>

      <div className={styles.listContainer}>
        {inscriptionsData.map((item) => (
          <div key={item.id} className={styles.item}>
            {/* Radio pour sélectionner l'élément */}
            <div className={styles.radioWrap}>
              <input
                type="radio"
                name="selectedInscription"
                id={`ins-${item.id}`}
                checked={selectedId === item.id}
                onChange={() => setSelectedId(item.id)}
                className={styles.radio}
              />
            </div>

            {/* Avatar avec l'initiale */}
            <div className={styles.avatar}>
              {item.name.charAt(0)}
            </div>
            
            {/* Infos */}
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.details}>
                {item.class} - {item.date}
              </div>
            </div>

            {/* Bouton détail */}
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => navigate(`/app/inscriptions/attente/${item.id}`)}
              >
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" />}
    </div>
  );
};

export default InscriptionsAttentePage;