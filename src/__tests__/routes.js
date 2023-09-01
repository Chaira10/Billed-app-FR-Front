/**
 * @jest-environment jsdom
 */

import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { screen } from "@testing-library/dom";

const data = [];
const loading = false;
const error = null;

// On décrit le contexte : Étant connecté et étant sur une page de l'application
describe("Given I am connected and I am on some page of the app", () => {
  // On décrit le scénario : Quand je navigue vers la page de connexion
  describe("When I navigate to Login page", () => {
    // On effectue le test : La page de connexion devrait être rendue
    test("Then, it should render Login page", () => {
      // On définit le chemin d'accès à la page de connexion
      const pathname = ROUTES_PATH["Login"];
      // On génère le HTML de la page avec le chemin d'accès, les données, le chargement et l'erreur spécifiés
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      // On insère le HTML dans le corps du document
      document.body.innerHTML = html;
      // On vérifie la présence de certaines informations dans le contenu de la page
      expect(screen.getAllByText("Administration")).toBeTruthy();
    });
  });
  // On décrit le scénario : Quand je navigue vers la page des notes de frais
  describe("When I navigate to Bills page", () => {
    // On effectue le test : La page des notes de frais devrait être rendue
    test("Then, it should render Bills page", () => {
      // On définit le chemin d'accès à la page des notes de frais
      const pathname = ROUTES_PATH["Bills"];
      // On génère le HTML de la page avec le chemin d'accès, les données, le chargement et l'erreur spécifiés
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      // On insère le HTML dans le corps du document
      document.body.innerHTML = html;
      // On vérifie la présence de certaines informations dans le contenu de la page
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
  // On décrit le scénario : Quand je navigue vers la page de création de nouvelle note de frais
  describe("When I navigate to NewBill page", () => {
    // On effectue le test : La page de création de nouvelle note de frais devrait être rendue
    test("Then, it should render NewBill page", () => {
      // On définit le chemin d'accès à la page de création de nouvelle note de frais
      const pathname = ROUTES_PATH["NewBill"];
      // On génère le HTML de la page avec le chemin d'accès, les données, le chargement et l'erreur spécifiés
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      // On insère le HTML dans le corps du document
      document.body.innerHTML = html;
      // On vérifie la présence de certaines informations dans le contenu de la page
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
  // On décrit le scénario : Quand je navigue vers la page du tableau de bord
  describe("When I navigate to Dashboard", () => {
    // On effectue le test : La page du tableau de bord devrait être rendue
    test("Then, it should render Dashboard page", () => {
      // On définit le chemin d'accès à la page du tableau de bord
      const pathname = ROUTES_PATH["Dashboard"];
      // On génère le HTML de la page avec le chemin d'accès, les données, le chargement et l'erreur spécifiés
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      // On insère le HTML dans le corps du document
      document.body.innerHTML = html;
      // On vérifie la présence de certaines informations dans le contenu de la page
      expect(screen.getAllByText("Validations")).toBeTruthy();
    });
  });
  // On décrit un autre scénario : Quand je navigue vers n'importe quelle autre page que Login, Bills, NewBill, Dashboard
  describe("When I navigate to anywhere else other than Login, Bills, NewBill, Dashboard", () => {
    // On effectue le test : La page de connexion devrait être rendue
    test("Then, it should render Loginpage", () => {
      // On définit un chemin d'accès autre que ceux spécifiés
      const pathname = "/anywhere-else";
      // On génère le HTML de la page avec le chemin d'accès, les données, le chargement et l'erreur spécifiés
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      // On insère le HTML dans le corps du document
      document.body.innerHTML = html;
      // On vérifie la présence de certaines informations dans le contenu de la page
      expect(screen.getAllByText("Administration")).toBeTruthy();
    });
  });
});
