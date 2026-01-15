export type UserRole = 'Educateur' | 'Secretaire' | 'Professeur' | 'Admin' | 'Directeur' | 'Parent';


export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;

  role: UserRole;
}