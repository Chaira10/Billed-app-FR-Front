// Importation des constantes de chemin des routes
import { ROUTES_PATH } from '../constants/routes.js'
// Variable globale pour stocker l'emplacement précédent
export let PREVIOUS_LOCATION = ''

// we use a class so as to test its methods in e2e tests
// Classe pour la gestion de la connexion
export default class Login {
  constructor({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store }) {
    // Initialisation des propriétés de la classe avec les paramètres passés

    // Stockage de l'objet document pour manipuler le DOM
    this.document = document
    // Stockage de l'objet localStorage pour gérer les données en local dans le navigateur
    this.localStorage = localStorage
    // Stockage de la fonction onNavigate pour la navigation vers d'autres pages
    this.onNavigate = onNavigate
    // Stockage de l'emplacement précédent pour la gestion de la redirection
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION
    // Stockage du magasin de données (peut-être une instance d'une classe Store)
    this.store = store

    // Ajout d'écouteurs d'événements aux formulaires d'employé et d'administrateur

    // Sélection du formulaire d'employé par l'attribut "data-testid"
    const formEmployee = this.document.querySelector(`form[data-testid="form-employee"]`)
    // Ajout d'un écouteur d'événement pour la soumission du formulaire d'employé
    formEmployee.addEventListener("submit", this.handleSubmitEmployee)
    // Sélection du formulaire d'administrateur par l'attribut "data-testid"
    const formAdmin = this.document.querySelector(`form[data-testid="form-admin"]`)
    // Ajout d'un écouteur d'événement pour la soumission du formulaire d'administrateur
    formAdmin.addEventListener("submit", this.handleSubmitAdmin)
  }
  // Gestionnaire de soumission du formulaire d'employé
  handleSubmitEmployee = e => {
    e.preventDefault()  // Empêche le comportement de soumission par défaut du formulaire
    const user = {
      type: "Employee", // Le type de l'utilisateur est "Employee"
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value, // Récupération de l'email depuis le champ du formulaire
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,  // Récupération du mot de passe depuis le champ du formulaire
      status: "connected" // L'état de connexion de l'utilisateur est défini sur "connected"
    }
    // Stockage des informations utilisateur dans localStorage
    this.localStorage.setItem("user", JSON.stringify(user))
    // Connexion de l'utilisateur ou création s'il n'existe pas

    // Tentative de connexion de l'utilisateur ou création s'il n'existe pas
    this.login(user)
      .catch(
        /* istanbul ignore next */ 
        (err) => this.createUser(user) // Si une erreur survient, tente de créer l'utilisateur
      )
      .then(() => {
        // Après la connexion ou la création, effectue les actions suivantes :
        // Redirection vers la page appropriée après la connexion
        // Redirection vers la page des factures (Bills)
        this.onNavigate(ROUTES_PATH['Bills'])
        // Mise à jour de la valeur de l'emplacement précédent
        this.PREVIOUS_LOCATION = ROUTES_PATH['Bills']
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION
        // Modification de la couleur de fond du corps du document
        this.document.body.style.backgroundColor="#fff"
      })

  }
// Gestionnaire de soumission du formulaire d'administrateur
  handleSubmitAdmin = e => {
    e.preventDefault() // Empêche le comportement de soumission par défaut du formulaire
    // Création d'un objet "user" contenant les informations de l'administrateur
    const user = {
      // Le type de l'utilisateur est "Admin"
      type: "Admin", 
      // Récupération de l'email depuis le champ du formulaire
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value, 
      // Récupération du mot de passe depuis le champ du formulaire
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value, 
      // L'état de connexion de l'utilisateur est défini sur "connected"
      status: "connected" 
    }
    // Stockage des informations utilisateur dans localStorage
    this.localStorage.setItem("user", JSON.stringify(user))
     // Tentative de connexion de l'utilisateur ou création s'il n'existe pas
    this.login(user)
      .catch(
        /* istanbul ignore next */ 
        (err) => this.createUser(user) // Si une erreur survient, tente de créer l'utilisateur
      )
      .then(() => {
        // Redirection vers la page appropriée après la connexion
        // Après la connexion ou la création, effectue les actions suivantes :
        // Redirection vers le tableau de bord (Dashboard)
        this.onNavigate(ROUTES_PATH['Dashboard'])
        // Mise à jour de la valeur de l'emplacement précédent
        this.PREVIOUS_LOCATION = ROUTES_PATH['Dashboard']
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION
         // Modification de la couleur de fond du corps du document
        document.body.style.backgroundColor="#fff"
      })
  }

  // not need to cover this function by tests
  // Fonction de connexion (non nécessaire pour les tests)
  /* istanbul ignore next */ 
  login = (user) => {
    if (this.store) { // Vérifie si le magasin de données (store) est disponible
      return this.store // Si oui, exécute la fonction login du magasin
      .login(JSON.stringify({ // Appelle la fonction login avec les informations de connexion de l'utilisateur
        email: user.email, // Récupère l'email de l'utilisateur
        password: user.password, // Récupère le mot de passe de l'utilisateur
      })).then(({jwt}) => {
        // Une fois connecté avec succès, stocke le jeton d'authentification (jwt) dans localStorage
        localStorage.setItem('jwt', jwt)
      })
    } else {
      return null // Si le magasin de données n'est pas disponible, renvoie null
    }
  }

  // not need to cover this function by tests
  // Fonction de création d'utilisateur (non nécessaire pour les tests)
  // Méthode pour créer un nouvel utilisateur
  /* istanbul ignore next */ 
  createUser = (user) => {
    if (this.store) { // Vérifie si le magasin de données (store) est disponible
      return this.store // Si oui, exécute la fonction de création d'utilisateur du magasin
      .users()
      .create({data:JSON.stringify({ // Crée un nouvel utilisateur avec les données spécifiées
        type: user.type, // Récupère le type de l'utilisateur (Admin ou Employee)
        name: user.email.split('@')[0], // Utilise la partie avant "@" de l'email comme nom
        email: user.email, // Récupère l'email de l'utilisateur
        password: user.password, // Récupère le mot de passe de l'utilisateur
      })})
      .then(() => {
        // Une fois l'utilisateur créé avec succès, affiche un message de succès
        // console.log(`User with ${user.email} is created`)
        // Tente de connecter l'utilisateur nouvellement créé
        return this.login(user)
      })
    } else {
      return null // Si le magasin de données n'est pas disponible, renvoie null
    }
  }
}
