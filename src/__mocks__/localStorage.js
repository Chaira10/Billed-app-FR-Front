// On exporte un objet qui simule le comportement de l'objet localStorage
export const localStorageMock = (function() {
  let store = {}; // On crée un espace de stockage simulé
  // On définit la méthode getItem pour obtenir une valeur en fonction de la clé
  return {
    getItem: function(key) {
      return JSON.stringify(store[key]) // On renvoie la valeur associée à la clé sous forme de chaîne JSON
    },
    // On définit la méthode setItem pour définir une valeur en fonction de la clé
    setItem: function(key, value) {
      store[key] = value.toString()// On stocke la valeur convertie en chaîne dans l'espace de stockage simulé
    },
    // On définit la méthode clear pour effacer toutes les données de l'espace de stockage simulé
    clear: function() {
      store = {} // On réinitialise l'espace de stockage simulé
    },
    // On définit la méthode removeItem pour supprimer une valeur en fonction de la clé
    removeItem: function(key) {
      delete store[key] // On supprime la clé et sa valeur associée de l'espace de stockage simulé
    }
  }
})()