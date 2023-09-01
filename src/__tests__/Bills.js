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
  // Décrire le scénario de test : Lorsque je clique sur l'icône de l'œil
  describe("When i click eye icon", () => {
    // Définir la fonction onNavigate pour simuler la navigation
    const onNavigate = (pathname) => {
      // Mettre à jour le contenu du corps du document avec les routes simulées
      document.body.innerHTML = ROUTES({ pathname });
    };
    // Test : La fenêtre modale des factures devrait s'ouvrir
    test("Then it should open bills modals", () => {
      // Créer une nouvelle instance de la classe Bills
      const billsContainer = new Bills({
        // Passer l'objet document pour accéder au DOM
        document,
        // Passer la fonction onNavigate pour simuler la navigation
        onNavigate,
        // Passer le store (peut être null dans ce cas)
        store: null,
        // Passer l'objet localStorage pour la gestion des données locales
        localStorage: window.localStorage,
      });

      // Charger l'interface utilisateur de Bills dans le corps du HTML
      document.body.innerHTML = BillsUI({ data: bills });

      // Créer une fonction mock handleClickIconEye qui utilise la fonction de handleClickIconEye de billsContainer
      const handleClickIconEye = jest.fn((icon) =>
        billsContainer.handleClickIconEye(icon)
      );

      // Obtenir tous les icônes de l'œil et exécuter la fonction handleClickIconEye lors du clic sur chaque icône
      // Obtenir tous les éléments ayant un attribut 'data-testid' égal à "icon-eye"
      const iconEye = screen.getAllByTestId("icon-eye");
      // Obtenir l'élément avec l'ID "modaleFile"
      const modaleFile = document.getElementById("modaleFile");
      // Remplacer la fonction modal de jQuery par une fonction mock qui ajoute la classe "show" à l'élément modaleFile
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));

      // Pour chaque icône récupéré précédemment
      iconEye.forEach((icon) => {
        // Ajouter un écouteur d'événement pour le clic sur l'icône
        icon.addEventListener("click", handleClickIconEye(icon));
        // Simuler un clic sur l'icône en utilisant fireEvent (de la bibliothèque de tests)
        fireEvent.click(icon);
        // Vérifier si la fonction handleClickIconEye a été appelée et si le DOM a été mis à jour
        expect(handleClickIconEye).toHaveBeenCalled();
      });

      // Check if handleClickIconEye function has been called and DOM has been updated
      expect(modaleFile.classList).toContain("show");
    });
    // Test : La fenêtre modale devrait être affichée
    test("Then the modal should be displayed", () => {
      // Créer une nouvelle instance de la classe Bills
      const billsContainer = new Bills({
        // Passer l'objet document pour accéder au DOM
        document,
        // Passer la fonction onNavigate pour simuler la navigation
        onNavigate,
        // Passer le store (peut être null dans ce cas)
        store: null,
        // Passer l'objet localStorage pour la gestion des données locales
        localStorage: window.localStorage,
      });

      // Charger l'interface utilisateur de Bills dans le corps du HTML
      document.body.innerHTML = BillsUI({ data: bills });

      // Obtenir le premier élément avec un attribut 'data-testid' égal à "icon-eye"
      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`);
      // Remplacer la fonction modal de jQuery par une fonction mock vide
      $.fn.modal = jest.fn();
      // Appeler la fonction handleClickIconEye de billsContainer en utilisant l'icône récupéré
      billsContainer.handleClickIconEye(iconEye);
      // Vérifier si un élément avec la classe "modal" existe dans le document
      expect(document.querySelector(".modal")).toBeTruthy();
    });
  });
});
