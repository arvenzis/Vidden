describe('Dashboard page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.get('a').contains('Instellingen').click()
  })

  after(function () {
    cy.go('back')
    cy.logout()
  })

  it('Settings: Should display a terms or numbers switch and a language switch', function () {
    cy.get('label[for*="termsOrNumbersSwitch"]').should('contain', 'Beoordeling geven in cijfers')
    cy.get('label[for*="langSwitch"]').should('contain', 'Selecteer je voorkeurstaal')
  })

  it('Settings: Should display message when grading in words toggle is clicked', function () {
    cy.server({
      status: 200
    })
    cy.route('PUT', 'api/userpreference/putshowgradinginwords/6/true', {}).as('getTermsOrNumbersSwitch')
    cy.get('label[for*="termsOrNumbersSwitch"]').click()
    cy.wait('@getTermsOrNumbersSwitch')
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Voorkeur opgeslagen')
  })

  it('Settings: Should display everything in English when set to English', function () {
    cy.server({
      status: 200
    })
    cy.route('PUT', 'api/userpreference/putlanguagepreference/6/en_US', {}).as('getLanguagePreferenceEN')
    cy.route('PUT', 'api/userpreference/putlanguagepreference/6/nl_NL', {}).as('getLanguagePreferenceNL')
    cy.get('.form-control').select('🇺🇸 Engels')
    cy.wait('@getLanguagePreferenceEN')
    cy.get('label[for*="termsOrNumbersSwitch"]').should('contain', 'Grade assessment with numbers')
    cy.get('label[for*="langSwitch"]').should('contain', 'Please select your preferred language')

    // undo switch
    cy.get('.form-control').select('🇳🇱 Dutch')
    cy.wait('@getLanguagePreferenceNL')
  })
})
