import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListPage.module.css'; 
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';

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

  // Selection et action (support multi-select)
  const [items, setItems] = useState(() => inscriptionsData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState<'accept' | 'reject' | 'ask'>('accept');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const performAction = () => {
    if (selectedIds.length === 0) {
      setToastMessage('Veuillez sélectionner au moins une inscription.');
      setTimeout(() => setToastMessage(null), 1500);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For demo: remove processed items from the list
      setItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)));
      setToastMessage(
        `Action appliquée (${action}) sur ${selectedIds.length} inscription(s).`
      );
      setSelectedIds([]);
      setIsLoading(false);
      setTimeout(() => setToastMessage(null), 1500);
    }, 1200);
  };

  const applyAction = () => {
    if (action === 'reject') {
      // Show confirmation modal
      setConfirmOpen(true);
      return;
    }
    performAction();
  };

  const confirmReject = () => {
    setConfirmOpen(false);
    performAction();
  };

  return (
    <div className={styles.pageContainer}>
  <h1 className={styles.pageHeader}>Inscriptions en attente ({items.length})</h1>

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
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            {/* Checkbox pour sélection multiple */}
            <div className={styles.radioWrap}>
              <input
                type="checkbox"
                name="selectedInscription"
                id={`ins-${item.id}`}
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className={styles.checkbox}
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

      <div style={{ marginTop: 12 }}>
        <button className={styles.applyButton} onClick={applyAction} disabled={isLoading}>
          {isLoading ? 'Traitement...' : 'Appliquer'}
        </button>
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirmer le rejet"
        message={`Êtes-vous sûr(e) de vouloir rejeter ${selectedIds.length} inscription(s) ?`}
        onConfirm={confirmReject}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default InscriptionsAttentePage;