import { ROUTES_PATH } from '../constants/routes.js';  // Import des routes
import { formatDate, formatStatus } from "../app/format.js";  // Import des fonctions de formatage
import Logout from "./Logout.js";  // Import de la classe Logout

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;  // Stockage de l'objet document
    this.onNavigate = onNavigate;  // Stockage de la fonction de navigation
    this.store = store;  // Stockage du magasin de données
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill);  // Ajout d'un écouteur pour le bouton "New Bill"
    
    // Récupération de tous les éléments avec l'attribut data-testid="icon-eye"
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon));  // Ajout d'un écouteur pour chaque icône "eye"
    });
    
    new Logout({ document, localStorage, onNavigate });  // Initialisation de la classe Logout
  }

  // Gestionnaire de clic pour le bouton "New Bill"
  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill']);  // Naviguer vers la page de création d'une nouvelle facture
  }

  // Gestionnaire de clic pour l'icône "eye"
  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");  // Récupération de l'URL de la facture
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5);  // Calcul de la largeur de l'image
    // Affichage de l'image dans une modale
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`);
    $('#modaleFile').modal('show');  // Afficher la modale
  }

  // Méthode pour récupérer les factures avec formatage des dates et des statuts
  getBills = () => {
    // Vérifie si la propriété 'store' est définie
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        // Tri des factures par date de manière décroissante (du plus récent au plus ancien)
        const bills = snapshot
        .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((doc) => {
            try {
              return {
                ...doc, // Copie les propriétés de l'objet facture
                date: formatDate(doc.date),  // Formatage de la date
                status: formatStatus(doc.status)  // Formatage du statut
              }
            } catch(e) {
              // Gestion des erreurs de formatage en conservant les données non formatées
              console.log(e,'for',doc);
              return {
                ...doc, // Copie les propriétés de l'objet facture
                date: doc.date,  // Conserver la date non formatée
                status: formatStatus(doc.status) // Formatage du statut
              }
            }
          });
        console.log('length', bills.length);  // Affichage de la longueur des factures
        return bills;  // Renvoi des factures formatées
      });
    }
  }
}
