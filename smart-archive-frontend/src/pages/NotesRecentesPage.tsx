import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Réutiliser le même fichier de style
import styles from './ListPage.module.css'; 

// --- Données factices ---
// (Simule les dernières notes saisies par les professeurs)
const notesData = [
  { 
    id: 'note-001', 
    name: 'Lamine Yamal', 
    class: '3ème C', 
    details: 'Mathématiques - Devoir 1 : 17/20' 
  },
  { 
    id: 'note-002', 
    name: 'Pau Cubarsi', 
    class: '3ème C', 
    details: 'Mathématiques - Devoir 1 : 15/20' 
  },
  { 
    id: 'note-003', 
    name: 'Gavi', 
    class: '4ème A', 
    details: 'Français - Interrogation : 12/20' 
  },
  { 
    id: 'note-004', 
    name: 'Vitor Roque', 
    class: '5ème B', 
    details: 'Anglais - Oral : 14/20' 
  },
];

const NotesRecentesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNoteClick = (noteId: string) => {
    // Redirige vers le bulletin de l'élève ou le détail de la note
    console.log("Ouvrir la note/bulletin:", noteId);
    // navigate(`/app/notes/${noteId}`);
  };

  return (
    // 2. Utiliser les mêmes classes de style
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Notes Récentes (12)</h1>

      <div className={styles.listContainer}>
        {notesData.map((item) => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => handleNoteClick(item.id)}
            role="button"
          >
            {/* Avatar */}
            <div className={styles.avatar}>
              {item.name.charAt(0)}
            </div>
            
            {/* Infos */}
            <div className={styles.info}>
              <div className={styles.name}>{item.name} ({item.class})</div>
              {/* Le détail affiche la note */}
              <div className={styles.details} style={{ color: '#22c55e' }}> {/* En vert */}
                {item.details}
              </div>
            </div>

            {/* Flèche */}
            <span>&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesRecentesPage;
