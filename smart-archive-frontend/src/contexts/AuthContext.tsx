import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Ajouter 'Professeur' aux rôles
type UserRole = 'Educateur' | 'Secretaire' | 'Professeur' | 'Admin'; 

type AuthContextType = {
  role: UserRole | null;
  loginAsEducateur: () => void;
  loginAsSecretaire: () => void;
  loginAsProfesseur: () => void; // <-- 2. Ajouter la fonction
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 3. Mettre 'Professeur' ici pour tester ce nouveau rôle
  const [currentRole, setCurrentRole] = useState<UserRole | null>('Professeur'); 

  const loginAsEducateur = () => setCurrentRole('Educateur');
  const loginAsSecretaire = () => setCurrentRole('Secretaire');
  const loginAsProfesseur = () => setCurrentRole('Professeur'); // <-- 4. Ajouter la fonction
  const logout = () => setCurrentRole(null);

  const value = {
    role: currentRole,
    loginAsEducateur,
    loginAsSecretaire,
    loginAsProfesseur, // <-- 5. Exposer la fonction
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};