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

// --- IMPORTS POUR LES NOUVELLES PAGES ---
// (Nous les créons juste après)
import InscriptionsAttentePage from './pages/InscriptionsAttentePage';
import DossiersIncompletsPage from './pages/DossiersIncompletsPage';
import ModificationsAttentePage from './pages/ModificationsAttentePage';
import NotesRecentesPage from './pages/NotesRecentesPage';
import ElevesListPage from './pages/ElevesListPage';

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
        element: <DashboardEducateurPage />,
      },
      
      // --- AJOUT DES NOUVELLES ROUTES DU DASHBOARD ---
      {
        path: 'dossiers/incomplets',
        element: <DossiersIncompletsPage />, // (À décommenter)
      },
      {
        path: 'inscriptions/attente',
        element: <InscriptionsAttentePage />, // (À décommenter)
      },
      {
        path: 'modifications/attente',
        element: <ModificationsAttentePage />, // (À décommenter)
      },
      {
        path: 'notes/recentes',
        element: <NotesRecentesPage />, // (À décommenter)
      },
      {
        path: 'eleves',
        element: <ElevesListPage />,
      },

      // --- AUTRES ROUTES PRINCIPALES ---
      // {
      //   path: 'eleves',
      //   element: <ElevesListPage />,
      // },
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