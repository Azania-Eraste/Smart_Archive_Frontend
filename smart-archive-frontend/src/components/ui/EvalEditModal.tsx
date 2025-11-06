import React, { useEffect, useState } from 'react';
import styles from './ConfirmModal.module.css';

type Eval = {
  id: string;
  name: string;
  details?: string;
};

interface Props {
  isOpen: boolean;
  evaluation: Eval | null;
  onSave: (updated: Eval) => void;
  onCancel: () => void;
}

const EvalEditModal: React.FC<Props> = ({ isOpen, evaluation, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (evaluation) {
      setName(evaluation.name ?? '');
      setDetails(evaluation.details ?? '');
    }
  }, [evaluation]);

  if (!isOpen || !evaluation) return null;

  const handleSave = () => {
    onSave({ id: evaluation.id, name: name.trim() || evaluation.name, details: details.trim() });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>Modifier l'évaluation</div>
        <div className={styles.modalBody}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Titre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Détails</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb' }} />
        </div>
        <div className={styles.modalActions}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>Annuler</button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default EvalEditModal;
