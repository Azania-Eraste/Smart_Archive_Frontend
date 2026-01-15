import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Réutiliser le même fichier de style
import styles from './../ListPage.module.css';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

// --- Données factices ---
const modificationsData = [
  {
    id: 'mod-001',
    name: 'Kylian Mbappé',
    class: '1ère A',
    details: 'Modification : Adresse du tuteur',
    date: 'Soumis le 06/11/2025',
  },
  {
    id: 'mod-002',
    name: 'Zinédine Zidane',
    class: '2nde B',
    details: 'Modification : Téléphone parent',
    date: 'Soumis le 05/11/2025',
  },
];

const ModificationsAttentePage: React.FC = () => {
  const navigate = useNavigate();

  // UI/UX improvements: multi-select, quick actions, toast, confirm modal
  const [items, setItems] = useState(() => modificationsData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState<'approve' | 'reject' | 'ask'>('approve');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const performAction = () => {
    if (selectedIds.length === 0) {
      setToastMessage('Sélectionnez au moins une modification.');
      setTimeout(() => setToastMessage(null), 1400);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // For demo: remove selected items
      setItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)));
      setToastMessage(`Action '${action}' appliquée sur ${selectedIds.length} élément(s).`);
      setSelectedIds([]);
      setLoading(false);
      setTimeout(() => setToastMessage(null), 1400);
    }, 900);
  };

  const applyAction = () => {
    if (action === 'reject') {
      setConfirmOpen(true);
      return;
    }
    performAction();
  };

  const confirmReject = () => {
    setConfirmOpen(false);
    performAction();
  };

  // Quick per-item actions
  const quickApprove = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setToastMessage('Modifications approuvées.');
      setLoading(false);
      setTimeout(() => setToastMessage(null), 1200);
    }, 700);
  };

  const quickReject = (id: string) => {
    setConfirmOpen(true);
    // store selectedIds as single id for reject confirmation
    setSelectedIds([id]);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Modifications à approuver ({items.length})</h1>

      {/* Action bar */}
      <div className={styles.actionBar}>
        <select className={styles.select} value={action} onChange={(e) => setAction(e.target.value as any)}>
          <option value="approve">Approuver</option>
          <option value="reject">Rejeter</option>
          <option value="ask">Demander info</option>
        </select>
        <button className={styles.applyButton} onClick={applyAction} disabled={loading}>
          {loading ? 'Traitement...' : 'Appliquer'}
        </button>
      </div>

      <div className={styles.listContainer}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>Aucune modification en attente.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.radioWrap}>
                <input type="checkbox" className={styles.checkbox} checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
              </div>

              <div className={styles.avatar}>{item.name.charAt(0)}</div>

              <div className={styles.info}>
                <div className={styles.name}>{item.name} <span className={styles.small}>{item.class}</span></div>
                <div className={styles.details}>{item.details}</div>
                <div className={styles.small}>{item.date}</div>
              </div>

              <div className={styles.itemActions}>
                <button className={styles.ghostButton} onClick={() => quickApprove(item.id)}>Approuver</button>
                <button className={styles.ghostButtonDanger} onClick={() => quickReject(item.id)}>Rejeter</button>
                <button className={styles.actionButton} onClick={() => navigate(`/app/modifications/attente/${item.id}`)}>Voir</button>
              </div>
            </div>
          ))
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirmer le rejet"
        message={`Êtes-vous sûr(e) de vouloir rejeter ${selectedIds.length} modification(s) ?`}
        onConfirm={confirmReject}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default ModificationsAttentePage;