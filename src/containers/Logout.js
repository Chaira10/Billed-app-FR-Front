// Importation des constantes de chemins des routes
import { ROUTES_PATH } from '../constants/routes.js'

// Classe pour la déconnexion
export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    // Initialisation des propriétés de la classe avec les paramètres passés
    this.document = document
    this.onNavigate = onNavigate
    this.localStorage = localStorage
    // Ajout d'un écouteur d'événement au clic sur l'élément avec l'ID 'layout-disconnect'
    $('#layout-disconnect').click(this.handleClick)
  }
  // Gestionnaire de clic
  handleClick = (e) => {
    // Efface toutes les données stockées dans localStorage (déconnexion)
    this.localStorage.clear()
    // Redirige l'utilisateur vers la page de connexion (Login)
    this.onNavigate(ROUTES_PATH['Login'])
  }
} 