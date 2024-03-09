import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill" novalidate>
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Type de dépense</label>
                      <select required class="form-control blue-border" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                      <span class="error" data-testid="expenseType-error"></span>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres" />
                    <span class="error" data-testid="expense-name-error">Le champ Nom de la dépense est obligatoire.</span>
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input required type="date" class="form-control blue-border" data-testid="datepicker" />
                    <span class="error" data-testid="datepicker-error">Le champ Date est obligatoire.</span>
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <input required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                    <span class="error" data-testid="amount-error">Le champ Montant TTC est obligatoire.</span>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <input type="number" class="form-control blue-border" data-testid="vat" placeholder="70" />
                      <span class="error" data-testid="vat-error">Le champ TVA est obligatoire.</span>
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="white-text">%</label>
                      <input required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                      <span class="error" data-testid="pct-error">Le champ % est obligatoire.</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                    <span class="error" data-testid="commentary-error">Le champ commentaire est obligatoire</span>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Justificatif</label>
                    <input required type="file" class="form-control blue-border" data-testid="file" />
                    <span class="error hide" data-testid="file-error"  >Veuillez choisir un fichier avec les extensions suivantes : .jpeg, .jpg, .png</span>
                    <span class="error hide" data-testid="file-errors" >Veuillez sélectionner un fichier</span>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}