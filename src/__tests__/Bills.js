/**
 * @jest-environment jsdom
 */
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import { newBill } from "../views/NewBillUI.js";
import mockStore from "../__mocks__/store";
import { formatDate, formatStatus } from "../app/format.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // On simule une session utilisateur de type "Employee" en manipulant localStorage.
      // Ceci est nécessaire pour que l'application pense qu'un utilisateur est connecté.
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      // Création d'un élément <div> qui servira de conteneur racine pour l'application.
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      // Initialisation de la gestion des routes dans l'application.
      router();
      // Simulation de la navigation vers la page des factures.
      window.onNavigate(ROUTES_PATH.Bills);
      // Attente que l'icône de la fenêtre soit rendue à l'écran.
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      // À ce stade, nous pourrions effectuer une vérification pour voir si l'icône de la fenêtre est mise en surbrillance comme prévu.
      // Ceci est laissé en tant que "to-do" dans le code.
    });
    test("Then bills should be ordered from earliest to latest", () => {
      // On remplace le contenu du <body> par le rendu des factures, ce qui nous permet de cibler les éléments DOM des factures.
      document.body.innerHTML = BillsUI({ data: bills });
      // Extraction des dates de facturation à partir du texte des éléments correspondants.
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      // Fonction de tri anti-chronologique pour trier les dates des factures.
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      // Tri des dates dans l'ordre anti-chronologique.
      const datesSorted = [...dates].sort(antiChrono);
      // Vérification que les dates extraites sont triées dans l'ordre anti-chronologique.
      expect(dates).toEqual(datesSorted);
    });
  });

});
