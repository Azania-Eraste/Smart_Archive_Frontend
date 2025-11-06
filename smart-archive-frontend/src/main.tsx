import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Importer votre composant App (qui contient le routeur)
import App from './App.tsx';

// 2. (Optionnel) Importer les styles globaux
import './index.css'; // (Assurez-vous que ce fichier existe ou supprimez la ligne)

// 3. C'est la ligne la plus importante :
// Elle trouve le 'root' et y rend votre 'App'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);