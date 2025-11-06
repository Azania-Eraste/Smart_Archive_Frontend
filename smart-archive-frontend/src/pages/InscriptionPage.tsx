import React, { useState } from 'react';
import styles from './InscriptionPage.module.css';
import { MdCameraAlt } from 'react-icons/md'; // Icône pour la photo

// Type pour les données du formulaire
type FormData = {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: string;
  nationalite: string;
  parents: string; // (Le champ "Parents" était sur la maquette)
};

const InscriptionPage: React.FC = () => {
  // Gérer l'état de tous les champs
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    nationalite: '',
    parents: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données d\'inscription soumises:', formData);
    // TODO: 
    // 1. Appeler l'API pour soumettre le formulaire
    // 2. Gérer la réponse (succès/erreur)
    // 3. Vider le formulaire ou rediriger
    alert('Élève en cours d\'inscription !');
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Inscrire</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Formulaire d'inscription</h2>

        {/* Nom */}
        <div className={styles.inputGroup}>
          <label htmlFor="nom" className={styles.label}>Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            className={styles.input}
            placeholder="Ex: Kouadio"
            value={formData.nom}
            onChange={handleChange}
          />
        </div>

        {/* Prénom */}
        <div className={styles.inputGroup}>
          <label htmlFor="prenom" className={styles.label}>Prenom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            className={styles.input}
            placeholder="Ex: Sanidi Azania Eraste"
            value={formData.prenom}
            onChange={handleChange}
          />
        </div>

        {/* Date de naissance */}
        <div className={styles.inputGroup}>
          <label htmlFor="dateNaissance" className={styles.label}>Date de naissance</label>
          <input
            type="text"
            id="dateNaissance"
            name="dateNaissance"
            className={styles.input}
            placeholder="jj/mm/aaaa"
            value={formData.dateNaissance}
            onChange={handleChange}
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
            placeholder="Ex: Cocody"
            value={formData.lieuNaissance}
            onChange={handleChange}
          />
        </div>

        {/* Sexe */}
        <div className={styles.inputGroup}>
          <label htmlFor="sexe" className={styles.label}>Sexe</label>
          <select
            id="sexe"
            name="sexe"
            className={styles.select}
            value={formData.sexe}
            onChange={handleChange}
          >
            <option value="" disabled>Choisi un sexe</option>
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
            placeholder="Ex: Ivoirienne"
            value={formData.nationalite}
            onChange={handleChange}
          />
        </div>

        {/* Parents */}
        <div className={styles.inputGroup}>
          <label htmlFor="parents" className={styles.label}>Parents</label>
          <input
            type="text"
            id="parents"
            name="parents"
            className={styles.input}
            placeholder="Rechercher ou ajouter un parent..."
            value={formData.parents}
            onChange={handleChange}
          />
        </div>

        {/* Bouton Photo */}
        <button type="button" className={styles.iconButton}>
            <span className={styles.icon}>
                <MdCameraAlt />
            </span>
          Prendre une photo
        </button>

        {/* Bouton Soumettre */}
        <button type="submit" className={styles.submitButton}>
          Inscrire
        </button>
      </form>
    </div>
  );
};

export default InscriptionPage;