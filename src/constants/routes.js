// Import des interfaces utilisateur (UI) associées aux différentes vues
import LoginUI from "../views/LoginUI.js"         // Interface utilisateur pour la vue de connexion
import BillsUI from "../views/BillsUI.js"         // Interface utilisateur pour la vue des notes de frais
import NewBillUI from "../views/NewBillUI.js"     // Interface utilisateur pour la vue de création d'une nouvelle note de frais
import DashboardUI from "../views/DashboardUI.js" // Interface utilisateur pour la vue du tableau de bord administrateur

// Chemins des routes, utilisés comme clés dans l'objet ROUTES_PATH
export const ROUTES_PATH = {
  Login: '/',                     // Chemin vers la vue de connexion
  Bills: '#employee/bills',       // Chemin vers la vue des notes de frais pour les employés
  NewBill: '#employee/bill/new',  // Chemin vers la vue de création d'une nouvelle note de frais pour les employés
  Dashboard: '#admin/dashboard'   // Chemin vers la vue du tableau de bord administrateur
}

// Fonction qui retourne la vue associée au chemin de la route actuelle
export const ROUTES = ({ pathname, data, error, loading }) => {
  switch (pathname) {
    case ROUTES_PATH['Login']:
      return LoginUI({ data, error, loading })       // Renvoie l'interface utilisateur de connexion
    case ROUTES_PATH['Bills']:
      return BillsUI({ data, error, loading })       // Renvoie l'interface utilisateur des notes de frais
    case ROUTES_PATH['NewBill']:
      return NewBillUI()                            // Renvoie l'interface utilisateur de création d'une nouvelle note de frais
    case ROUTES_PATH['Dashboard']:
      return DashboardUI({ data, error, loading })   // Renvoie l'interface utilisateur du tableau de bord administrateur
    default:
      return LoginUI({ data, error, loading })       // Par défaut, renvoie l'interface utilisateur de connexion
  }
}
