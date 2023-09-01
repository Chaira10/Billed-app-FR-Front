/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"

// On commence le groupe de tests
describe('Given I am connected as Employee', () => {
  // On effectue le test : alors, les icônes devraient être rendues
  test("Then Icons should be rendered", () => {
    // On simule l'objet window.localStorage avec notre mock localStorageMock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    // On crée un objet utilisateur simulé de type "Employee"
    const user = JSON.stringify({
      type: 'Employee'
    })
    // On ajoute l'objet utilisateur simulé dans le localStorage
    window.localStorage.setItem('user', user)
    // On génère le HTML simulé de la vue VerticalLayout avec une hauteur de 120 pixels
    const html = VerticalLayout(120)
    // On insère le HTML simulé dans le corps du document
    document.body.innerHTML = html
    // On vérifie que l'élément avec un attribut de test "icon-window" est présent dans le DOM
    expect(screen.getByTestId('icon-window')).toBeTruthy()
    // On vérifie que l'élément avec un attribut de test "icon-mail" est présent dans le DOM
    expect(screen.getByTestId('icon-mail')).toBeTruthy()
  })

})
