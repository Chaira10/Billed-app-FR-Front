/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


// On commence le groupe de tests
describe("Given I am connected as an employee", () => {
  // On effectue le test : alors, lorsque je suis sur la page NewBill
  describe("When I am on NewBill Page", () => {
    // On effectue le test : alors ...
    test("Then ...", () => {
      // On génère le HTML simulé de la vue NewBillUI
      const html = NewBillUI()
      // On insère le HTML simulé dans le corps du document
      document.body.innerHTML = html
      //to-do write assertion
      // À compléter : Ajoutez ici vos assertions pour vérifier le comportement attendu
    })
  })
})
