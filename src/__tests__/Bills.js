/**
 * @jest-environment jsdom
 */
jest.mock('../containers/Logout', () => {
  return jest.fn().mockImplementation(() => {
    return {anyMethod: () => {}};
  });
});
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import { newBill } from "../views/NewBillUI.js";
import mockStore from "../__mocks__/store";
import { formatDate, formatStatus } from "../app/format.js";

import Logout from '../containers/Logout.js';
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";

// En haut de votre fichier de test, avant tous les describe et tests
jest.mock("../app/format.js", () => ({
  formatDate: jest.fn((date) => {
    if (date === "bad-date-format") {
      throw new Error("Error formatting date");
    }
    // Simulez un formatage de date réussi pour les autres cas
    return `formatted_${date}`;
  }),
  formatStatus: jest.fn((status) => `formatted_${status}`),
}));

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {
      // On simule une session utilisateur de type "Employee" en manipulant localStorage.
      // Ceci est nécessaire pour que l'application pense qu'un utilisateur est connecté.

      // On utilise Object.defineProperty pour redéfinir la propriété "localStorage" de l'objet global "window".
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock, // On définit la nouvelle valeur de la propriété "localStorage" avec "localStorageMock".
      });
      // Ensuite, on utilise la nouvelle "window.localStorage" pour stocker des données localement dans le navigateur.
      window.localStorage.setItem(
        "user",// On définit la clé "user" pour stocker les données.
        JSON.stringify({
          type: "Employee",// On stocke un objet JSON qui représente un utilisateur de type "Employee".
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
      //effectuer une vérification pour voir si l'icône de la fenêtre est mise en surbrillance comme prévu.
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

  describe('constructor', () => {
    let mockDocument, mockOnNavigate, mockStore, mockLocalStorage;
    let buttonNewBill, iconEye;
  
    beforeEach(() => {
      // Mock de document.querySelector et document.querySelectorAll
      buttonNewBill = {addEventListener: jest.fn()};
      iconEye = [{addEventListener: jest.fn()}, {addEventListener: jest.fn()}];
  
      mockDocument = {
        querySelector: jest.fn().mockImplementation(selector => {
          if (selector === `button[data-testid="btn-new-bill"]`) return buttonNewBill;
          return null;
        }),
        querySelectorAll: jest.fn().mockImplementation(selector => {
          if (selector === `div[data-testid="icon-eye"]`) return iconEye;
          return [];
        }),
      };
  
      mockOnNavigate = jest.fn();
      mockStore = { bills: jest.fn() };
      mockLocalStorage = {};
  
      // Instance de Bills avec les mocks
      new Bills({ document: mockDocument, onNavigate: mockOnNavigate, store: mockStore, localStorage: mockLocalStorage });
    });
  
    test('should initialize correctly', () => {
      // Tests pour vérifier que les éléments sont correctement sélectionnés et les écouteurs ajoutés
      expect(mockDocument.querySelector).toHaveBeenCalledWith(`button[data-testid="btn-new-bill"]`);
      expect(mockDocument.querySelectorAll).toHaveBeenCalledWith(`div[data-testid="icon-eye"]`);
      expect(buttonNewBill.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      iconEye.forEach(icon => {
        expect(icon.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      });
  
      // Assurez-vous que cette ligne est après la création de l'instance Bills
      expect(Logout).toHaveBeenCalledWith({
        document: mockDocument, 
        localStorage: mockLocalStorage, 
        onNavigate: mockOnNavigate,
      });
    });
  });

  describe('handleClickNewBill', () => {
    let mockOnNavigate; // Déclarez mockOnNavigate dans un scope accessible
    let instance; // Déclarez instance pour qu'elle soit accessible dans tous les tests
  
    beforeEach(() => {
      // Initialisez mockOnNavigate avant chaque test
      mockOnNavigate = jest.fn();
  
      // Supposons que mockStore et mockLocalStorage soient définis ailleurs ou ici
      const mockStore = {};
      const mockLocalStorage = {};
  
      // Initialisez l'instance de Bills ici pour réutiliser dans chaque test
      instance = new Bills({
        document,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: mockLocalStorage
      });
    });
  
    test('should navigate to new bill on button click', () => {
      // Simulez l'appel à handleClickNewBill
      instance.handleClickNewBill();
  
      // Vérifiez que mockOnNavigate a été appelé avec le bon chemin
      expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    });
  
    // Nettoyage après les tests si nécessaire
    afterEach(() => {
      document.body.innerHTML = ''; // Supprime tous les éléments ajoutés au body
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


  describe('handleClickIconEye', () => {
    let mockDocument, mockOnNavigate, mockStore, mockLocalStorage;
    let instance, iconsEye;
  
    beforeEach(() => {
      // Mocks initiaux comme dans votre configuration
      mockOnNavigate = jest.fn();
      mockStore = { bills: jest.fn() };
      mockLocalStorage = {};
      iconsEye = document.createElement('div');
      iconsEye.setAttribute('data-testid', 'icon-eye');
      iconsEye.setAttribute('data-bill-url', 'http://example.com/bill.jpg');
  
      mockDocument = {
        querySelector: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([iconsEye])
      };
  
      // Mock de la méthode qui affiche la modale
      $.fn.modal = jest.fn();
  
      // Instance de Bills avec les mocks
      instance = new Bills({
        document: mockDocument,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: mockLocalStorage
      });
  
      // Assurez-vous que l'écouteur d'événement est attaché à iconEye
      instance.handleClickIconEye = jest.fn(instance.handleClickIconEye.bind(instance));
      iconsEye.addEventListener('click', () => instance.handleClickIconEye(iconsEye));
    });
  
    test('Icon eye click should call handleClickIconEye and open modal', () => {
      // Simuler un clic sur l'icône "eye"
      iconsEye.click();
  
      // Vérifier que handleClickIconEye a été appelé
      expect(instance.handleClickIconEye).toHaveBeenCalledWith(iconsEye);
  
      // Vérifier que la modale est bien appelée à s'ouvrir
      expect($.fn.modal).toHaveBeenCalledWith('show');
    });
  });
  









  // test d'intégration GET
  describe("getBills", () => {
    // Définition d'une fonction onNavigate pour simuler la navigation
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    // Mock initial pour le store, formatDate, et formatStatus 
    const mockStore = {
      bills: jest.fn().mockReturnThis(),
      list: jest.fn().mockResolvedValue([
        { date: "2024-02-29", status: "pending", amount: 100 },
      ]),
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

    test("it should handle format error correctly and return non-formatted date with formatted status", async () => {
      // Configuration initiale du mockStore comme indiqué précédemment
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: jest.fn().mockResolvedValue([
            { date: "bad-date-format", status: "pending", amount: 100 },
            { date: "2021-03-20", status: "accepted", amount: 200 },
          ]),
        };
      });
  
      const billsToDisplay = await billsContainer.getBills();
  
      // Vérifiez que la fonction formatDate a été appelée et a généré une erreur pour la date incorrecte
      expect(billsToDisplay[0].date).toEqual("bad-date-format");
      expect(billsToDisplay[0].status).toEqual("formatted_pending");
  
      // Vérifiez que les autres dates/status sont correctement formatés
      expect(billsToDisplay[1].date).toEqual("formatted_2021-03-20");
      expect(billsToDisplay[1].status).toEqual("formatted_accepted");
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
      // const root = document.createElement("div");
      // root.setAttribute("id", "root");
      // document.body.append(root);
      // // Appel de la fonction router pour la navigation
      // router();
      // window.onNavigate(ROUTES_PATH.Bills);

      test("It is a 500 error Then error page should be displayed", async () => {

        // Configuration de mockStore.bills pour jeter une erreur 500 lors de l'appel et vérification de l'affichage de la page d'erreur avec le bon message d'erreur 500
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500")) ;
            }
          }
          
        });
        window.onNavigate(ROUTES_PATH.Bills);
        // document.body.innerHTML = BillsUI({ error: "Erreur 500" });
        await new Promise(process.nextTick)
        const error = screen.getByText(/Erreur 500/);
        expect(error).toBeTruthy();
      });

      test("It is a 404 error", async () => {
        // Configuration de mockStore.bills pour jeter une erreur 404 lors de l'appel et vérification de l'affichage de la page d'erreur avec le bon message d'erreur 404
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404")) ;
            }
          }
          
        });
        window.onNavigate(ROUTES_PATH.Bills);
        // document.body.innerHTML = BillsUI({ error: "Erreur 500" });
        await new Promise(process.nextTick)
        const error = screen.getByText(/Erreur 404/);
        expect(error).toBeTruthy();

      });
    });
  });
});
