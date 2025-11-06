import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

// --- Imports de vos Layouts et Pages ---
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// --- L'AIGUILLEUR DE DASHBOARD ---
import DashboardRouter from './pages/DashboardRouter';
// (Imports pour l'aiguilleur)
import DashboardEducateurPage from './pages/DashboardEducateurPage';
import DashboardSecretairePage from './pages/DashboardSecretairePage';
import DashboardProfesseurPage from './pages/DashboardProfesseurPage';

// --- Imports des Pages Fonctionnelles ---
import InscriptionsAttentePage from './pages/InscriptionsAttentePage';
import DossiersIncompletsPage from './pages/DossiersIncompletsPage';
import ModificationsAttentePage from './pages/ModificationsAttentePage';
import ModificationAttenteDetailPage from './pages/ModificationAttenteDetailPage';
import NotesRecentesPage from './pages/NotesRecentesPage';
import ElevesListPage from './pages/ElevesListPage';
import EleveDetailPage from './pages/EleveDetailPage';
import EleveDossierPage from './pages/EleveDossierPage';
import InscriptionPage from './pages/InscriptionPage';
import HistoriquePage from './pages/HistoriquePage';
import GestionMatieresPage from './pages/GestionMatieresPage';

// --- Imports des Pages Professeur ---
import GestionClassePage from './pages/GestionClassePage';
import SaisieNotesPage from './pages/SaisieNotesPage'; // <-- 1. IMPORTER LA PAGE

const router = createBrowserRouter([
  {
    // === Routes d'Authentification (Publiques) ===
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    // === Routes Principales de l'App (Protégées) ===
    path: '/app',
    element: <DashboardLayout />,
    children: [
      {
        index: true, // Redirige /app vers /app/dashboard
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardRouter />, // (Correct)
      },
      
      // ... (Routes Educateur et Secrétaire) ...
      { path: 'inscription', element: <InscriptionPage /> },
      { path: 'matieres', element: <GestionMatieresPage /> },
      { path: 'dossiers/incomplets', element: <DossiersIncompletsPage /> },
      { path: 'inscriptions/attente', element: <InscriptionsAttentePage /> },
      { path: 'modifications/attente', element: <ModificationsAttentePage /> },
      { path: 'modifications/attente/:id', element: <ModificationAttenteDetailPage />},
      { path: 'notes/recentes', element: <NotesRecentesPage /> },
      
      // --- Routes Professeur (Activées) ---
      { 
        path: 'cours/:id', 
        element: <GestionClassePage />, // <-- 2. ACTIVER LA ROUTE
      },
      {
        path: 'cours/:id/evaluation/:evalId', // <-- 3. AJOUTER LA ROUTE FINALE
        element: <SaisieNotesPage />,
      },
      {
        path: 'settings', 
        element: <div>Page Paramètres</div>,
      },

      // --- Routes Communes ---
      { path: 'eleves', element: <ElevesListPage /> },
      { path: 'eleves/:id', element: <EleveDetailPage /> },
      { path: 'eleves/:id/dossier/:annee', element: <EleveDossierPage /> },
      { path: 'historique', element: <HistoriquePage /> },
    ],
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;