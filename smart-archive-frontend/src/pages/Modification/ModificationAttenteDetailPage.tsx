import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './../ListPage.module.css';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

interface ModificationDetail {
  id: string;
  name: string;
  class: string;
  date: string;
  original: Record<string, string>;
  proposed: Record<string, string>;
}

// Simulation d'une récupération de détail
const fetchModification = (id: string): Promise<ModificationDetail> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: id === 'mod-002' ? 'Zinédine Zidane' : 'Kylian Mbappé',
        class: id === 'mod-002' ? '2nde B' : '1ère A',
        date: 'Soumis le 06/11/2025',
        original: {
          'Adresse tuteur': '12 rue des Fleurs, 75000 Paris',
          'Téléphone': '07 00 00 00 00',
        },
        proposed: {
          'Adresse tuteur': '14 avenue des Champs, 75008 Paris',
          'Téléphone': '06 11 22 33 44',
        },
      });
    }, 400);
  });
};

const ModificationAttenteDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ModificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchModification(id).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [id]);

  const handleApprove = () => {
    setToast('Modification approuvée.');
    setTimeout(() => setToast(null), 1200);
    setTimeout(() => navigate(-1), 900);
  };

  const handleReject = () => {
    setConfirmOpen(true);
  };

  const confirmReject = () => {
    setConfirmOpen(false);
    setToast('Modification rejetée.');
    setTimeout(() => setToast(null), 1200);
    setTimeout(() => navigate(-1), 900);
  };

  if (loading) return <div className={styles.pageContainer}><p>Chargement...</p></div>;

  if (!detail) return <div className={styles.pageContainer}><p>Détail introuvable.</p></div>;

  // Prepare rows for diff
  const keys = Array.from(new Set([...Object.keys(detail.original), ...Object.keys(detail.proposed)]));

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Détails de la modification</h1>

      <div className={styles.item} style={{ alignItems: 'flex-start' }}>
        <div className={styles.avatar}>{detail.name.charAt(0)}</div>
        <div className={styles.info}>
          <div className={styles.name}>{detail.name} <span className={styles.small}>{detail.class}</span></div>
          <div className={styles.small}>{detail.date}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <div>
          <h3>Avant</h3>
          <div className={styles.item} style={{ flexDirection: 'column' }}>
            {keys.map((k) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{k}</div>
                <div className={styles.small}>{detail.original[k] ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Proposition</h3>
          <div className={styles.item} style={{ flexDirection: 'column' }}>
            {keys.map((k) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{k}</div>
                <div className={styles.small}>{detail.proposed[k] ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
        <button className={styles.actionButton} onClick={handleApprove}>Approuver</button>
        <button className={styles.ghostButtonDanger} onClick={handleReject}>Rejeter</button>
        <button className={styles.ghostButton} onClick={() => navigate(-1)}>Retour</button>
      </div>

      {toast && <Toast message={toast} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirmer le rejet"
        message={`Voulez-vous vraiment rejeter la modification ${detail.id} ?`}
        onConfirm={confirmReject}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default ModificationAttenteDetailPage;
