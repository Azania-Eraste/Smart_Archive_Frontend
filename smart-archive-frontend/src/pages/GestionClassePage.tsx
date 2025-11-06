import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './GestionClassePage.module.css';
import { MdArrowBack, MdAdd, MdArticle, MdAssessment, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import ConfirmModal from '../components/ui/ConfirmModal';
import Toast from '../components/ui/Toast';
import EvalEditModal from '../components/ui/EvalEditModal';

// --- Données factices ---
const evaluationsData = [
  { id: 'eval-001', name: 'Devoir 1', details: 'Coefficient 2 - 15/30 notes saisies' },
  { id: 'eval-002', name: 'Interro 1', details: 'Coefficient 1 - 30/30 notes saisies' },
  { id: 'eval-003', name: 'Devoir 2', details: 'Coefficient 2 - 0/30 notes saisies' },
];

const GestionClassePage: React.FC = () => {
  // Récupérer l'ID du cours depuis l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [items, setItems] = useState(evaluationsData);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; details?: string } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  };

  const handleDelete = (idToDelete: string) => {
    setToDeleteId(idToDelete);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDeleteId) return;
    setItems((it) => it.filter((i) => i.id !== toDeleteId));
    setConfirmOpen(false);
    showToast('Évaluation supprimée');
    setToDeleteId(null);
  };

  const handleEdit = (item: { id: string; name: string; details?: string }) => {
    setEditing(item);
    setEditOpen(true);
  };

  const handleSaveEdit = (updated: { id: string; name: string; details: string }) => {
    setItems((it) => it.map((i) => i.id === updated.id ? { ...i, name: updated.name, details: updated.details } : i));
    setEditOpen(false);
    setEditing(null);
    showToast('Évaluation modifiée');
  };

  // render

  // Logique factice pour le titre
  const pageTitle = `6ème A - Mathématiques`; // (On le récupérera de l'API)

  return (
    <div className={styles.pageContainer}>
      {/* En-tête avec bouton Retour */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      {/* Boutons d'action (Maquette Étape 2) */}
        <div className={styles.actionsContainer}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
          <input
            aria-label="Recherche évaluations"
            placeholder="Rechercher une évaluation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.iconOnly} aria-label="Rechercher"><MdSearch /></button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.primaryButton} onClick={() => showToast('Créer - fonctionnalité simulée')}>
            <span className={styles.icon}><MdAdd /></span>
            Créer une Évaluation
          </button>
          <button className={styles.secondaryButton} onClick={() => showToast('Génération de bulletins (simulation)')}>
            <span className={styles.icon}><MdArticle /></span>
            Générer les Bulletins
          </button>
        </div>
      </div>

      {/* Liste des Évaluations (Maquette Étape 2) */}
      <section>
        <h2 className={styles.listHeader}>Évaluations</h2>
        <div className={styles.listContainer}>
          {items.filter((it) => it.name.toLowerCase().includes(query.toLowerCase())).map((evalItem) => (
            // Chaque item est un lien vers la grille de saisie (Étape 3)
            <Link
              to={`/app/cours/${id}/evaluation/${evalItem.id}`}
              key={evalItem.id}
              className={styles.item}
            >
              <div className={styles.itemIcon}><MdAssessment /></div>
              <div className={styles.info}>
                <div className={styles.name}>{evalItem.name}</div>
                <div className={styles.details}>{evalItem.details}</div>
              </div>
              <div className={styles.itemActions}>
                <Link to={`/app/cours/${id}/evaluation/${evalItem.id}`} className={styles.actionLink} onClick={() => showToast('Ouvrir saisie (simulation)')}>Saisie</Link>
                <button className={styles.iconBtn} onClick={(e) => { e.preventDefault(); handleEdit(evalItem); }} title="Éditer"><MdEdit /></button>
                <button className={styles.iconBtnDanger} onClick={(e) => { e.preventDefault(); handleDelete(evalItem.id); }} title="Supprimer"><MdDelete /></button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {toast && <Toast message={toast} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer l'évaluation"
        message={`Voulez-vous vraiment supprimer cette évaluation ?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <EvalEditModal
        isOpen={editOpen}
        evaluation={editing}
        onSave={(updated) => handleSaveEdit({ id: updated.id, name: updated.name, details: updated.details ?? '' })}
        onCancel={() => { setEditOpen(false); setEditing(null); }}
      />
    </div>
  );
};

export default GestionClassePage;
