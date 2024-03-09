import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

// Cette classe gère la création d'une nouvelle facture
export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document  // Stocke l'objet document
    this.onNavigate = onNavigate // Stocke la fonction de navigation
    this.store = store // Stocke le magasin de données
    // Récupère le formulaire de création de facture et ajoute un écouteur d'événement "submit"
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    // Récupère l'élément d'entrée de type fichier et ajoute un écouteur d'événement "change"
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    file.addEventListener("change", (e) => {
      const errorMessage = document.querySelector(
        ".form-newbill-container span.error"
      );
      // const fileInput = document.querySelector(`input[data-testid="file"]`);
      // const availableExtension = /.+jpeg$|.+jpg$|.+png$/i;
      // const filePath = e.target.value.split(/\\/g);
      // const fileName = filePath[filePath.length - 1];
      // if (!availableExtension.test(fileName)) {
      //   errorMessage.classList.add("active");
      //   fileInput.value = null;
      // } else {
      //   errorMessage.classList.remove("active");
      //   this.handleChangeFile(e);
      // }
    });

    this.fileUrl = null // Initialise l'URL du fichier à null
    this.fileName = null // Initialise le nom du fichier à null
    this.billId = null // Initialise l'identifiant de la facture à null
    new Logout({ document, localStorage, onNavigate })  // Initialise la classe Logout
  }

  // Gestionnaire d'événement pour le changement de fichier
  handleChangeFile = e => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];
    const validExtensions = ['.jpeg', '.jpg', '.png'];
  
    if (!file) {
      // Cas où aucun fichier n'est sélectionné
      const errorMsg = this.document.querySelector(`span[data-testid="file-errors"]`);
      const errorMessage = document.querySelector('span[data-testid="file-error"]');
      errorMessage.classList.add("active");
      errorMessage.style.display = "none";
      errorMsg.style.display = "block";
      fileInput.value = null;
      console.log(fileInput)
    } else {
      // Cas où un fichier est sélectionné
      const filePath = e.target.value.split(/\\/g);
      const fileName = filePath[filePath.length - 1];
      const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
      if (!validExtensions.includes(fileExtension)) {
        // Cas où l'extension du fichier est incorrecte
        const errorMsg = this.document.querySelector(`span[data-testid="file-errors"]`);
        const errorMessage = document.querySelector('span[data-testid="file-error"]');
        errorMessage.classList.add("active");
        errorMessage.style.display = "block";

        errorMsg.style.display = "none";
        fileInput.value = null;
        console.log(fileInput)
      } else {
        const errorMessage = document.querySelector('span[data-testid="file-error"]');
        const errorMsg = document.querySelector(`span[data-testid="file-errors"]`);

        // Cas où le fichier est valide, procédez avec la soumission du fichier
        errorMessage.style.display = "none";
        errorMsg.style.display = "none";

        const formData = new FormData();
        const email = JSON.parse(localStorage.getItem("user")).email;
        formData.append('file', file);
        formData.append('email', email);
  
        this.store
          .bills()
          .create({
            data: formData,
            headers: {
              noContentType: true
            }
          })
          /* istanbul ignore next */ 
          .then(({ fileUrl, key }) => {
            // console.log(fileUrl);
            /* istanbul ignore next */ 
            this.billId = key;
            /* istanbul ignore next */ 
            this.fileUrl = fileUrl;
            /* istanbul ignore next */ 
            this.fileName = fileName;
          })
          /* istanbul ignore next */ 
          .catch(error => console.error(error));
      }
    }
  }


  // Gère la soumission du formulaire de création de facture
  handleSubmit = e => {
    e.preventDefault()  // Empêche le comportement par défaut du formulaire
    // const expenseTypeInput = document.querySelector('select[data-testid="expense-type"]');
    const expenseNameInput = document.querySelector('input[data-testid="expense-name"]');
    const datepickerInput = document.querySelector('input[data-testid="datepicker"]');
    const amountInput = document.querySelector('input[data-testid="amount"]');
    const vatInput = document.querySelector('input[data-testid="vat"]');
    const pctInput = document.querySelector('input[data-testid="pct"]');
    const fileInputs = document.querySelector('input[data-testid="file"]');
    const commentaryInput = document.querySelector('textarea[data-testid="commentary"]');
  
    // const expenseTypeError = document.querySelector('span[data-testid="expenseType-error"]');
    const expenseNameError = document.querySelector('span[data-testid="expense-name-error"]');
    const datepickerError = document.querySelector('span[data-testid="datepicker-error"]');
    const amountError = document.querySelector('span[data-testid="amount-error"]');
    const vatError = document.querySelector('span[data-testid="vat-error"]');
    const pctError = document.querySelector('span[data-testid="pct-error"]');
    const fileError = document.querySelector('span[data-testid="file-errors"]');
    const commentaryError = document.querySelector('span[data-testid="commentary-error"]');
  
    let isValid = true;
  
    // Validation du champ de nom de dépense
    if (expenseNameInput) {
    if (expenseNameInput.value === "") {
      // expenseNameError.innerHTML = "";
      expenseNameError.style.display = "block";
      expenseNameError.classList.add('active')
      isValid = false;
    } else {
      expenseNameError.textContent = "";
      expenseNameError.classList.add('hide')

    }


    expenseNameInput.addEventListener('input', () => {
      if (expenseNameInput.value !== "") {
        expenseNameError.style.display = "none";
        expenseNameError.textContent = "";
      }
    });
  } else {
    // console.log('Expense name input element not found.');
  }

  if (datepickerInput) {
    if (datepickerInput.value === "") {
      datepickerError.style.display = "block";
      datepickerError.classList.add('active')
      isValid = false;
    } else {
      datepickerError.textContent = "";
      datepickerError.classList.add('hide')
    }

    datepickerInput.addEventListener('input', () => {
      if (datepickerInput.value !== "") {
        datepickerError.style.display = "none";
        datepickerError.textContent = "";
      }
    });
  } else {
    // console.log('date input element not found.');
  }

  if (amountInput) {
    if (amountInput.value === "") {
      amountError.style.display = "block";
      amountError.classList.add('active')
      isValid = false;
    } else {
      amountError.textContent = "";
      amountError.classList.add('hide')
    }

    amountInput.addEventListener('input', () => {
      if (amountInput.value !== "") {
        amountError.style.display = "none";
        amountError.textContent = "";
      }
    });
  } else {
    // console.log('amountInput element not found.');
  }

  if (vatInput) {
    if (vatInput.value === "") {
      vatError.style.display = "block";
      vatError.classList.add('active')
      isValid = false;
    } else {
      vatError.textContent = "";
      vatError.classList.add('hide')
    }

    vatInput.addEventListener('input', () => {
      if (vatInput.value !== "") {
        vatError.style.display = "none";
        vatError.textContent = "";
      }
    });
  } else {
    // console.log('vatInput element not found.');
  }

  if (pctInput) {
    if (pctInput.value === "") {
      pctError.style.display = "block";
      pctError.classList.add('active')
      isValid = false;
    } else {
      pctError.textContent = "";
      pctError.classList.add('hide')
    }

    pctInput.addEventListener('input', () => {
      if (pctInput.value !== "") {
        pctError.style.display = "none";
        pctError.textContent = "";
      }
    });
  } else {
    // console.log('pctInput element not found.');
  }

  if (commentaryInput) {
    if (commentaryInput.value === "") {
      commentaryError.style.display = "block";
      commentaryError.classList.add('active')
      isValid = false;
    } else {
      commentaryError.textContent = "";
      commentaryError.classList.add('hide')
    }

    commentaryInput.addEventListener('input', () => {
      if (commentaryInput.value !== "") {
        commentaryError.style.display = "none";
        commentaryError.textContent = "";
      }
    });
  } else {
    // console.log('commentaryInput element not found.');
  }

    // console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const errorMessage = document.querySelector(`span[data-testid="file-error"]`);
    const errorMsg = this.document.querySelector(`span[data-testid="file-errors"]`);
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    if (fileInput) {
    const file = fileInput.files[0];
    if (!file) {
      errorMsg.classList.add("active");
      errorMsg.style.display = "block";
      errorMessage.style.display = "none";
      return;
    } else {
      errorMsg.classList.remove("active");
      errorMsg.style.display = "none";
      // errorMessage.style.display = "block";
    }
  } else {
    // console.log('File input element not found.');
  }
    // Récupère l'adresse e-mail de l'utilisateur connecté depuis localStorage
    const email = JSON.parse(localStorage.getItem("user")).email
    // Construit un objet "bill" avec les données du formulaire
    const bill = {
      email,  // Adresse e-mail de l'utilisateur
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value, // Type de dépense sélectionné
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value, // Nom de la dépense
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value), // Montant de la dépense (converti en entier)
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value, // Date de la dépense
      vat: e.target.querySelector(`input[data-testid="vat"]`).value, // Valeur de la TVA
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20, // Pourcentage (par défaut à 20% si non fourni)
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value, // Commentaires
      fileUrl: this.fileUrl, // URL du fichier joint (si disponible)
      fileName: this.fileName, // Nom du fichier joint (si disponible)
      status: 'pending' // Statut initial de la facture (en attente)
    }
    // Appelle la méthode pour mettre à jour la facture avec les données fournies
    this.updateBill(bill)
    // Navigue vers la page des factures après la soumission du formulaire
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  // Met à jour une facture avec les nouvelles données fournies
  updateBill = (bill) => {
    if (this.store) { // Vérifie si le magasin de données est disponible
       // Appelle la méthode de mise à jour des factures dans le magasin
      this.store
      .bills() // Accède à la collection de factures dans le magasin
      .update({data: JSON.stringify(bill),  // Les nouvelles données de la facture au format JSON
        selector: this.billId}) // Sélecteur pour cibler la facture à mettre à jour par son identifiant (this.billId)
      .then(() => {
        // Après la mise à jour réussie, navigue vers la page des factures
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error)) // Gère les erreurs en les affichant dans la console
    }
  }
}