/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import DashboardFormUI from "../views/DashboardFormUI.js"
import { formatDate } from "../app/format.js"

// Les données simulées d'une facture
const bill = {
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "accepted",
  "type": "Hôtel et logement",
  "commentAdmin": "ok",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "email": "a@a",
  "pct": 20
}
// Les données simulées d'une facture avec statut "accepted"
const billAccepted = {
  ...bill,
  "status": "accepted"
}
// Les données simulées d'une facture avec statut "pending"
const billPending = {
  ...bill,
  "status": "pending"
}
// Les données simulées d'une facture avec statut "refused"
const billrefused = {
  ...bill,
  "status": "refused"
}
// On décrit le contexte : Je suis connecté en tant qu'administrateur et je me trouve sur la page du tableau de bord.
describe('Given I am connected as an Admin and I am on Dashboard Page', () => {
  // On décrit le sous-scénario : lorsque les données d'une facture sont passées à DashboardUI
  describe('When bill data is passed to DashboardUI', () => {
    // On effectue le test : alors, elles devraient être affichées dans la page
    test(('Then, it should them in the page'), () => {
      // On génère le HTML de l'interface utilisateur du tableau de bord simulée avec les données de la facture
      const html = DashboardFormUI(bill)
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que les éléments contenant les données de la facture sont présents
      expect(screen.getByText(bill.vat)).toBeTruthy()
      expect(screen.getByText(bill.type)).toBeTruthy()
      expect(screen.getByText(bill.commentary)).toBeTruthy()
      expect(screen.getByText(bill.name)).toBeTruthy()
      expect(screen.getByText(bill.fileName)).toBeTruthy()
      expect(screen.getByText(formatDate(bill.date))).toBeTruthy()
      expect(screen.getByText(bill.amount.toString())).toBeTruthy()
      expect(screen.getByText(bill.pct.toString())).toBeTruthy()
    })
  })
  // On décrit le contexte : 
  describe('When pending bill is passed to DashboardUI', () => {
    // On effectue le test : alors, il devrait afficher le bouton et la zone de texte
    test(('Then, it should show button and textArea'), () => {
       // On génère le HTML de l'interface utilisateur du tableau de bord simulée avec les données d'une facture en attente
      const html = DashboardFormUI(billPending)
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que les éléments "Accepter" et "Refuser" ainsi que la zone de texte sont présents
      expect(screen.getByText("Accepter")).toBeTruthy()
      expect(screen.getByText("Refuser")).toBeTruthy()
      expect(screen.getByTestId("commentary2")).toBeTruthy()
    })
  })
  // On décrit le contexte : 
  describe('When accepted bill is passed to DashboardUI', () => {
    // On effectue le test : alors, il devrait afficher le bouton et la zone de texte
    test(('Then, it should show admin commentary'), () => {
      // On génère le HTML de l'interface utilisateur du tableau de bord simulée avec les données d'une facture acceptée
      const html = DashboardFormUI(billAccepted)
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que le commentaire de l'administrateur est correctement affiché
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy()
    })
  })
  // On décrit le contexte : 
  describe('When refused bill is passed to DashboardUI', () => {
    // On effectue le test : alors, il devrait afficher le bouton et la zone de texte
    test(('Then, it should show admin commentary'), () => {
      // On génère le HTML de l'interface utilisateur du tableau de bord simulée avec les données d'une facture refusé
      const html = DashboardFormUI(billrefused)
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que le commentaire de l'administrateur est correctement affiché
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy()
    })
  })
})

