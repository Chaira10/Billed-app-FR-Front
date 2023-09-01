import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

// Fonction pour filtrer les factures en fonction du statut
export const filteredBills = (data, status) => {
   // Vérifie si data est défini et non vide
  return (data && data.length) ?
  // Utilise la méthode filter pour parcourir les factures dans data
    data.filter(bill => {
      let selectCondition

      // Vérification si l'environnement est Jest (test)
      if (typeof jest !== 'undefined') {
        // Si c'est un environnement de test, vérifie simplement le statut de la facture
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
      else {
         // Environnement de production
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        // Vérifie le statut de la facture et si l'email est autorisé pour l'affichage
        selectCondition =
          (bill.status === status) &&
          // Vérifie si l'email de la facture est dans la liste des utilisateurs autorisés
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition // Renvoie la condition de sélection résultante
    }) : [] // Renvoie un tableau vide si data est vide ou non défini
}
 // Fonction pour générer le contenu HTML d'une carte de facture
 // Fonction pour créer une carte de facture à partir des données fournies
export const card = (bill) => {
  // Séparation du prénom et du nom à partir de l'email
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ? // Vérifie si l'email contient un point pour séparer prénom et nom
    firstAndLastNames.split('.')[0] : ''  // Extrait le prénom de la partie avant le premier point
  const lastName = firstAndLastNames.includes('.') ? // Vérifie si l'email contient un point pour séparer prénom et nom
  firstAndLastNames.split('.')[1] : firstAndLastNames // Extrait le nom de la partie après le premier point (ou nom complet s'il n'y a pas de point)
// Crée une carte de facture HTML à partir des données de la facture
  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}
// Génère des cartes de facture HTML à partir d'un tableau de factures
export const cards = (bills) => {
   // Fonction pour générer une liste de cartes de facture
    // Vérifie si le tableau de factures est présent et non vide
  return bills && bills.length ? 
  // Pour chaque facture dans le tableau, appelle la fonction card pour générer une carte de facture et les joint en une seule chaîne
  bills.map(bill => card(bill)).join("") 
  : ""  // Si le tableau est vide, renvoie une chaîne vide
}

  // Fonction pour obtenir le statut en fonction de l'index
export const getStatus = (index) => {
  // Utilisation d'une instruction switch pour mapper l'index aux statuts correspondants
  switch (index) {
    case 1:
      return "pending" // Si l'index est 1, renvoie "pending"
    case 2:
      return "accepted" // Si l'index est 2, renvoie "accepted"
    case 3:
      return "refused" // Si l'index est 3, renvoie "refused"
      // Aucun autre cas spécifié, renvoie null par défaut si l'index ne correspond à aucun des cas ci-dessus
  }
}

export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
     // Initialisation des propriétés de la classe avec les paramètres passés
    this.document = document // Stocke l'objet document
    this.onNavigate = onNavigate // Stocke la fonction de navigation
    this.store = store // Stocke le magasin de données
    // Ajout d'écouteurs d'événements aux icônes de flèche pour afficher les tickets
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    // Initialisation de la classe Logout avec les paramètres appropriés
    new Logout({ localStorage, onNavigate })  
  }

  // Gestionnaire de clic pour l'icône "eye"
  handleClickIconEye = () => {
    // Récupération de l'URL de la facture à partir de l'attribut "data-bill-url" de l'icône
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    // Calcul de la largeur de l'image en utilisant la largeur de la modale
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    // Mise à jour du contenu de la modale avec une balise <img> affichant la facture
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    // Vérification si la fonction "modal" existe sur l'élément avec l'ID "modaleFileAdmin1"
    if (typeof $('#modaleFileAdmin1').modal === 'function') 
    // Affichage de la modale en appelant la fonction "modal('show')"
    $('#modaleFileAdmin1').modal('show')
  }

   // Gestionnaire de clic pour éditer une facture
  handleEditTicket(e, bill, bills) {
    // Si le compteur est indéfini ou l'ID est différent de l'ID de la facture, initialiser le compteur à 0
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0
    // Si l'ID est indéfini ou l'ID est différent de l'ID de la facture, stocker l'ID de la facture
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id
    // Si le compteur est pair, mettre en évidence la facture sélectionnée et afficher le formulaire d'édition
    if (this.counter % 2 === 0) {
      bills.forEach(b => {
        // Mettre en évidence les autres factures et afficher le formulaire d'édition pour la facture en cours
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' }) // Mettre en évidence les autres factures
      })
      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' }) // Mettre en évidence la facture actuelle
      $('.dashboard-right-container div').html(DashboardFormUI(bill)) // Afficher le formulaire d'édition pour la facture
      $('.vertical-navbar').css({ height: '150vh' }) // Ajuster la hauteur de la barre de navigation verticale
      this.counter ++ // Incrémenter le compteur pour suivre l'état de l'affichage
    } else {
      // Si le compteur est impair, remettre en forme la facture et afficher une icône
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' }) // Rétablir l'arrière-plan original de la facture

      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `) // Afficher une icône pour indiquer que la facture est affichée en grand
      $('.vertical-navbar').css({ height: '120vh' }) // Ajuster la hauteur de la barre de navigation verticale
      this.counter ++  // Incrémenter le compteur pour suivre l'état de l'affichage
    }
    // Ajout d'un gestionnaire de clic sur l'icône "eye"
    $('#icon-eye-d').click(this.handleClickIconEye)
    // Ajout d'un gestionnaire de clic sur le bouton d'acceptation de la facture
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    // Ajout d'un gestionnaire de clic sur le bouton de refus de la facture
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  }
// Gestionnaire de soumission pour accepter une facture
  handleAcceptSubmit = (e, bill) => {
    // Création d'un nouvel objet `newBill` basé sur l'objet `bill` en utilisant la décomposition d'objet
    const newBill = {
      ...bill, // Copie toutes les propriétés de l'objet `bill`
      // Mise à jour du statut de la facture à 'accepted'
      status: 'accepted',
      // Récupération de la valeur du champ de commentaire de l'administrateur
      commentAdmin: $('#commentary2').val()
    }
    // Mise à jour de la facture dans le système avec le nouveau statut et le commentaire de l'administrateur
    this.updateBill(newBill)
    // Naviguer vers le tableau de bord après avoir accepté la facture
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  // Gestionnaire de soumission pour refuser une facture
  handleRefuseSubmit = (e, bill) => {
    // Création d'un nouvel objet `newBill` basé sur l'objet `bill` en utilisant la décomposition d'objet
    const newBill = {
      ...bill, // Copie toutes les propriétés de l'objet `bill`
      // Mise à jour du statut de la facture à 'refused'
      status: 'refused',
      // Récupération de la valeur du champ de commentaire de l'administrateur
      commentAdmin: $('#commentary2').val()
    }
    // Mise à jour de la facture dans le système avec le nouveau statut et le commentaire de l'administrateur
    this.updateBill(newBill)
    // Naviguer vers le tableau de bord après avoir refusé la facture
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }
// Fonction pour afficher ou masquer les tickets en fonction de l'index donné
  handleShowTickets(e, bills, index) {
    // Vérifie si le compteur n'est pas défini ou si l'index a changé
    if (this.counter === undefined || this.index !== index) this.counter = 0
    // Vérifie si l'index n'est pas défini ou a changé
    if (this.index === undefined || this.index !== index) this.index = index
    // Si le compteur est pair (0, 2, 4, ...), alors afficher les tickets correspondants
    if (this.counter % 2 === 0) {
      // Réinitialisation de l'icône de flèche pour indiquer l'ouverture
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)'})
      // Remplissage du conteneur avec les cartes de factures filtrées par statut
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      this.counter ++
    } else {
       // Rotation de l'icône de flèche pour indiquer la fermeture
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      // Suppression du contenu du conteneur
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter ++
    }
    // Ajout d'un écouteur de clic à chaque ticket pour la gestion de l'édition
    bills.forEach(bill => {
      $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })
    // Renvoie la liste des factures mise à jour
    return bills
  }
 // Récupération de toutes les factures pour tous les utilisateurs
  getBillsAllUsers = () => {
    // Vérifie si la propriété 'store' est définie
    if (this.store) {
      return this.store // Renvoie le magasin actuel
      .bills() // Accède au magasin "bills"
      .list()  // Appelle la méthode "list()" pour obtenir la liste des factures
      .then(snapshot => {
        // Transformation des données de chaque facture
        const bills = snapshot
        .map(doc => ({
          id: doc.id,
          ...doc,  // Copie toutes les propriétés de l'objet facture
          date: doc.date,  // Conserve la date non formatée
          status: doc.status // Conserve le statut
        }))
        return bills // Renvoie la liste des factures modifiée
      })
      .catch(error => {
        throw error; // Lève une exception en cas d'erreur
      })
    }
  }

  // Fonction pour mettre à jour une facture (ignorée pour les tests)
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {  // Vérifie si le magasin est disponible
    return this.store   // Renvoie le magasin actuel
      .bills() // Accède au magasin "bills"
      .update({data: JSON.stringify(bill), selector: bill.id}) // Appelle la méthode "update()" du magasin pour mettre à jour la facture
      .then(bill => bill) // Renvoie la facture mise à jour
      .catch(console.log) // Gère les erreurs en affichant les messages de journalisation dans la console
    }
  }
}
