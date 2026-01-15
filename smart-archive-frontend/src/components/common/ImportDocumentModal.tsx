import React, { useState } from 'react';
import styles from './ImportDocumentModal.module.css';
import { MdClose, MdCamera } from 'react-icons/md';
import DocumentScanner from '../ui/DocumentScanner';
import type { DocumentType } from '../../shared/services/dossiersService';
import type { AnneeScolaire } from '../../shared/services/etablissementService';

// 1. Définir les "props" que ce composant accepte
type Props = {
  isOpen: boolean;
  onClose: () => void;
  // onSave is called for each file: (file, titre, type, anneeId?)
  onSave?: (file: File, titre: string, type: DocumentType, anneeId?: number) => Promise<void>;
  isLoading?: boolean;
  availableYears?: AnneeScolaire[];
};

const ImportDocumentModal: React.FC<Props> = ({ isOpen, onClose, onSave, isLoading, availableYears }) => {
  const [docType, setDocType] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');

  const handleScannerUpload = async (files: File[]) => {
    // Ajouter les fichiers scannés à la liste
    setUploadedFiles((prev) => [...prev, ...files]);
    setShowScanner(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!docType) {
      alert('Veuillez sélectionner un type de document');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('Veuillez ajouter au moins un document');
      return;
    }

    console.log('Importation:', {
      type: docType,
      files: uploadedFiles.map(f => f.name),
    });
    
    // If parent provided onSave, call it for each file
    const mapType = (t: string): DocumentType => {
      switch (t) {
        case 'acte_naissance': return 'ACTE_NAISSANCE';
        case 'bulletin': return 'AUTRE';
        case 'fiche_medicale': return 'AUTRE';
        default: return 'AUTRE';
      }
    };

    (async () => {
      try {
        if (onSave) {
          for (const file of uploadedFiles) {
            await onSave(file, title || file.name, mapType(docType), selectedYear === '' ? undefined : Number(selectedYear));
          }
        } else {
          console.warn('ImportDocumentModal: onSave not provided; files not uploaded');
        }
        // reset and close
        setUploadedFiles([]);
        setDocType('');
        setTitle('');
        setSelectedYear('');
        onClose();
      } catch (err) {
        console.error('Erreur lors de l\'upload des fichiers', err);
        alert('Erreur lors de l\'upload des fichiers');
      }
    })();
  };

  // 2. Si 'isOpen' est faux, ne rien afficher
  if (!isOpen) {
    return null;
  }

  // Afficher le scanner si activé
  if (showScanner) {
    return <DocumentScanner onUpload={handleScannerUpload} onClose={() => setShowScanner(false)} />;
  }

  // 3. Si 'isOpen' est vrai, afficher le modal
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Importer un Document</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Zone d'upload ou boutons d'action */}
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.scanButton}
              onClick={() => setShowScanner(true)}
            >
              <MdCamera size={24} />
              <span>Scanner un document</span>
            </button>
            <label className={styles.uploadButton}>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              <span>📁 Parcourir les fichiers</span>
            </label>
          </div>

          {/* Afficher les fichiers ajoutés */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Titre (optionnel)</label>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre pour le document (ou laisser vide)" />
          </div>
          {availableYears && availableYears.length > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Année scolaire (optionnel)</label>
              <select className={styles.select} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Laisser vide (utiliser l'année selectionnée sur la page)</option>
                {availableYears.map((a) => (
                  <option key={a.id} value={a.id}>{a.libelle}</option>
                ))}
              </select>
            </div>
          )}
          {uploadedFiles.length > 0 && (
            <div className={styles.fileList}>
              <h4>Fichiers sélectionnés ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className={styles.fileItem}>
                  {file.name}
                </div>
              ))}
            </div>
          )}

          {/* Menu déroulant */}
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

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={uploadedFiles.length === 0 || !!isLoading}
          >
            {isLoading ? 'Importation...' : 'Importer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportDocumentModal;
