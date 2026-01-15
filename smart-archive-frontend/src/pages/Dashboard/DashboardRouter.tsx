import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardEducateurPage from './DashboardEdu/DashboardEducateurPage';
import DashboardSecretairePage from './DashboardSec/DashboardSecretairePage';
import DashboardProfesseurPage from './DashboardProf/DashboardProfesseurPage';

// Ce composant "intelligent" lit le rôle
// et affiche le bon dashboard.
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  // Normaliser le rôle : convertir en title case et utiliser comme clé
  const role = user?.role;
  const normalizedRole = role 
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : null;

  console.log("🔄 DashboardRouter - Role reçu:", role, "-> Normalisé:", normalizedRole);

  switch (normalizedRole) {
    case 'Professeur':
      return <DashboardProfesseurPage />;
    case 'Educateur':
      return <DashboardEducateurPage />;
    case 'Secretaire':
      return <DashboardSecretairePage />;
    case 'Admin':
    case 'Directeur':
      // Admin et Directeur voient le dashboard Secrétaire
      return <DashboardSecretairePage />;
    case 'Parent':
      // Parent redirigé vers dashboard secrétaire en attendant une page parent
      console.warn("⚠️ Page Parent non implémentée, redirection vers Secrétaire");
      return <DashboardSecretairePage />;
    default:
      console.error("❌ Rôle inconnu:", normalizedRole);
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;