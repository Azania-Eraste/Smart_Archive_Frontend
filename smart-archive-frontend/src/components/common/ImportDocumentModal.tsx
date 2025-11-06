import React, { useState } from 'react';
import styles from './ImportDocumentModal.module.css';
import { MdClose } from 'react-icons/md';

// 1. Définir les "props" que ce composant accepte
// Il a besoin de savoir s'il doit s'afficher (isOpen)
// et d'une fonction pour dire au parent de le fermer (onClose)
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImportDocumentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [docType, setDocType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Importation avec le type:', docType);
    // TODO: Logique d'upload du fichier
    onClose(); // Fermer le modal après l'import
  };

  // 2. Si 'isOpen' est faux, ne rien afficher
  if (!isOpen) {
    return null;
  }

  // 3. Si 'isOpen' est vrai, afficher le modal
  return (
    // 'stopPropagation' empêche de fermer le modal si on clique DANS la boîte
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Importer un Document</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Zone d'upload (Maquette "Frame 1") */}
          <div className={styles.uploadArea}>
            <p>Glissez-déposez un fichier ou cliquez pour le sélectionner</p>
            {/* Un vrai <input type="file" /> serait caché ici */}
          </div>

          {/* Menu déroulant (Maquette "Frame 1") */}
          <div className={styles.formGroup}>
            <label htmlFor="docType" className={styles.label}>
              Type de document
            </label>
            <select
              id="docType"
              className={styles.select}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              required
            >
              <option value="" disabled>Choisir un type...</option>
              <option value="bulletin">Bulletin de notes</option>
              <option value="acte_naissance">Acte de naissance</option>
              <option value="fiche_medicale">Fiche médicale</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Importer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportDocumentModal;
