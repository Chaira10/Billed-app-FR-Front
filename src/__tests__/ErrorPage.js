/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import ErrorPage from "../views/ErrorPage.js"

// On commence le groupe de tests
describe('Given I am connected on app (as an Employee or an HR admin)', () => {
  // On effectue le test : alors, lorsque la fonction ErrorPage est appelée sans erreur dans sa signature
  describe('When ErrorPage is called without and error in its signature', () => {
    // On effectue le test : alors ...
    test(('Then, it should render ErrorPage with no error message'), () => {
      // On génère le HTML simulé de la vue ErrorPage avec aucune erreur
      const html = ErrorPage()
      // On insère le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que le texte "Erreur" est présent à l'écran
      expect(screen.getAllByText('Erreur')).toBeTruthy()
      // On vérifie que l'élément avec le data-testid 'error-message' a un contenu vide
      expect(screen.getByTestId('error-message').innerHTML.trim().length).toBe(0)
    })
  })
  // On effectue le test : alors, lorsque la fonction ErrorPage est appelée avec un message d'erreur dans sa signature
  describe('When ErrorPage is called with error message in its signature', () => {
    // On effectue le test : alors ...
    test(('Then, it should render ErrorPage with its error message'), () => {
      // Message d'erreur à utiliser dans le test
      const error = 'Erreur de connexion internet'
      // On génère le HTML simulé de la vue ErrorPage avec le message d'erreur
      const html = ErrorPage(error)
      // On insère le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que le texte de l'erreur est présent à l'écran
      expect(screen.getAllByText(error)).toBeTruthy()
    })
  })
})
