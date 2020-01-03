describe('Dashboard page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
  })

  after(function () {
    cy.logout()
    cy.get('.flash__message-content')
      .should('be.visible')
      .and('contain', 'Je bent uitgelogd')
  })

  describe('Nieuw/bladeren/instellingen', function () {
    afterEach(function () {
      cy.go('back')
    })

    it('Nieuw: Should redirect to new assessment page', function () {
      cy.openNewAssessmentPage()
      cy.url().should('include', '/new-assessment')
    })

    it('Bladeren: Should redirect to browse page', function () {
      cy.openBrowsePage()
      cy.url().should('include', '/browse')
    })

    it('Instellingen: Should redirect to settings page', function () {
      cy.get('a').contains('Instellingen').click()
      cy.url().should('include', '/settings')
    })
  })
})
