// On importe les icônes SVG depuis les fichiers
import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

// On exporte une fonction qui génère un bouton d'action avec l'icône d'œil et l'URL de la facture
export default (billUrl) => {
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`
  )
}