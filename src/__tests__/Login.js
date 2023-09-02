/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

// Description du scénario de test avec le contexte "Étant donné que je suis un utilisateur sur la page de connexion"
describe("Given that I am a user on login page", () => {
  // Description d'une action spécifique dans le scénario de test
  describe("When I do not fill fields and I click on employee button Login In", () => {
    // Test spécifique à exécuter
    test("Then It should renders Login page", () => {
      // Configuration de l'environnement de test avec le contenu de la page de connexion
      document.body.innerHTML = LoginUI();
      // Obtention de la référence à l'élément d'entrée pour l'adresse e-mail de l'employé
      const inputEmailUser = screen.getByTestId("employee-email-input");
      // Vérification que la valeur de l'entrée est vide
      expect(inputEmailUser.value).toBe("");
      // Obtention de la référence à l'élément d'entrée pour le mot de passe de l'employé
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      // Vérification que la valeur de l'entrée est vide
      expect(inputPasswordUser.value).toBe("");
      // Obtention de la référence au formulaire d'employé
      const form = screen.getByTestId("form-employee");
      // Définition d'une fonction de gestionnaire de soumission de formulaire simulée
      const handleSubmit = jest.fn((e) => e.preventDefault());
      // Ajout de l'écouteur de soumission au formulaire
      form.addEventListener("submit", handleSubmit);
      // Déclenchement de l'événement de soumission du formulaire
      fireEvent.submit(form);
      // Vérification que le formulaire d'employé est toujours présent sur la page
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Description du scénario de test avec le contexte "Étant donné que je suis un utilisateur sur la page de connexion"
  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    // Description d'une action spécifique dans le scénario de test
    test("Then It should renders Login page", () => {
      // Configuration de l'environnement de test avec le contenu de la page de connexion
      document.body.innerHTML = LoginUI();
      // Obtention de la référence à l'élément d'entrée pour l'adresse e-mail de l'employé
      const inputEmailUser = screen.getByTestId("employee-email-input");
      // Modification simulée de la valeur de l'entrée d'adresse e-mail avec un format incorrect
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      // Vérification que la nouvelle valeur de l'entrée est correctement mise à jour
      expect(inputEmailUser.value).toBe("pasunemail");

      // Obtention de la référence à l'élément d'entrée pour le mot de passe de l'employé
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      // Modification simulée de la valeur de l'entrée de mot de passe avec un format incorrect
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      // Vérification que la nouvelle valeur de l'entrée est correctement mise à jour
      expect(inputPasswordUser.value).toBe("azerty");

      // Obtention de la référence au formulaire d'employé
      const form = screen.getByTestId("form-employee");
      // Définition d'une fonction de gestionnaire de soumission de formulaire simulée
      const handleSubmit = jest.fn((e) => e.preventDefault());
      // Ajout de l'écouteur de soumission au formulaire
      form.addEventListener("submit", handleSubmit);
      // Déclenchement de l'événement de soumission du formulaire
      fireEvent.submit(form);
      // Vérification que le formulaire d'employé est toujours présent sur la page
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Description du scénario de test avec le contexte "Étant donné que je suis un utilisateur sur la page de connexion"
  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    // Test spécifique à exécuter
    test("Then I should be identified as an Employee in app", () => {
      // Configuration de l'environnement de test avec le contenu de la page de connexion
      document.body.innerHTML = LoginUI();
      // Données d'entrée simulées (adresse e-mail et mot de passe)
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };
      // Obtention de la référence à l'élément d'entrée pour l'adresse e-mail de l'employé
      const inputEmailUser = screen.getByTestId("employee-email-input");
      // Modification simulée de la valeur de l'entrée d'adresse e-mail avec les données d'entrée
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      // Vérification que la nouvelle valeur de l'entrée est correctement mise à jour
      expect(inputEmailUser.value).toBe(inputData.email);

      // Obtention de la référence à l'élément d'entrée pour le mot de passe de l'employé
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      // Modification simulée de la valeur de l'entrée de mot de passe avec les données d'entrée
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      // Vérification que la nouvelle valeur de l'entrée est correctement mise à jour
      expect(inputPasswordUser.value).toBe(inputData.password);
      // Obtention de la référence au formulaire d'employé
      const form = screen.getByTestId("form-employee");

      // localStorage should be populated with form data
      // Mock de la méthode localStorage pour simuler le stockage de données
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
       // Mock de la méthode onNavigate pour simuler la navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Déclaration d'une variable pour stocker la précédente localisation (page)
      let PREVIOUS_LOCATION = "";
      // Mock de la méthode store pour simuler le comportement d'une fonction
      const store = jest.fn();
      // Création d'une instance de la classe Login avec des paramètres
      const login = new Login({
        // Passage de l'objet "document" en tant que paramètre pour accéder au DOM
        document,
        // Passage de l'objet "localStorage" global de la fenêtre pour simuler le stockage local
        localStorage: window.localStorage,
        // Passage d'une fonction "onNavigate" pour gérer la navigation
        onNavigate,
        // Passage de la variable "PREVIOUS_LOCATION" pour suivre la localisation précédente (non modifiée ici)
        PREVIOUS_LOCATION,
        // Passage de la fonction "store" pour simuler une interaction avec le store
        store,
      });

      // Mock de la méthode "handleSubmitEmployee" de l'instance "login"
      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      // Mock de la méthode "login" pour simuler une résolution réussie
      login.login = jest.fn().mockResolvedValue({});
      // Ajout d'un écouteur d'événement de soumission au formulaire
      form.addEventListener("submit", handleSubmit);
      // Simulation d'un événement de soumission sur le formulaire
      fireEvent.submit(form);
      // Vérification que la méthode "handleSubmitEmployee" a été appelée
      expect(handleSubmit).toHaveBeenCalled();
      // Vérification que la méthode "localStorage.setItem" a été appelée
      expect(window.localStorage.setItem).toHaveBeenCalled();
      // Vérification que la méthode "localStorage.setItem" a été appelée avec des arguments spécifiques
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",  // La clé "user" est attendue comme premier argument
        JSON.stringify({ // On convertit l'objet JavaScript en chaîne JSON pour le deuxième argument
          type: "Employee", // Type d'utilisateur (employé)
          email: inputData.email, // Adresse e-mail saisie dans le formulaire
          password: inputData.password, // Mot de passe saisi dans le formulaire
          status: "connected", // Statut de connexion ("connected" pour connecté)
        })
      );
    });

    // On teste si l'élément contenant le texte "Mes notes de frais" est rendu à l'écran
    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });

  });

});
describe("Login Page - Employee Login", () => {
test("When I enter incorrect email and password, the form should not submit", () => {
  document.body.innerHTML = LoginUI();
  const inputEmailUser = screen.getByTestId("employee-email-input");
  const inputPasswordUser = screen.getByTestId("employee-password-input");
  const form = screen.getByTestId("form-employee");
  const handleSubmit = jest.fn((e) => e.preventDefault());
  form.addEventListener("submit", handleSubmit);

  fireEvent.change(inputEmailUser, { target: { value: "incorrectemail" } });
  fireEvent.change(inputPasswordUser, { target: { value: "incorrectpassword" } });

  fireEvent.submit(form);

  expect(handleSubmit).toHaveBeenCalled();
  expect(inputEmailUser.value).toBe("incorrectemail");
  expect(inputPasswordUser.value).toBe("incorrectpassword");
});
});
// On décrit le contexte : un utilisateur sur la page de connexion
describe("Given that I am a user on login page", () => {
  // On décrit le scénario : lorsque je ne remplis pas les champs et que je clique sur le bouton de connexion administrateur
  describe("When I do not fill fields and I click on admin button Login In", () => {
    // On effectue le test : alors la page de connexion devrait être rendue
    test("Then It should renders Login page", () => {
      // On simule la page de connexion
      document.body.innerHTML = LoginUI();
      // On récupère l'élément input correspondant à l'email administrateur
      const inputEmailUser = screen.getByTestId("admin-email-input");
      // On vérifie que la valeur de l'email est vide
      expect(inputEmailUser.value).toBe("");
      // On récupère l'élément input correspondant au mot de passe administrateur
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      // On vérifie que la valeur du mot de passe est vide
      expect(inputPasswordUser.value).toBe("");
      // On récupère le formulaire correspondant à la connexion administrateur
      const form = screen.getByTestId("form-admin");
      // On crée une fonction pour gérer la soumission du formulaire (on empêche la soumission réelle)
      const handleSubmit = jest.fn((e) => e.preventDefault());
      // On ajoute l'événement de soumission au formulaire avec la fonction de gestion
      form.addEventListener("submit", handleSubmit);
      // On déclenche l'événement de soumission
      fireEvent.submit(form);
      // On vérifie que le formulaire administrateur est toujours rendu à l'écran
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  // On décrit le contexte : un utilisateur sur la page de connexion
  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
     // On effectue le test : alors la page de connexion devrait être rendue
    test("Then it should renders Login page", () => {
      // On simule la page de connexion
      document.body.innerHTML = LoginUI();
      // On récupère l'élément input correspondant à l'email administrateur
      const inputEmailUser = screen.getByTestId("admin-email-input");
      // On déclenche un événement de changement sur l'input d'email avec une valeur incorrecte
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      // On vérifie que la valeur de l'email a bien été mise à jour
      expect(inputEmailUser.value).toBe("pasunemail");
      // On récupère l'élément input correspondant au mot de passe administrateur
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      // On déclenche un événement de changement sur l'input de mot de passe avec une valeur incorrecte
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      // On vérifie que la valeur du mot de passe a bien été mise à jour
      expect(inputPasswordUser.value).toBe("azerty");
      // On récupère le formulaire correspondant à la connexion administrateur
      const form = screen.getByTestId("form-admin");
      // On crée une fonction pour gérer la soumission du formulaire (on empêche la soumission réelle)
      const handleSubmit = jest.fn((e) => e.preventDefault());
      // On ajoute l'événement de soumission au formulaire avec la fonction de gestion
      form.addEventListener("submit", handleSubmit);
      // On déclenche l'événement de soumission
      fireEvent.submit(form);
      // On vérifie que le formulaire administrateur est toujours rendu à l'écran
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  // On décrit le scénario : lorsque je remplis les champs avec un format correct et que je clique sur le bouton de connexion administrateur
  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
     // On effectue le test : alors je devrais être identifié en tant qu'administrateur RH dans l'application
    test("Then I should be identified as an HR admin in app", () => {
      // On simule la page de connexion
      document.body.innerHTML = LoginUI();
      // Les données d'entrée simulées pour le test
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };
      // On récupère l'élément input correspondant à l'email administrateur
      const inputEmailUser = screen.getByTestId("admin-email-input");
      // On déclenche un événement de changement sur l'input d'email avec une valeur correcte
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      // On vérifie que la valeur de l'email a bien été mise à jour
      expect(inputEmailUser.value).toBe(inputData.email);
      // On récupère l'élément input correspondant au mot de passe administrateur
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      // On déclenche un événement de changement sur l'input de mot de passe avec une valeur correcte
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      // On vérifie que la valeur du mot de passe a bien été mise à jour
      expect(inputPasswordUser.value).toBe(inputData.password);
      // On récupère le formulaire correspondant à la connexion administrateur
      const form = screen.getByTestId("form-admin");

      // localStorage should be populated with form data
      // On simule le stockage local en le définissant avec des méthodes fictives
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      // On simule la navigation en définissant une fonction pour le test
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // On définit une variable pour stocker la localisation précédente
      let PREVIOUS_LOCATION = "";
      // On simule un magasin fictif pour les tests
      const store = jest.fn();
       // On crée une instance de la classe Login pour le test
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
      // On crée une fonction de soumission fictive pour le test
      const handleSubmit = jest.fn(login.handleSubmitAdmin);
      // On simule la résolution réussie de la méthode de connexion fictive
      login.login = jest.fn().mockResolvedValue({});
      // On ajoute l'événement de soumission au formulaire avec la fonction de gestion
      form.addEventListener("submit", handleSubmit);
      // On déclenche l'événement de soumission
      fireEvent.submit(form);
      // On vérifie que la fonction de soumission a été appelée
      expect(handleSubmit).toHaveBeenCalled();
      // On vérifie que la méthode setItem du stockage local a été appelée
      expect(window.localStorage.setItem).toHaveBeenCalled();
      // On vérifie que la méthode setItem du stockage local a été appelée avec les données d'entrée correctes
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
    // On effectue un autre test : il devrait afficher la page du tableau de bord RH
    test("It should renders HR dashboard page", () => {
      // On vérifie que le texte "Validations" est présent dans la page du tableau de bord
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  });

  describe("Login Page - Admin Login", () => {
    
});
});

