import React, { useState, useEffect } from 'react';
import styles from './InscriptionPage.module.css';
import { MdCloudUpload } from 'react-icons/md';
import { createEleve, uploadDocument } from '../../shared/services/dossiersService';
import type { 
  AnneeScolaire 
} from '../../shared/services/inscriptionsService';
import { createDemande } from '../../shared/services/inscriptionsService';
import { getClasses, getNiveaux } from '../../shared/services/etablissementService';
import type { Classe as EtabClasse, Niveau } from '../../shared/services/etablissementService';
import { getActiveAnneeScolaire } from '../../shared/services/etablissementService';
import Toast from '../../components/ui/Toast';

// Interface pour Classe locale - adapté aux données du service
type Classe = EtabClasse;

// Type pour les données (maintenant plus complet)
type FormData = {
  // Etape 1
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: string;
  nationalite: string;
  // Etape 2
  niveauId: string;
  classeId: string;
  // Etape 3
  documents: File[];
};

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'default';
  id: number;
}

const InscriptionPage: React.FC = () => {
  // Gérer l'étape actuelle du wizard
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Gérer l'état de tous les champs
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    nationalite: '',
    niveauId: '',
    classeId: '',
    documents: [],
  });

  // États pour les données récupérées de l'API
  const [classes, setClasses] = useState<Classe[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [activeYear, setActiveYear] = useState<AnneeScolaire | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  // Récupérer les classes et l'année scolaire active au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les niveaux
        const niveauxResp = await getNiveaux();
        setNiveaux(niveauxResp.results || []);

        // Récupérer les classes (paginated)
        const classesResp = await getClasses();
        setClasses(classesResp.results || []);

        // Récupérer l'année scolaire active
        const activeYearData = await getActiveAnneeScolaire();
        setActiveYear(activeYearData);

        if (!activeYearData) {
          addToast('Aucune année scolaire active. Veuillez contacter l\'administrateur.', 'error');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        addToast('Erreur lors du chargement des données. Veuillez actualiser la page.', 'error');
      }
    };
    fetchData();
  }, []);

  // Fonction pour ajouter un toast
  const addToast = (message: string, type: 'success' | 'error' | 'default' = 'default') => {
    const id = toastCounter;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fonction pour mettre à jour le state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Logique de navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Fonction pour valider les données requises
  const validateStep1 = (): boolean => {
    if (!formData.nom.trim()) {
      addToast('Le nom est obligatoire', 'error');
      return false;
    }
    if (!formData.prenom.trim()) {
      addToast('Le prénom est obligatoire', 'error');
      return false;
    }
    if (!formData.dateNaissance.trim()) {
      addToast('La date de naissance est obligatoire', 'error');
      return false;
    }
    // Valider format date
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.dateNaissance)) {
      addToast('Le format de date doit être jj/mm/aaaa', 'error');
      return false;
    }
    if (!formData.sexe) {
      addToast('Veuillez sélectionner un sexe', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.niveauId || !formData.classeId) {
      addToast('Veuillez sélectionner un niveau et une classe', 'error');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (formData.documents.length === 0) {
      addToast('Veuillez télécharger au moins un document', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    if (!activeYear) {
      addToast('Erreur: Aucune année scolaire active. Veuillez contacter l\'administrateur.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Convertir la date de jj/mm/aaaa à yyyy-mm-dd
      const [day, month, year] = formData.dateNaissance.split('/');
      const isoDate = `${year}-${month}-${day}`;

      // Étape 1: Créer l'élève
      addToast('Création du profil élève...', 'default');
      
      const eleve = await createEleve({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        date_naissance: isoDate,
        statut: 'ACTIF',
        classe: parseInt(formData.classeId),
        matricule: `MAT-${Date.now()}`, // Générer un matricule unique basé sur le timestamp
      });

      addToast('Profil élève créé avec succès', 'success');

      // Étape 2: Uploader les documents
      addToast(`Téléchargement de ${formData.documents.length} document(s)...`, 'default');
      const documentIds: number[] = [];
      
      for (let i = 0; i < formData.documents.length; i++) {
        const file = formData.documents[i];
        try {
          // Déterminer le type de document basé sur le nom du fichier
          let docType: 'ACTE_NAISSANCE' | 'RECU' | 'DIPLOME_ANTERIEUR' | 'PHOTO' | 'AUTRE' = 'AUTRE';
          const fileName = file.name.toLowerCase();
          
          if (fileName.includes('photo') || fileName.includes('image') || fileName.includes('jpg') || fileName.includes('jpeg') || fileName.includes('png')) {
            docType = 'PHOTO';
          } else if (fileName.includes('acte') || fileName.includes('naissance') || fileName.includes('birth')) {
            docType = 'ACTE_NAISSANCE';
          } else if (fileName.includes('diplome') || fileName.includes('certificat')) {
            docType = 'DIPLOME_ANTERIEUR';
          } else if (fileName.includes('recu') || fileName.includes('receipt') || fileName.includes('facture')) {
            docType = 'RECU';
          }

          const doc = await uploadDocument({
            eleve: eleve.id,
            titre: file.name,
            type_document: docType,
            annee_scolaire: activeYear.id,
            fichier: file,
          });
          
          documentIds.push(doc.id);
          addToast(`Document ${i + 1}/${formData.documents.length} téléchargé`, 'success');
        } catch (docError: any) {
          console.error('Erreur lors du téléchargement du document:', docError);
          const errorMsg = docError?.response?.data?.detail || docError?.message || `Erreur lors du téléchargement de ${file.name}`;
          addToast(errorMsg, 'error');
        }
      }

      // Étape 3: Créer la demande d'inscription
      addToast('Création de la demande d\'inscription...', 'default');
      await createDemande({
        eleve: eleve.id,
        classe: parseInt(formData.classeId),
        annee_scolaire: activeYear.id,
        statut: 'EN_ATTENTE',
        frais_inscription: 0,
        documents_fournis: documentIds,
        notes_administratives: `Inscription de ${formData.prenom} ${formData.nom} - Lieu de naissance: ${formData.lieuNaissance || 'Non spécifié'}, Nationalité: ${formData.nationalite || 'Non spécifiée'}`,
      });

      addToast('✓ Dossier d\'inscription soumis avec succès !', 'success');
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        sexe: '',
        nationalite: '',
        niveauId: '',
        classeId: '',
        documents: [],
      });
      setStep(1);

      // Redirection après 3 secondes
      setTimeout(() => {
        window.location.href = '/inscriptions-attente';
      }, 3000);

    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      const errorMsg = error?.response?.data?.detail || error?.message || 'Une erreur est survenue lors de la soumission du dossier';
      addToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ÉTAPE 1: INFOS ÉLÈVE ---
  const renderStep1 = () => (
    <>
      <h2 className={styles.formTitle}>Étape 1/3 : Informations de l'élève</h2>
      <div className={styles.formStep}>
        {/* Nom */}
        <div className={styles.inputGroup}>
          <label htmlFor="nom" className={styles.label}>Nom *</label>
          <input 
            type="text" 
            id="nom" 
            name="nom" 
            className={styles.input} 
            value={formData.nom} 
            onChange={handleChange}
            required
          />
        </div>
        {/* Prénom */}
        <div className={styles.inputGroup}>
          <label htmlFor="prenom" className={styles.label}>Prénom *</label>
          <input 
            type="text" 
            id="prenom" 
            name="prenom" 
            className={styles.input} 
            value={formData.prenom} 
            onChange={handleChange}
            required
          />
        </div>
        {/* Date de naissance */}
        <div className={styles.inputGroup}>
          <label htmlFor="dateNaissance" className={styles.label}>Date de naissance *</label>
          <input 
            type="text" 
            id="dateNaissance" 
            name="dateNaissance" 
            className={styles.input} 
            placeholder="jj/mm/aaaa" 
            value={formData.dateNaissance} 
            onChange={handleChange}
            required
          />
        </div>
        {/* Lieu de naissance */}
        <div className={styles.inputGroup}>
          <label htmlFor="lieuNaissance" className={styles.label}>Lieu de naissance</label>
          <input 
            type="text" 
            id="lieuNaissance" 
            name="lieuNaissance" 
            className={styles.input} 
            value={formData.lieuNaissance} 
            onChange={handleChange}
          />
        </div>
        {/* Sexe */}
        <div className={styles.inputGroup}>
          <label htmlFor="sexe" className={styles.label}>Sexe *</label>
          <select 
            id="sexe" 
            name="sexe" 
            className={styles.select} 
            value={formData.sexe} 
            onChange={handleChange}
            required
          >
            <option value="">Choisir un sexe</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
        {/* Nationalité */}
        <div className={styles.inputGroup}>
          <label htmlFor="nationalite" className={styles.label}>Nationalité</label>
          <input 
            type="text" 
            id="nationalite" 
            name="nationalite" 
            className={styles.input} 
            value={formData.nationalite} 
            onChange={handleChange}
          />
        </div>
        
        <div className={`${styles.navigationButtons} ${styles.fullWidth}`}>
          <button 
            type="button" 
            className={`${styles.navButton} ${styles.nextButton}`} 
            onClick={() => validateStep1() && nextStep()}
            style={{marginLeft: 'auto'}}
          >
            Suivant
          </button>
        </div>
      </div>
    </>
  );

  // --- ÉTAPE 2: ASSIGNATION SCOLAIRE ---
  const renderStep2 = () => {
    // Utiliser la liste de `niveaux` récupérée depuis l'API
    const uniqueNiveaux = niveaux;

    // Filtrer les classes en fonction du niveau sélectionné
    const filteredClasses = formData.niveauId
      ? classes.filter(c => {
          // c.niveau peut être un objet { id, nom } ou une valeur scalaire selon l'API
          const niv: any = c.niveau;
          if (niv && typeof niv === 'object' && 'id' in niv) {
            return String(niv.id) === formData.niveauId;
          }
          return String(niv) === formData.niveauId;
        })
      : classes;

    return (
      <>
        <h2 className={styles.formTitle}>Étape 2/3 : Assignation scolaire</h2>
        <div className={styles.formStep}>
          {/* Niveau */}
          <div className={styles.inputGroup}>
            <label htmlFor="niveauId" className={styles.label}>Niveau *</label>
            <select 
              id="niveauId" 
              name="niveauId" 
              className={styles.select} 
              value={formData.niveauId} 
              onChange={handleChange}
              required
            >
              <option value="">Choisir un niveau</option>
              {uniqueNiveaux.map(niveau => (
                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
              ))}
            </select>
          </div>
          {/* Classe */}
          <div className={styles.inputGroup}>
            <label htmlFor="classeId" className={styles.label}>Classe *</label>
            <select 
              id="classeId" 
              name="classeId" 
              className={styles.select} 
              value={formData.classeId} 
              onChange={handleChange}
              required
              disabled={!formData.niveauId}
            >
              <option value="">Choisir une classe</option>
              {filteredClasses.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.navigationButtons} ${styles.fullWidth}`}>
            <button 
              type="button" 
              className={styles.navButton} 
              onClick={prevStep}
            >
              Précédent
            </button>
            <button 
              type="button" 
              className={`${styles.navButton} ${styles.nextButton}`} 
              onClick={() => validateStep2() && nextStep()}
            >
              Suivant
            </button>
          </div>
        </div>
      </>
    );
  };

  // --- ÉTAPE 3: PIÈCES JUSTIFICATIVES ---
  const renderStep3 = () => {
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
    };

    const handleRemoveFile = (index: number) => {
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index),
      }));
    };

    return (
      <>
        <h2 className={styles.formTitle}>Étape 3/3 : Pièces justificatives</h2>
        <div className={styles.formStep}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Documents requis *</label>
            <div 
              className={styles.uploadArea}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <span className={styles.icon} style={{fontSize: '2rem'}}><MdCloudUpload /></span>
              <p>Glissez-déposez les fichiers ici ou</p>
              <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                cliquez pour sélectionner
              </label>
              <input
                id="fileInput"
                type="file"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
                accept="*/*"
              />
            </div>
            {formData.documents.length > 0 && (
              <ul className={styles.fileList}>
                {formData.documents.map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {formData.documents.length === 0 && (
              <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '10px' }}>
                Aucun document sélectionné
              </p>
            )}
          </div>
          <div className={`${styles.navigationButtons} ${styles.fullWidth}`}>
            <button 
              type="button" 
              className={styles.navButton} 
              onClick={prevStep}
              disabled={isLoading}
            >
              Précédent
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? 'Traitement en cours...' : 'Soumettre le dossier'}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Inscrire un élève</h1>
      
      {/* Toast Messages */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
    </div>
  );
};

export default InscriptionPage;