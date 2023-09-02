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
      expect(windowIcon.classList).toContain("active-icon");
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
  describe("getBills", () => {
    // Définition d'une fonction onNavigate pour simuler la navigation
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    // Création d'une nouvelle instance de Bills avec des paramètres
    const billsContainer = new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    test("it should return formated Date and status", async () => {
      // Appel de la fonction getBills de billsContainer
      const billsToDisplay = await billsContainer.getBills();

     // Récupération des factures à partir de mockStore
      const mockedBills = await mockStore.bills().list();

      // Vérification si la date de la première facture est formatée correctement
      expect(billsToDisplay[0].date).toEqual(formatDate(mockedBills[0].date));
      // Vérification si le statut de la première facture est formaté correctement
      expect(billsToDisplay[0].status).toEqual(
        formatStatus(mockedBills[0].status)
      );
    });

    test("it should return undefined if this.store is undefined", async () => {
      // Création d'une nouvelle instance de Bills avec store undefined
      const undefinedBillsContainer = new Bills({
        document,
        onNavigate,
        store: undefined,
        localStorage: window.localStorage,
      });

      // Appel de la fonction getBills et vérification si elle renvoie undefined
      const billsToDisplay = await undefinedBillsContainer.getBills();
      expect(billsToDisplay).toBeUndefined();
    });
  });

  describe("When I fetch all date", () => {
    test("No error occurs then all bills should be displayed", async () => {
      // Configuration du localStorage avec des informations utilisateur
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      // Création d'un élément div pour simuler l'interface utilisateur
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      // Appel de la fonction router pour la navigation
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      // Attente de l'affichage des factures
      await waitFor(() => screen.getByText("Mes notes de frais"));
      const allBills = screen.getByTestId("tbody").children;
      const result = screen.getByText("test1");

      // Vérification si les 4 factures sont affichées
      expect(result).toBeTruthy();
      expect(allBills.length).toBe(4);
    });

    describe("Error appends on fetch", () => {
      // Configuration de mockStore.bills pour jeter une erreur lors de l'appel et définition du localStorage avec des informations utilisateur
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("It is a 500 error Then error page should be displayed", async () => {
        // Configuration de mockStore.bills pour jeter une erreur 500 lors de l'appel et vérification de l'affichage de la page d'erreur avec le bon message d'erreur 500
        mockStore.bills.mockImplementationOnce(() => {
          throw new Error("Erreur 500");
        });
        document.body.innerHTML = BillsUI({ error: "Erreur 500" });
        const error = screen.getByText(/Erreur 500/);
        expect(error).toBeTruthy();
      });

      test("It is a 404 error", async () => {
        // Configuration de mockStore.bills pour jeter une erreur 404 lors de l'appel et vérification de l'affichage de la page d'erreur avec le bon message d'erreur 404
        mockStore.bills.mockImplementationOnce(() => {
          throw new Error("Erreur 404");
        });
        document.body.innerHTML = BillsUI({ error: "Erreur 404" });
        const error = screen.getByText(/Erreur 404/);
        expect(error).toBeTruthy();
      });
    });
  });
});
