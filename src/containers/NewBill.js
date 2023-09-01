import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

// Cette classe gère la création d'une nouvelle facture
export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document  // Stocke l'objet document
    this.onNavigate = onNavigate // Stocke la fonction de navigation
    this.store = store // Stocke le magasin de données
    // Récupère le formulaire de création de facture et ajoute un écouteur d'événement "submit"
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    // Récupère l'élément d'entrée de type fichier et ajoute un écouteur d'événement "change"
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null // Initialise l'URL du fichier à null
    this.fileName = null // Initialise le nom du fichier à null
    this.billId = null // Initialise l'identifiant de la facture à null
    new Logout({ document, localStorage, onNavigate })  // Initialise la classe Logout
  }

  // Gestionnaire d'événement pour le changement de fichier
  handleChangeFile = e => {
    e.preventDefault()  // Empêche le comportement par défaut de l'événement
    // Récupère le fichier sélectionné dans l'élément d'entrée de type fichier
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    // Sépare le chemin complet du fichier pour obtenir le nom du fichier
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    // Crée un objet FormData pour envoyer le fichier et d'autres données au serveur
    const formData = new FormData()
    // Récupère l'adresse e-mail de l'utilisateur à partir des données stockées dans localStorage
    const email = JSON.parse(localStorage.getItem("user")).email
    // Ajoute le fichier et l'adresse e-mail au FormData
    formData.append('file', file)
    formData.append('email', email)
 // Utilise le magasin de données pour créer une nouvelle facture avec le FormData
    this.store
      .bills()
      .create({
        data: formData,  // Les données du formulaire, y compris le fichier et l'adresse e-mail
        headers: {
          noContentType: true // Indique que le contenu de la requête est déjà dans FormData
        }
      })
      .then(({fileUrl, key}) => {
        console.log(fileUrl)  // Affiche l'URL du fichier après la création de la facture
        this.billId = key // Stocke l'identifiant de la facture créée
        this.fileUrl = fileUrl  // Stocke l'URL du fichier
        this.fileName = fileName  // Stocke le nom du fichier
      }).catch(error => console.error(error))  // En cas d'erreur, affiche l'erreur dans la console
  }
  // Gère la soumission du formulaire de création de facture
  handleSubmit = e => {
    e.preventDefault()  // Empêche le comportement par défaut du formulaire
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    // Récupère l'adresse e-mail de l'utilisateur connecté depuis localStorage
    const email = JSON.parse(localStorage.getItem("user")).email
    // Construit un objet "bill" avec les données du formulaire
    const bill = {
      email,  // Adresse e-mail de l'utilisateur
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value, // Type de dépense sélectionné
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value, // Nom de la dépense
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value), // Montant de la dépense (converti en entier)
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value, // Date de la dépense
      vat: e.target.querySelector(`input[data-testid="vat"]`).value, // Valeur de la TVA
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20, // Pourcentage (par défaut à 20% si non fourni)
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value, // Commentaires
      fileUrl: this.fileUrl, // URL du fichier joint (si disponible)
      fileName: this.fileName, // Nom du fichier joint (si disponible)
      status: 'pending' // Statut initial de la facture (en attente)
    }
    // Appelle la méthode pour mettre à jour la facture avec les données fournies
    this.updateBill(bill)
    // Navigue vers la page des factures après la soumission du formulaire
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  // Met à jour une facture avec les nouvelles données fournies
  updateBill = (bill) => {
    if (this.store) { // Vérifie si le magasin de données est disponible
       // Appelle la méthode de mise à jour des factures dans le magasin
      this.store
      .bills() // Accède à la collection de factures dans le magasin
      .update({data: JSON.stringify(bill),  // Les nouvelles données de la facture au format JSON
        selector: this.billId}) // Sélecteur pour cibler la facture à mettre à jour par son identifiant (this.billId)
      .then(() => {
        // Après la mise à jour réussie, navigue vers la page des factures
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error)) // Gère les erreurs en les affichant dans la console
    }
  }
}