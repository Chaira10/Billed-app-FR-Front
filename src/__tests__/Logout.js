/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Logout from "../containers/Logout.js"
import '@testing-library/jest-dom/extend-expect'
import { localStorageMock } from "../__mocks__/localStorage.js"
import DashboardUI from "../views/DashboardUI.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

// On crée un tableau de factures simulées
const bills = [{
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "pending",
  "type": "Hôtel et logement",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "commentAdmin": "ok",
  "email": "a@a",
  "pct": 20,
}]
// On commence le groupe de tests
describe('Given I am connected', () => {
  // On commence le sous-groupe de tests
  describe('When I click on disconnect button', () => {
    // On effectue le test : alors, je devrais être redirigé vers la page de connexion
    test(('Then, I should be sent to login page'), () => {
      // On crée une fonction de navigation simulée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On simule l'objet window.localStorage avec notre mock localStorageMock
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // On ajoute un élément "user" simulé dans le localStorage
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On génère le HTML simulé de la vue DashboardUI avec les factures simulées
      document.body.innerHTML = DashboardUI({ bills })
      // On crée une instance de la classe Logout avec des paramètres simulés
      const logout = new Logout({ document, onNavigate, localStorage })
      // On crée une fonction de clic simulée
      const handleClick = jest.fn(logout.handleClick)
      // On obtient l'élément de déconnexion avec un attribut de test "layout-disconnect"
      const disco = screen.getByTestId('layout-disconnect')
      // On ajoute un écouteur d'événement de clic simulé avec la fonction handleClick
      disco.addEventListener('click', handleClick)
      // On simule un clic sur l'élément de déconnexion
      userEvent.click(disco)
      // On vérifie que la fonction handleClick a été appelée
      expect(handleClick).toHaveBeenCalled()
      // On vérifie que le texte "Administration" est présent dans le DOM
      expect(screen.getByText('Administration')).toBeTruthy()
    })
  })
})
