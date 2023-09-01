/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)

// On commence le groupe de tests
describe('Given I am connected as an Admin', () => {
  // On commence le test Lorsque je suis sur la page du tableau de bord, il y a des factures, et il y en a une en attente.
  describe('When I am on Dashboard page, there are bills, and there is one pending', () => {
    // On test Ensuite, l'option FilteredBills by pending status (factures filtrées en fonction de l'état d'avancement) devrait renvoyer 1 facture.
    test('Then, filteredBills by pending status should return 1 bill', () => {
      // On filtre les factures avec le statut "pending"
      const filtered_bills = filteredBills(bills, "pending")
      // On vérifie que la longueur du tableau de factures filtrées est égale à 1
      expect(filtered_bills.length).toBe(1)
    })
  })
  // On commence le groupe de tests
  describe('When I am on Dashboard page, there are bills, and there is one accepted', () => {
    // On effectue le test : alors, lorsqu'il y a une page Dashboard, des factures et qu'il y a une facture acceptée
    test('Then, filteredBills by accepted status should return 1 bill', () => {
      // On filtre les factures avec le statut "accepted"
      const filtered_bills = filteredBills(bills, "accepted")
      // On vérifie que la longueur du tableau de factures filtrées est égale à 1
      expect(filtered_bills.length).toBe(1)
    })
  })
  // On commence le groupe de tests
  describe('When I am on Dashboard page, there are bills, and there is two refused', () => {
    // On effectue le test : alors, lorsqu'il y a une page Dashboard, des factures et qu'il y a deux factures refusées
    test('Then, filteredBills by accepted status should return 2 bills', () => {
      // On filtre les factures avec le statut "refused"
      const filtered_bills = filteredBills(bills, "refused")
      // On vérifie que la longueur du tableau de factures filtrées est égale à 2
      expect(filtered_bills.length).toBe(2)
    })
  })
  // On commence le groupe de tests
  describe('When I am on Dashboard page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = DashboardUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  // On commence le groupe de tests
  describe('When I am on Dashboard page but back-end send an error message', () => {
    // On effectue le test : alors, lorsque je suis sur la page Dashboard mais elle est en cours de chargement
    test('Then, Error page should be rendered', () => {
      // On définit le contenu de la page Dashboard avec l'indicateur de chargement
      document.body.innerHTML = DashboardUI({ error: 'some error message' })
      // On vérifie que le texte "Loading..." est présent dans la page
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
// On commence le groupe de tests
  describe('When I am on Dashboard page and I click on arrow', () => {
    // On effectue le test : alors, lorsque je suis sur la page Dashboard et que je clique sur une flèche
    test('Then, tickets list should be unfolding, and cards should appear', async () => {
      // On définit la fonction de navigation fictive pour remplacer le comportement normal
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On simule que l'utilisateur est connecté en tant qu'Admin
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On crée une instance de la classe Dashboard avec les données de test
      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills:bills, localStorage: window.localStorage
      })
      // On définit le contenu de la page Dashboard avec les données de test
      document.body.innerHTML = DashboardUI({ data: { bills } })
      // On définit des fonctions pour gérer les événements de clic sur les flèches
      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      const handleShowTickets2 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 2))
      const handleShowTickets3 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 3))
      // On récupère les éléments des icônes de flèche
      const icon1 = screen.getByTestId('arrow-icon1')
      const icon2 = screen.getByTestId('arrow-icon2')
      const icon3 = screen.getByTestId('arrow-icon3')
      // On ajoute un écouteur d'événements pour le clic sur l'icône de flèche 1
      icon1.addEventListener('click', handleShowTickets1)
      // On simule un clic sur l'icône de flèche 1
      userEvent.click(icon1)
      // On vérifie si la fonction handleShowTickets1 a été appelée lors du clic
      expect(handleShowTickets1).toHaveBeenCalled()
      // On attend que l'élément de la carte du ticket spécifique soit affiché (utilisation de waitFor car c'est une opération asynchrone)
      await waitFor(() => screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`) )
      // On vérifie si l'élément de la carte du ticket spécifique est affiché comme attendu
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      // On répète le même processus pour l'icône de flèche 2
      icon2.addEventListener('click', handleShowTickets2)
      userEvent.click(icon2)
      expect(handleShowTickets2).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`) )
      expect(screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`)).toBeTruthy()
      // On répète le même processus pour l'icône de flèche 3
      icon3.addEventListener('click', handleShowTickets3)
      userEvent.click(icon3)
      expect(handleShowTickets3).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`) )
      expect(screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`)).toBeTruthy()
    })
  })
  // On décrit le test : Quand je suis sur la page du tableau de bord et que je clique sur l'icône d'édition d'une carte
  describe('When I am on Dashboard page and I click on edit icon of a card', () => {
    // On exécute le test : Alors, le formulaire approprié devrait être rempli
    test('Then, right form should be filled',  () => {
      // On définit une fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On crée un localStorage fictif pour les tests
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On initialise une instance de la classe Dashboard avec des données fictives
      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills:bills, localStorage: window.localStorage
      })
      // On remplit le corps du document HTML avec l'interface utilisateur du tableau de bord
      document.body.innerHTML = DashboardUI({ data: { bills } })
      // On définit une fonction de gestion d'événements pour afficher les détails du ticket 1
      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      // On récupère l'icône de flèche 1
      const icon1 = screen.getByTestId('arrow-icon1')
      // On ajoute un écouteur d'événements pour le clic sur l'icône de flèche 1
      icon1.addEventListener('click', handleShowTickets1)
      // On simule un clic sur l'icône de flèche 1
      userEvent.click(icon1)
      // On vérifie si la fonction handleShowTickets1 a été appelée lors du clic
      expect(handleShowTickets1).toHaveBeenCalled()
      // On vérifie si l'élément de la carte du ticket spécifique est affiché comme attendu
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      // On récupère l'icône d'édition de la carte du ticket spécifique
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      // On simule un clic sur l'icône d'édition
      userEvent.click(iconEdit)
      // On vérifie si le formulaire de tableau de bord est affiché comme attendu
      expect(screen.getByTestId(`dashboard-form`)).toBeTruthy()
    })
  })
  // On décrit le test : Quand je suis sur la page du tableau de bord et que je clique 2 fois sur l'icône d'édition d'une carte
  describe('When I am on Dashboard page and I click 2 times on edit icon of a card', () => {
    // On exécute le test : Alors, l'icône de grand ticket devrait apparaître
    test('Then, big bill Icon should Appear',  () => {
      // On définit une fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On crée un localStorage fictif pour les tests
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On initialise une instance de la classe Dashboard avec des données fictives
      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills:bills, localStorage: window.localStorage
      })
      // On remplit le corps du document HTML avec l'interface utilisateur du tableau de bord
      document.body.innerHTML = DashboardUI({ data: { bills } })
      // On définit une fonction de gestion d'événements pour afficher les détails du ticket 1
      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      // On récupère l'icône de flèche 1
      const icon1 = screen.getByTestId('arrow-icon1')
      // On ajoute un écouteur d'événements pour le clic sur l'icône de flèche 1
      icon1.addEventListener('click', handleShowTickets1)
      // On simule un clic sur l'icône de flèche 1
      userEvent.click(icon1)
      // On vérifie si la fonction handleShowTickets1 a été appelée lors du clic
      expect(handleShowTickets1).toHaveBeenCalled()
      // On vérifie si l'élément de la carte du ticket spécifique est affiché comme attendu
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      // On récupère l'icône d'édition de la carte du ticket spécifique
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      // On simule deux clics sur l'icône d'édition
      userEvent.click(iconEdit)
      userEvent.click(iconEdit)
      // On vérifie si l'icône de grand ticket est affichée comme attendu
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })

  // On décrit le test : Quand je suis sur le tableau de bord et qu'il n'y a pas de tickets
  describe('When I am on Dashboard and there are no bills', () => {
    // On exécute le test : Alors, aucune carte ne devrait être affichée
    test('Then, no cards should be shown', () => {
      // On remplit le corps du document HTML avec une interface utilisateur de cartes vides
      document.body.innerHTML = cards([])
      // On tente de récupérer l'icône d'édition de la carte du ticket spécifique
      const iconEdit = screen.queryByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      // On vérifie que l'icône d'édition n'est pas présente (elle devrait être nulle)
      expect(iconEdit).toBeNull()
    })
  })
})

// On décrit le contexte : Étant connecté en tant qu'administrateur, sur la page du tableau de bord,
// et ayant cliqué sur une note de frais en attente
describe('Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill', () => {
  // On décrit le scénario : Quand je clique sur le bouton d'acceptation
  describe('When I click on accept button', () => {
    // On effectue le test : Je devrais être redirigé vers le tableau de bord avec l'icône "big billed" à la place du formulaire
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      // On simule le stockage local de l'utilisateur administrateur
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On remplit le corps du document HTML avec l'interface utilisateur du formulaire de note de frais en attente
      document.body.innerHTML = DashboardFormUI(bills[0])
      // On définit la fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On initialise le magasin à null (non utilisé dans ce test)
      const store = null
      // On crée une instance de Dashboard avec les informations nécessaires
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      // On récupère le bouton d'acceptation
      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      // On définit une fonction de gestion de soumission pour le bouton d'acceptation
      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      acceptButton.addEventListener("click", handleAcceptSubmit)
      // On simule un clic sur le bouton d'acceptation
      fireEvent.click(acceptButton)
      // On vérifie que la fonction de gestion de soumission a été appelée
      expect(handleAcceptSubmit).toHaveBeenCalled()
      // On vérifie la présence de l'icône "big billed"
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
  // On décrit le scénario : Quand je clique sur le bouton de refus
  describe('When I click on refuse button', () => {
    // On effectue le test : Je devrais être redirigé vers le tableau de bord avec l'icône "big billed" à la place du formulaire
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      // On simule le stockage local de l'utilisateur administrateur
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On remplit le corps du document HTML avec l'interface utilisateur du formulaire de note de frais en attente
      document.body.innerHTML = DashboardFormUI(bills[0])
      // On définit la fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On initialise le magasin à null (non utilisé dans ce test)
      const store = null
      // On crée une instance de Dashboard avec les informations nécessaires
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      // On récupère le bouton de refus
      const refuseButton = screen.getByTestId("btn-refuse-bill-d")
      // On définit une fonction de gestion de soumission pour le bouton de refus
      const handleRefuseSubmit = jest.fn((e) => dashboard.handleRefuseSubmit(e, bills[0]))
      refuseButton.addEventListener("click", handleRefuseSubmit)
      // On simule un clic sur le bouton de refus
      fireEvent.click(refuseButton)
      // On vérifie que la fonction de gestion de soumission a été appelée
      expect(handleRefuseSubmit).toHaveBeenCalled()
      // On vérifie la présence de l'icône "big billed"
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})
// On décrit le contexte : Étant connecté en tant qu'administrateur, sur la page du tableau de bord,
// et ayant cliqué sur une note de frais
describe('Given I am connected as Admin and I am on Dashboard page and I clicked on a bill', () => {
  // On décrit le scénario : Quand je clique sur l'icône de l'œil
  describe('When I click on the icon eye', () => {
    // On effectue le test : Une modale devrait s'ouvrir
    test('A modal should open', () => {
      // On simule le stockage local de l'utilisateur administrateur
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      // On remplit le corps du document HTML avec l'interface utilisateur du formulaire de note de frais
      document.body.innerHTML = DashboardFormUI(bills[0])
      // On définit la fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On initialise le magasin à null (non utilisé dans ce test)
      const store = null
      // On crée une instance de Dashboard avec les informations nécessaires
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      // On récupère la fonction de gestion de clic sur l'icône de l'œil
      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      // On récupère l'élément de l'icône de l'œil
      const eye = screen.getByTestId('icon-eye-d')
      // On ajoute un écouteur de clic sur l'icône de l'œil
      eye.addEventListener('click', handleClickIconEye)
      // On simule un clic sur l'icône de l'œil
      userEvent.click(eye)
      // On vérifie que la fonction de gestion de clic sur l'icône de l'œil a été appelée
      expect(handleClickIconEye).toHaveBeenCalled()
      // On vérifie la présence de la modale
      const modale = screen.getByTestId('modaleFileAdmin')
      expect(modale).toBeTruthy()
    })
  })
})

// test d'intégration GET
// On décrit le contexte : Étant connecté en tant qu'administrateur,
// quand je navigue vers la page du tableau de bord
describe("Given I am a user connected as Admin", () => {
  // On décrit le scénario : Quand je navigue vers la page du tableau de bord
  describe("When I navigate to Dashboard", () => {
    // On effectue le test : La récupération des notes de frais depuis la fausse API GET
    test("fetches bills from mock API GET", async () => {
      // On configure l'utilisateur administrateur dans le stockage local
      localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
      // On crée un élément div pour servir de racine à l'application
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      // On initialise le routeur de l'application
      router()
      // On déclenche la navigation vers la page du tableau de bord
      window.onNavigate(ROUTES_PATH.Dashboard)
      // On attend que le contenu de la page soit chargé
      await waitFor(() => screen.getByText("Validations"))
      // On vérifie la présence de certaines informations dans le contenu de la page
      const contentPending  = await screen.getByText("En attente (1)")
      expect(contentPending).toBeTruthy()
      const contentRefused  = await screen.getByText("Refusé (2)")
      expect(contentRefused).toBeTruthy()
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
    })
    // On décrit un autre scénario : Quand une erreur se produit dans l'API
  describe("When an error occurs on API", () => {
    // On effectue certaines opérations avant chaque test de ce groupe
    beforeEach(() => {
      // On espionne la méthode bills du mockStore
      jest.spyOn(mockStore, "bills")
      // On configure l'utilisateur administrateur dans le stockage local
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin',
        email: "a@a"
      }))
      // On crée un élément div pour servir de racine à l'application
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      // On initialise le routeur de l'application
      router()
    })
    // On effectue le test : La récupération des notes de frais depuis une API qui échoue avec un message d'erreur 404
    test("fetches bills from an API and fails with 404 message error", async () => {
      // On simule un échec de récupération des notes de frais depuis l'API
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
        // On déclenche la navigation vers la page du tableau de bord
      window.onNavigate(ROUTES_PATH.Dashboard)
      // On attend que le message d'erreur 404 soit affiché à l'écran
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    // On effectue le test : La récupération des notes de frais depuis une API qui échoue avec un message d'erreur 500
    test("fetches messages from an API and fails with 500 message error", async () => {
      // On simule un échec de récupération des notes de frais depuis l'API
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
        // On déclenche la navigation vers la page du tableau de bord
      window.onNavigate(ROUTES_PATH.Dashboard)
      // On attend que le message d'erreur 500 soit affiché à l'écran
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})

