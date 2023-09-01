/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'

// On décrit le scénario : lorsque je suis connecté en tant qu'employé
describe('Given I am connected as an Employee', () => {
  // On décrit le sous-scénario : lorsque je suis sur la page des notes de frais et qu'il y a des notes de frais
  describe('When I am on Bills page and there are bills', () => {
    // On effectue le test : alors, l'icône de l'œil devrait être rendue
    test(('Then, it should render icon eye'), () => {
      // On génère le HTML de la page des actions simulée
      const html = Actions()
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que l'élément avec l'attribut de test "icon-eye" est présent
      expect(screen.getByTestId('icon-eye')).toBeTruthy()
    })
  })
  // On décrit un autre sous-scénario : lorsque je suis sur la page des notes de frais et qu'il y a des notes de frais avec une URL de fichier
  describe('When I am on Bills page and there are bills with url for file', () => {
    // On effectue le test : alors, l'URL donnée devrait être enregistrée dans l'attribut personnalisé "data-bill-url"
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      // L'URL simulée pour le test
      const url = '/fake_url'
      // On génère le HTML de la page des actions simulée avec l'URL
      const html = Actions(url)
      // On place le HTML simulé dans le corps du document
      document.body.innerHTML = html
      // On vérifie que l'élément avec l'attribut de test "icon-eye" a l'attribut "data-bill-url" avec la valeur de l'URL simulée
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
    })
  })
})
