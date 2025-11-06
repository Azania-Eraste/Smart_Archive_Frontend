import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardEducateurPage from './DashboardEducateurPage';
import DashboardSecretairePage from './DashboardSecretairePage';
import DashboardProfesseurPage from './DashboardProfesseurPage';

// Ce composant "intelligent" lit le rôle
// et affiche le bon dashboard.
const DashboardRouter: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case 'Educateur':
      return <DashboardEducateurPage />;
    case 'Secretaire':
      return <DashboardSecretairePage />;
    case 'Professeur':
      return <DashboardProfesseurPage />;
    default:
      // Rediriger vers le login ou afficher une erreur
      return <div>Erreur : Rôle non défini.</div>;
  }
};

export default DashboardRouter;