import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EleveDossierPage.module.css';
import listStyles from './../../ListPage.module.css'; 
import { MdArrowBack, MdAdd, MdFilePresent, MdVisibility, MdGetApp, MdDelete } from 'react-icons/md';
import ImportDocumentModal from '../../../components/common/ImportDocumentModal';
import Toast from '../../../components/ui/Toast';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import DocumentPreviewModal from '../../../components/common/DocumentPreviewModal';

// Imports des services
import { 
  getDocumentsByEleve, 
  deleteDocument, 
  uploadDocument, 
  type Document as DossierDocument,
  type DocumentType
} from '../../../shared/services/dossiersService';
import { getAnneesScolaires, getActiveAnneeScolaire, type AnneeScolaire } from '../../../shared/services/etablissementService';

const EleveDossierPage: React.FC = () => {
  const { id, annee } = useParams<{ id?: string; annee?: string }>();
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docs, setDocs] = useState<DossierDocument[]>([]);
  
  // BONUS : État pour stocker le nom de l'élève récupéré de l'API
  const [eleveInfo, setEleveInfo] = useState<{ nom: string; prenom: string } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // États de suppression
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DossierDocument | null>(null);
  
  // États de chargement/Erreur
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtres & recherche
  const [annees, setAnnees] = useState<AnneeScolaire[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- 1. CHARGEMENT DES ANNÉES SCOLAIRES ---
  useEffect(() => {
    const loadAnnees = async () => {
      try {
        const resp = await getAnneesScolaires();
        setAnnees(resp.results || []);
        
        // Si une année est passée dans l'URL, on l'utilise
        if (annee && /^\d+$/.test(annee)) {
          setSelectedYear(Number(annee));
        } else {
          // Sinon on prend l'année active par défaut
          const active = await getActiveAnneeScolaire();
          if (active) setSelectedYear(active.id);
        }
      } catch (err) {
        console.warn('Impossible de charger les années scolaires', err);
      }
    };
    loadAnnees();
  }, [annee]);

  // --- 2. CHARGEMENT DES DOCUMENTS (LA CORRECTION EST ICI) ---
  useEffect(() => {
    const fetchDocs = async () => {
      if (!id) return;
      const numericId = parseInt(id, 10);
      
      if (isNaN(numericId)) {
        setError('Identifiant élève invalide');
        return;
      }

      setLoading(true);
      try {
        // On utilise 'any' ici temporairement pour dire à TypeScript de nous faire confiance sur la structure
        const results: any = await getDocumentsByEleve(numericId, { 
          annee_scolaire: selectedYear, 
          search: searchTerm 
        });

        console.log("✅ Données reçues dans le composant :", results);

        // --- CORRECTION CRUCIALE ICI ---
        // L'API renvoie { documents: [...], eleve: {...}, count: ... }
        // On cible donc .documents pour la liste
        if (results && results.documents) {
          setDocs(results.documents);
        } else if (Array.isArray(results)) {
          // Au cas où l'API changerait et renverrait un tableau direct
          setDocs(results);
        } else {
          setDocs([]);
        }

        // --- BONUS : On récupère aussi le nom de l'élève ---
        if (results && results.eleve) {
            setEleveInfo(results.eleve);
        }

      } catch (err: any) {
        console.error(err);
        setError('Erreur lors de la récupération des documents.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [id, selectedYear, searchTerm]);

  // --- ACTIONS ---

  const handleDeleteConfirm = async () => {
    if (!toDeleteId) return;

    try {
      await deleteDocument(toDeleteId);
      setDocs((currentDocs) => currentDocs.filter((d) => d.id !== toDeleteId));
      showToast('Document supprimé avec succès');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la suppression');
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  const handleUpload = async (file: File, titre: string, type: DocumentType, anneeId?: number) => {
    if (!id) return;

    const numericId = parseInt(id, 10);
    let anneeNum: number | undefined = undefined;
    if (anneeId !== undefined) anneeNum = anneeId;
    else if (selectedYear !== undefined) anneeNum = selectedYear;
    else if (annee && /^\d+$/.test(annee)) anneeNum = Number(annee);

    setIsSubmitting(true);
    try {
      const payload: any = {
        eleve: numericId,
        titre,
        type_document: type,
        fichier: file,
      };
      if (anneeNum !== undefined) payload.annee_scolaire = anneeNum;

      const newDoc = await uploadDocument(payload);
      
      setDocs([newDoc, ...docs]);
      showToast('Document ajouté avec succès');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'upload du document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (doc: DossierDocument) => {
    if (doc.fichier) {
      window.open(doc.fichier, '_blank');
    } else {
      showToast("Lien du fichier introuvable");
    }
  };

  // Affichage du vrai nom si dispo, sinon "Dossier Élève"
  const displayName = eleveInfo ? `${eleveInfo.prenom} ${eleveInfo.nom}` : "Dossier Élève";
  
  // Affichage de l'année sélectionnée (label)
  const currentYearLabel = annees.find(a => a.id === selectedYear)?.libelle || "Toutes les années";

  return (
    <div className={styles.pageContainer}>
      {/* En-tête */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>{`${displayName} - ${currentYearLabel}`}</h1>
      </div>

      <div className={styles.headerActions}>
        <h2 className={styles.docHeader}>Documents</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          
          <select 
            value={selectedYear ?? ''} 
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)} 
            className={styles.selectYear}
          >
            <option value="">Toutes les années</option>
            {annees.map((a) => (
              <option key={a.id} value={a.id}>{a.libelle}</option>
            ))}
          </select>
          
          <input 
            placeholder="Rechercher..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className={styles.searchInput} 
          />
          
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <span className={styles.addButtonIcon}><MdAdd /></span>
            Ajouter
          </button>
          
          <button className={styles.primaryButton} onClick={async () => {
            if (!id) return showToast('Identifiant élève manquant');
            const numericId = parseInt(id, 10);
            try {
              const { downloadStudentZip } = await import('../../../shared/services/dossiersService');
              const blob = await downloadStudentZip(numericId);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `dossier_${numericId}.zip`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err: any) {
              console.error(err);
              showToast('Erreur lors du téléchargement ZIP');
            }
          }}>
            <MdGetApp /> ZIP
          </button>
        
        </div>
      </div>

      {/* --- VUE LISTE (Tableau) --- */}
      <section className={styles.desktopTableContainer}>
        {loading && <p className="p-4 text-center">Chargement des documents...</p>}
        
        {!loading && !error && docs.length === 0 && (
           <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p>Aucun document trouvé pour cette recherche.</p>
           </div>
        )}

        {!loading && docs.length > 0 && (
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
                        {/* Au clic sur le titre, on ouvre la prévisualisation */}
                        <button 
                            onClick={() => setPreviewDoc(doc)}
                            className="hover:underline text-blue-600 text-left"
                        >
                          {doc.titre}
                        </button>
                      </div>
                    </td>
                  <td>{doc.type_document}</td>
                  <td>{new Date(doc.date_upload).toLocaleDateString()}</td>
                  <td>
                    <div className={listStyles.itemActions}>
                      <button className={listStyles.ghostButton} title="Voir" onClick={() => setPreviewDoc(doc)}>
                        <MdVisibility />
                      </button>
                      <button 
                        className={listStyles.ghostButton} 
                        title="Télécharger" 
                        onClick={() => handleDownload(doc)}
                      >
                        <MdGetApp />
                      </button>
                      
                      <button 
                        className={listStyles.ghostButtonDanger} 
                        title="Supprimer" 
                        onClick={() => { 
                          setToDeleteId(doc.id); 
                          setConfirmOpen(true); 
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* --- MODALES --- */}

      <ImportDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpload}
        isLoading={isSubmitting}
        availableYears={annees}
      />
      
      {/* Modale de prévisualisation */}
      <DocumentPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          docUrl={previewDoc?.fichier || null}
          title={previewDoc?.titre}
        />

      {toastMessage && <Toast message={toastMessage} type="success" />}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le document"
        message="Cette action est irréversible. Le fichier sera supprimé du serveur."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default EleveDossierPage;