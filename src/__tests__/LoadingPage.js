/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import LoadingPage from "../views/LoadingPage.js"

// On commence le groupe de tests Si je suis connecté à l'application (en tant qu'employé ou administrateur RH), j'ai la possibilité d'accéder à l'application.
describe('Given I am connected on app (as an Employee or an HR admin)', () => {
  // On commence le sous-groupe de tests
  describe('When LoadingPage is called', () => {
    // On effectue le test : alors, il devrait afficher "Loading..."
    test(('Then, it should render Loading...'), () => {
      // On génère le HTML de la page de chargement "Loading..."
      const html = LoadingPage()
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que le texte "Loading..." est correctement affiché
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
})
