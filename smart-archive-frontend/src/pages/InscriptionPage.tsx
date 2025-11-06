import React, { useState } from 'react';
import styles from './InscriptionPage.module.css';
import { MdCameraAlt, MdCloudUpload } from 'react-icons/md';

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
  niveau: string;
  classe: string;
  // Etape 3
  documents: File[];
};

const InscriptionPage: React.FC = () => {
  // Gérer l'étape actuelle du wizard
  const [step, setStep] = useState(1);

  // Gérer l'état de tous les champs
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    nationalite: '',
    niveau: '',
    classe: '',
    documents: [],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données finales soumises:', formData);
    // TODO: 
    // 1. Appeler l'API pour soumettre TOUTES les données
    // 2. Gérer l'upload des fichiers
    alert('Dossier d\'inscription soumis pour validation !');
  };

  // --- ÉTAPE 1: INFOS ÉLÈVE ---
  const renderStep1 = () => (
    <>
      <h2 className={styles.formTitle}>Étape 1/3 : Informations de l'élève</h2>
      {/* Nom */}
      <div className={styles.inputGroup}>
        <label htmlFor="nom" className={styles.label}>Nom</label>
        <input type="text" id="nom" name="nom" className={styles.input} value={formData.nom} onChange={handleChange} />
      </div>
      {/* Prénom */}
      <div className={styles.inputGroup}>
        <label htmlFor="prenom" className={styles.label}>Prenom</label>
        <input type="text" id="prenom" name="prenom" className={styles.input} value={formData.prenom} onChange={handleChange} />
      </div>
      {/* Date de naissance */}
      <div className={styles.inputGroup}>
        <label htmlFor="dateNaissance" className={styles.label}>Date de naissance</label>
        <input type="text" id="dateNaissance" name="dateNaissance" className={styles.input} placeholder="jj/mm/aaaa" value={formData.dateNaissance} onChange={handleChange} />
      </div>
      {/* Sexe */}
      <div className={styles.inputGroup}>
        <label htmlFor="sexe" className={styles.label}>Sexe</label>
        <select id="sexe" name="sexe" className={styles.select} value={formData.sexe} onChange={handleChange}>
          <option value="" disabled>Choisi un sexe</option>
          <option value="H">Homme</option>
          <option value="F">Femme</option>
        </select>
      </div>
      {/* Bouton Photo */}
      <button type="button" className={styles.iconButton}>
        <span className={styles.icon}><MdCameraAlt /></span>
        Prendre une photo
      </button>
      {/* Bouton de navigation */}
      <div className={styles.navigationButtons}>
        <button type="button" className={`${styles.navButton} ${styles.nextButton}`} onClick={nextStep}>
          Suivant
        </button>
      </div>
    </>
  );

  // --- ÉTAPE 2: ASSIGNATION SCOLAIRE ---
  const renderStep2 = () => (
    <>
      <h2 className={styles.formTitle}>Étape 2/3 : Assignation scolaire</h2>
      {/* Niveau */}
      <div className={styles.inputGroup}>
        <label htmlFor="niveau" className={styles.label}>Niveau</label>
        <select id="niveau" name="niveau" className={styles.select} value={formData.niveau} onChange={handleChange}>
          <option value="" disabled>Choisir un niveau</option>
          <option value="CM2">CM2</option>
          <option value="6eme">6ème</option>
          <option value="5eme">5ème</option>
          {/* ... (Ajouter les autres niveaux) ... */}
        </select>
      </div>
      {/* Classe */}
      <div className={styles.inputGroup}>
        <label htmlFor="classe" className={styles.label}>Classe</label>
        <select id="classe" name="classe" className={styles.select} value={formData.classe} onChange={handleChange}>
          <option value="" disabled>Choisir une classe</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>
      {/* Boutons de navigation */}
      <div className={styles.navigationButtons}>
        <button type="button" className={styles.navButton} onClick={prevStep}>
          Précédent
        </button>
        <button type="button" className={`${styles.navButton} ${styles.nextButton}`} onClick={nextStep}>
          Suivant
        </button>
      </div>
    </>
  );

  // --- ÉTAPE 3: PIÈCES JUSTIFICATIVES ---
  const renderStep3 = () => (
    <>
      <h2 className={styles.formTitle}>Étape 3/3 : Pièces justificatives</h2>
      {/* Zone d'upload */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Documents requis</label>
        <div className={styles.uploadArea}>
          <span className={styles.icon} style={{fontSize: '2rem'}}><MdCloudUpload /></span>
          <p>Glissez-déposez les fichiers ici</p>
          <p>(Acte de naissance, Fiche médicale...)</p>
          {/* Un <input type="file" multiple /> serait géré ici */}
        </div>
        {/* Afficher les fichiers uploadés */}
        <ul className={styles.fileList}>
          {formData.documents.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      {/* Boutons de navigation */}
      <div className={styles.navigationButtons}>
        <button type="button" className={styles.navButton} onClick={prevStep}>
          Précédent
        </button>
        {/* C'est le bouton de soumission final */}
        <button type="submit" className={styles.submitButton}>
          Soumettre le dossier
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Inscrire un élève</h1>

      {/* Le 'onSubmit' est sur le 'form' pour capturer le 'submit' final */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Rendu conditionnel des étapes */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
    </div>
  );
};

export default InscriptionPage;