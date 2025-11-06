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

// Import de la page Dashboard (décommentez si le fichier existe)
import DashboardEducateurPage from './pages/DashboardEducateurPage';
import DashboardSecretairePage from './pages/DashboardSecretairePage';

// --- IMPORTS POUR LES NOUVELLES PAGES ---
// (Nous les créons juste après)
import InscriptionsAttentePage from './pages/InscriptionsAttentePage';
import DossiersIncompletsPage from './pages/DossiersIncompletsPage';
import ModificationsAttentePage from './pages/ModificationsAttentePage';
import ModificationAttenteDetailPage from './pages/ModificationAttenteDetailPage';
import NotesRecentesPage from './pages/NotesRecentesPage';
import ElevesListPage from './pages/ElevesListPage';
import EleveDetailPage from './pages/EleveDetailPage';
import EleveDossierPage from './pages/EleveDossierPage';
import InscriptionPage from './pages/InscriptionPage'; // <-- CET IMPORT MANQUAIT
import HistoriquePage from './pages/HistoriquePage';
import GestionMatieresPage from './pages/GestionMatieresPage';


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
        index: true, // Redirige /app vers /app/dashboardEdu
          element: <Navigate to="/app/dashboardEdu" replace />,
      },
      {
        path: 'dashboardEdu',
        element: <DashboardEducateurPage />,
      },
      {
        path: 'dashboardSec',
        element: <DashboardSecretairePage />,
      },

      // --- AJOUT DES NOUVELLES ROUTES DU DASHBOARD ---
      {
        path: 'dossiers/incomplets',
        element: <DossiersIncompletsPage />,
      },
      {
        path: 'inscriptions/attente',
        element: <InscriptionsAttentePage />,
      },
      {
        path: 'modifications/attente',
        element: <ModificationsAttentePage />,
      },
      {
        path: 'modifications/attente/:id',
        element: <ModificationAttenteDetailPage />,
      },
      {
        path: 'notes/recentes',
        element: <NotesRecentesPage />,
      },
      {
        path: 'eleves',
        element: <ElevesListPage />,
      },
      {
        path: 'eleves/:id', // ':id' est un paramètre dynamique
        element: <EleveDetailPage />,
      },
      {
        path: 'eleves/:id/dossier/:annee',
        element: <EleveDossierPage />,
      },

      {
        path: 'historique',
        element: <HistoriquePage />,
      },
      {
        path: 'matieres',
        element: <GestionMatieresPage />,
      },
      
      // --- ROUTE D'INSCRIPTION (MANQUANTE) ---
      {
        path: 'inscription', // <-- CETTE ROUTE MANQUAIT
        element: <InscriptionPage />,
      },
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