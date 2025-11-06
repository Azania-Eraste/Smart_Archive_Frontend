import React, { useState } from 'react'; // 1. Importer useState
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EleveDossierPage.module.css';
import listStyles from './ListPage.module.css'; 
import { MdArrowBack, MdAdd } from 'react-icons/md';

// 2. Importer le modal que nous venons de créer
import ImportDocumentModal from '../components/common/ImportDocumentModal';

// ... (données factices inchangées)
const documentsData = [/* ... */];

const EleveDossierPage: React.FC = () => {
  const { id, annee } = useParams<{ id: string; annee: string }>();
  const navigate = useNavigate();

  // 3. Gérer l'état d'ouverture du modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4. Mettre à jour la fonction du bouton
  const handleAddDocumentClick = () => {
    setIsModalOpen(true); // Ouvre le modal
  };

  // ... (logique factice inchangée)
  const eleveName = "Lamine";
  const className = annee === "2023-2024" ? "4eme A" : "Dossier";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>{`${eleveName} - ${className}`}</h1>
      </div>

      <button 
        className={styles.addButton}
        onClick={handleAddDocumentClick}
      >
        <span className={styles.addButtonIcon}>
          <MdAdd />
        </span>
        Ajouter un Document
      </button>

      {/* ... (Section Liste des Documents inchangée) ... */}
      <section>
        {/* ... */}
      </section>

      {/* 5. AFFICHER LE MODAL
         Il s'affichera par-dessus la page quand 'isModalOpen' est 'true'
         Nous lui passons la fonction pour se fermer.
      */}
      <ImportDocumentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EleveDossierPage;