import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

//  Fonction pour générer une ligne (ligne de tableau) pour une facture donnée
const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }
// Fonction pour générer les lignes de tableau en fonction des données de facturation
  const rows = (data) => {
    return data && data.length
      ? data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((bill) => row(bill))
          .join("")  // Joindre toutes les lignes en une seule chaîne
      : "";
  };
// Composant principal exporté
export default ({ data: bills, loading, error }) => {
  // Fonction pour générer le contenu HTML de la modale d'affichage des fichiers
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content" data-testid="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)
 // Si en cours de chargement, affiche la page de chargement
  if (loading) {
    return LoadingPage()
  } else if (error) { // Si une erreur s'est produite, affiche la page d'erreur
    return ErrorPage(error)
  }
  // Génération du contenu principal de la page
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}