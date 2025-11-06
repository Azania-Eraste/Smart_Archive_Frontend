import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EleveDossierPage.module.css';
import listStyles from './ListPage.module.css'; 
// Importer les nouvelles icônes pour le tableau
import { MdArrowBack, MdAdd, MdFilePresent, MdVisibility, MdGetApp, MdDelete, MdSwapHoriz } from 'react-icons/md';
import ImportDocumentModal from '../components/common/ImportDocumentModal';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';

// ... (Données factices inchangées) ...
const documentsData = [
  { id: 'doc-001', name: 'Bulletin Trimestre 1', type: 'Bulletin', date: '15/12/2023' },
  { id: 'doc-002', name: 'Acte de naissance', type: 'Administratif', date: '01/09/2023' },
  { id: 'doc-003', name: 'Fiche médicale', type: 'Médical', date: '02/09/2023' },
];

const EleveDossierPage: React.FC = () => {
  const { annee } = useParams<{ annee?: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docs, setDocs] = useState(documentsData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [replaceDocId, setReplaceDocId] = useState<string | null>(null);

  const handleAddDocumentClick = () => {
    setReplaceDocId(null);
    setIsModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1400);
  };

  // ... (Logique factice inchangée) ...
  const eleveName = "Lamine";
  const className = annee === "2023-2024" ? "4eme A" : "Dossier";

  return (
    <div className={styles.pageContainer}>
      {/* En-tête avec bouton Retour (inchangé) */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>{`${eleveName} - ${className}`}</h1>
      </div>

      {/* MODIFICATION : Conteneur pour le header des actions */}
      <div className={styles.headerActions}>
        <h2 className={styles.docHeader}>Documents</h2>
        {/* Bouton "Ajouter un Document" (Maintenant aligné) */}
        <button 
          className={styles.addButton}
          onClick={handleAddDocumentClick}
        >
          <span className={styles.addButtonIcon}><MdAdd /></span>
          Ajouter un Document
        </button>
      </div>

      {/* --- VUE LISTE (pour Mobile) --- */}
      {/* MODIFICATION : Ajout d'une classe pour le cacher sur desktop */}
      <section className={styles.mobileListSection}>
        <div className={listStyles.listContainer}>
          {docs.map((doc) => (
            <div key={doc.id} className={listStyles.item}>
              <div className={listStyles.avatar}>PDF</div>
              <div className={listStyles.info}>
                <div className={listStyles.name}>{doc.name}</div>
                <div className={listStyles.details}>Ajouté le {doc.date}</div>
              </div>
              <div className={listStyles.itemActions}>
                <button className={listStyles.ghostButton} title="Voir" onClick={() => showToast('Aperçu non disponible (simulation)')}>
                  <MdVisibility />
                </button>
                <button className={listStyles.ghostButton} title="Télécharger" onClick={() => showToast('Téléchargement simulé')}>
                  <MdGetApp />
                </button>
                <button className={listStyles.ghostButton} title="Remplacer" onClick={() => { setReplaceDocId(doc.id); setIsModalOpen(true); }}>
                  <MdSwapHoriz />
                </button>
                <button className={listStyles.ghostButtonDanger} title="Supprimer" onClick={() => { setToDeleteId(doc.id); setConfirmOpen(true); }}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- VUE TABLEAU (pour Desktop) --- */}
      <section className={styles.desktopTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Date d'ajout</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className={styles.tableRow}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={styles.docIcon}><MdFilePresent /></span>
                    <span>{doc.name}</span>
                  </div>
                </td>
                <td>{doc.type}</td>
                <td>{doc.date}</td>
                <td>
                  <div className={listStyles.itemActions}>
                    <button className={listStyles.ghostButton} title="Voir" onClick={() => showToast('Aperçu non disponible (simulation)')}>
                      <MdVisibility />
                    </button>
                    <button className={listStyles.ghostButton} title="Télécharger" onClick={() => showToast('Téléchargement simulé')}>
                      <MdGetApp />
                    </button>
                    <button className={listStyles.ghostButton} title="Remplacer" onClick={() => { setReplaceDocId(doc.id); setIsModalOpen(true); }}>
                      <MdSwapHoriz />
                    </button>
                    <button className={listStyles.ghostButtonDanger} title="Supprimer" onClick={() => { setToDeleteId(doc.id); setConfirmOpen(true); }}>
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal (inchangé) */}
      <ImportDocumentModal 
        isOpen={isModalOpen}
        onClose={() => {
          // Simulation: si replaceDocId est défini -> remplacer, sinon ajouter
          setIsModalOpen(false);
          if (replaceDocId) {
            showToast('Document remplacé (simulation)');
            setReplaceDocId(null);
          } else {
            // Ajouter un document simulé
            const newDoc = { id: `doc-${Date.now()}`, name: 'Nouveau document', type: 'Autre', date: new Date().toLocaleDateString() };
            setDocs((d) => [newDoc, ...d]);
            showToast('Document ajouté (simulation)');
          }
        }}
      />

      {toastMessage && <Toast message={toastMessage} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le document"
        message={`Voulez-vous vraiment supprimer ce document ?`}
        onConfirm={() => {
          if (toDeleteId) setDocs((d) => d.filter((x) => x.id !== toDeleteId));
          setConfirmOpen(false);
          showToast('Document supprimé');
          setToDeleteId(null);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default EleveDossierPage;