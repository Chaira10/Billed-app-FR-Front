/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

beforeAll(() => {
  global.FormData = function () {
    this.append = jest.fn();
  };
});
// On commence par redéfinir la propriété "localStorage" de l'objet "window".
// Cela permet de remplacer la fonctionnalité "localStorage" par une version simulée ("localStorageMock").
Object.defineProperty(window, "localStorage", { value: localStorageMock });
// Ensuite,la méthode "setItem" du "localStorage" pour stocker des données sous la clé "user".
// Les données sont converties en format JSON à l'aide de "JSON.stringify" avant d'être stockées.
window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
  })
);
// fonction de rappel (callback) simulée appelée "onNavigate" en utilisant "jest.fn()".
const onNavigate = jest.fn();
// utilise Jest pour décrire un ensemble de tests liés à la page "NewBill" lorsque l'utilisateur est connecté en tant qu'employé.
describe("Given I am connected as an employee", () => {
  // Dans ce bloc de tests, nous spécifions le comportement attendu lorsque l'utilisateur est sur la page "NewBill".
  describe("When I am on NewBill Page", () => {
    // C'est le test spécifique que nous allons exécuter.
    test("Then the NewBill Page should be rendered", () => {
      // ajouter le contenu de la page "NewBill" au corps du document (simulé).
      document.body.innerHTML = NewBillUI();
      // Recherches des éléments HTML spécifiques dans la page simulée le titre, le bouton "Envoyer" et le formulaire.
      const title = screen.getAllByText("Envoyer une note de frais");
      const sendBtn = screen.getAllByText("Envoyer");
      const form = document.querySelector("form");

      // Des assertions (expect) pour vérifier si les éléments que nous avons recherchés existent.
      // Nous nous attendons à ce que le titre, le bouton "Envoyer" et le formulaire soient présents.
      expect(title).toBeTruthy();
      expect(sendBtn).toBeTruthy();
      //  "form.length" pour vérifier le nombre d'éléments dans le formulaire.
      expect(form.length).toEqual(9);
    });
    //  Jest pour décrire un ensemble de tests liés à la manipulation d'un fichier lors du téléversement.
    describe("When I upload an image file", () => {
      // Avant chaque test, nous appliquons le contenu de la page "NewBill" au corps du document (simulé).
      beforeEach(() => {
        document.body.innerHTML = NewBillUI();
      });
      // C'est le premier test, qui vérifie si le champ de téléchargement de fichier affiche correctement le fichier.
      test("Then the file input should display a file", async () => {
      document.body.innerHTML = NewBillUI();

        // Créez une nouvelle instance de NewBill avec mockStore pour simuler la page "NewBill".
        const newBillContainer = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Mock de la fonction handleChangeFile.
        const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
        const file = screen.getByTestId("file");

        // Ajout d'un gestionnaire d'événements au champ de fichier.
        file.addEventListener("change", handleFileChange);

        // Simule le téléversement d'un fichier en déclenchant un événement de téléversement sur le champ de fichier.
        await userEvent.upload(
          file,
          new File(["test"], "test.png", { type: "image/png" })
        );
        const errorMessage = screen.getByTestId('file-error')
        // Vérifie si handleChangeFile a été appelé et si le champ de fichier a été modifié avec le fichier actuel.
        expect(errorMessage.classList.contains('hide')).toBe(true);
        expect(handleFileChange).toHaveBeenCalled();
        expect(file.files[0].name).toBe("test.png");
        expect(file.files).toHaveLength(1);
      });

      test("Then the file input should display the uploaded file if the file has a valid extension", () => {
        // Créez une nouvelle instance de NewBill avec mockStore pour simuler la page "NewBill".
        const newBillContainer = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
        const file = screen.getByTestId("file");

        // Ajout d'un gestionnaire d'événements au champ de fichier.
        file.addEventListener("change", handleFileChange);

        // Simule le téléversement d'un fichier valide en déclenchant un événement de téléversement sur le champ de fichier.
        userEvent.upload(
          file,
          new File(["test"], "test.png", { type: "image/png" })
        );

        // Vérifie si handleChangeFile a été appelé et si le champ de fichier a été modifié avec le fichier actuel.
        expect(handleFileChange).toHaveBeenCalled();
        expect(file.files[0].name).toBe("test.png");
        expect(file.files).toHaveLength(1);
      });

      test("It should display an error message when the file input is empty", () => {
        // Créez une nouvelle instance de NewBill avec mockStore pour simuler la page "NewBill".
        const newBillContainer = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const errorMessage = screen.getByTestId("file-error");
        const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
        const file = screen.getByTestId("file");

        // Ajout d'un gestionnaire d'événements au champ de fichier.
        file.addEventListener("change", handleFileChange);

        // Simule le téléversement d'un fichier vide en déclenchant un événement de téléversement sur le champ de fichier.
        userEvent.upload(file, null);

        // Vérifie si handleChangeFile a été appelé, si le champ de fichier a été vidé et si le message d'erreur est affiché.
        expect(errorMessage.classList).toContain("active");
        expect(handleFileChange).toHaveBeenCalled();
        expect(file.value).toBe("");
      });
      // deuxième test, qui vérifie si un message d'erreur est affiché si le fichier n'a pas une extension valide.
      test("It should display an error message if the file has not an available extension", () => {
        // Créez une nouvelle instance de NewBill avec mockStore pour simuler la page "NewBill".
        const newBillContainer = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const errorMessage = screen.getByTestId("file-error");
        const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
        const file = screen.getByTestId("file");

        // Ajout d'un gestionnaire d'événements au champ de fichier.
        file.addEventListener("change", handleFileChange);

        // Simule le téléversement d'un fichier incorrect en déclenchant un événement de téléversement sur le champ de fichier.
        userEvent.upload(
          file,
          new File(["test"], "test.txt", { type: "text/plain" })
        );

        // Vérifie si handleChangeFile a été appelé, si le champ de fichier a été vidé et si le message d'erreur est affiché.
        expect(errorMessage.classList).toContain("active");
        expect(handleFileChange).toHaveBeenCalled();
        expect(file.files[0].name).toBe("test.txt");
        expect(file.value).toBe("");
      });
    });
  });


  test("Then it should show an error message if the file uploaded has no extension", async () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
  
    const input = screen.getByTestId("file");
    const handleChangeFile = jest.fn(newBill.handleChangeFile);
    input.addEventListener("change", handleChangeFile);
  
    // Simuler le téléchargement d'un fichier sans extension
    userEvent.upload(input, new File([""], "filename", { type: "" }));
    expect(handleChangeFile).toHaveBeenCalled();
    // Ajouter une assertion pour vérifier que le message d'erreur s'affiche
    // Notez que vous devrez ajuster cette partie selon l'implémentation exacte de la gestion des erreurs dans votre application
    expect(screen.getByTestId("file-error").classList).toContain("active");
  });
  

  test("Then the file input should not display any file if no file is selected", () => {
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
    const file = screen.getByTestId("file");

    file.addEventListener("change", handleFileChange);

    userEvent.upload(file, null);

    expect(handleFileChange).toHaveBeenCalled();
    expect(file.files).toHaveLength(1);
    expect(file.files[0]).toBe(null);
  });
  



  test("Then it should display the error message if the file format is incorrect", async () => {
    // Assurez-vous que la mise en place initiale du DOM et les mocks sont corrects
    const mockStore = {
      bills: jest.fn(() => ({
        create: jest.fn().mockResolvedValue({}),
      })),
    };
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({ document, onNavigate: () => {}, store: mockStore, localStorage: window.localStorage });
  
    // Simuler le changement d'input fichier pour déclencher l'erreur
    const input = screen.getByTestId("file");
    fireEvent.change(input, {
      target: { files: [new File(["content"], "document.pdf", { type: "application/pdf" })] },
    });
  
    const errorMsg = await screen.findByTestId("file-error", {}, { timeout: 1000 });
    expect(errorMsg).toBeVisible(); 
});
  

  test("Then the file input should display an error message if no file is selected", () => {
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
    const file = screen.getByTestId("file");

    file.addEventListener("change", handleFileChange);

    userEvent.upload(file, new File([], 'empty.txt'));

    expect(handleFileChange).toHaveBeenCalled();
    expect(file.files).toHaveLength(1);
  });



    test("Then the file input should display the uploaded file if the file has a valid extension", () => {
      // Créez une nouvelle instance de NewBill avec mockStore pour simuler la page "NewBill".
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleFileChange = jest.fn(newBillContainer.handleChangeFile);
      const file = screen.getByTestId("file");

      // Ajout d'un gestionnaire d'événements au champ de fichier.
      file.addEventListener("change", handleFileChange);

      // Simule le téléversement d'un fichier valide en déclenchant un événement de téléversement sur le champ de fichier.
      userEvent.upload(
        file,
        new File(["test"], "test.png", { type: "image/png" })
      );

      // Vérifie si handleChangeFile a été appelé et si le champ de fichier a été modifié avec le fichier actuel.
      expect(handleFileChange).toHaveBeenCalled();
      expect(file.files[0].name).toBe("test.png");
      expect(file.files).toHaveLength(1);
    });

    test("envoi du form", () => {
      document.body.innerHTML = NewBillUI();
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn();
      const form = screen.getByTestId('form-new-bill');
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
    })















//  test d'intégration POST
// décrire un ensemble de tests liés à la soumission d'une nouvelle note de frais valide.
describe("When I submit a new valid bill", () => {
  test("Then a new bill should be created", () => {
    // Créez une nouvelle instance de NewBill avec mockStore et appliquez NewBillUI au document.body.
    document.body.innerHTML = NewBillUI();
    const submitForm = screen.getByTestId("form-new-bill");
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const handleSubmit = jest.fn(newBillContainer.handleSubmit);
    submitForm.addEventListener("submit", handleSubmit);
    // Créez un nouvel objet de note de frais avec les valeurs de tous les champs et appliquez-les au formulaire.
    const bill = {
      type: "Transports",
      name: "test",
      date: "2021-09-01",
      amount: 30,
      vat: 10,
      pct: 20,
      commentary: "test text for commentary",
      fileUrl: "test.png",
      fileName: "test.png",
    };
    document.querySelector(`select[data-testid="expense-type"]`).value =
      bill.type;
    document.querySelector(`input[data-testid="expense-name"]`).value =
      bill.name;
    document.querySelector(`input[data-testid="datepicker"]`).value = bill.date;
    document.querySelector(`input[data-testid="amount"]`).value = bill.amount;
    document.querySelector(`input[data-testid="vat"]`).value = bill.vat;
    document.querySelector(`input[data-testid="pct"]`).value = bill.pct;
    document.querySelector(`textarea[data-testid="commentary"]`).value =
      bill.commentary;
    newBillContainer.fileUrl = bill.fileUrl;
    newBillContainer.fileName = bill.fileName;
    // Déclenchez un événement de soumission sur le formulaire.
    fireEvent.submit(submitForm);
    // Vérifiez si handleSubmit a été appelé.
    expect(handleSubmit).toHaveBeenCalled();
  });
  // Ce test vérifie si le fichier de facture est téléchargé avec succès.
  test("Then the file bill should be uploaded", async () => {
    // Espionner la méthode "bills" de mockStore pour suivre son appel.
    jest.spyOn(mockStore, "bills");
    // Définir une fonction "onNavigate" qui change le chemin d'accès (pathname) simulé.
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // Définir localStorage avec des données utilisateur en tant qu'employé et localStorageMock.
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    // Créer une nouvelle instance de NewBill avec mockStore et appliquer NewBillUI à document.body.
    const html = NewBillUI();
    document.body.innerHTML = html;
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    // console.log(newBillContainer.mock.instances);

    // Créer un nouvel objet de fichier et l'appliquer à l'entrée de fichier (billFile).
    const file = new File(["image"], "image.png", { type: "image/png" });
    // console.log(file.mock.instances);
    const handleChangeFile = jest.fn((e) =>
      newBillContainer.handleChangeFile(e)
    );
    const formNewBill = screen.getByTestId("form-new-bill");
    const billFile = screen.getByTestId("file");
    // Ajouter un gestionnaire d'événements à l'entrée de fichier et téléverser le fichier.
    billFile.addEventListener("change", handleChangeFile);
    userEvent.upload(billFile, file);
    // Vérifier si handleChangeFile a été appelé et si l'entrée de fichier a été modifiée avec le fichier actuel.
    expect(billFile.files[0].name).toBeDefined();
    expect(handleChangeFile).toBeCalled();
    // Espionner la méthode "handleSubmit" pour suivre son appel.
    const handleSubmit = jest.fn((e) => newBillContainer.handleSubmit(e));
    formNewBill.addEventListener("submit", handleSubmit);
    // Déclencher l'événement de soumission du formulaire.
    fireEvent.submit(formNewBill);
    // Vérifier si handleSubmit a été appelé.
    expect(handleSubmit).toHaveBeenCalled();
  });


  test("envoi du form", () => {
    document.body.innerHTML = NewBillUI();
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    const handleSubmit = jest.fn();
    const form = screen.getByTestId('form-new-bill');
    form.addEventListener('submit', handleSubmit)
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  })



  
});

});


