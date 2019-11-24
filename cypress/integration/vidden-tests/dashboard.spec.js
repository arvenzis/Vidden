describe('Dashboard page', function () {
  before(function () {
      cy.login('s1019744@student.windesheim.nl', '12345')
  })

  after(function () {
    cy.logout()
    cy.get('label.alert.alert-success.col-md-6.offset-md-4')
      .should('be.visible')
      .and('contain', 'U bent uitgelogd.')
  })

  describe('Nieuw/bladeren/instellingen', function () {
    afterEach(function () {
      cy.go('back')
    })

    it('Nieuw: Should redirect to new assessment page', function () {
      cy.get('a').contains('NIEUW').click()
      cy.url().should('include', '/new-assessment')
    })

    it('Bladeren: Should redirect to browse page', function () {
      cy.get('a').contains('BLADEREN').click()
      cy.url().should('include', '/browse')
    })

    it('Instellingen: Should redirect to settings page', function () {
      cy.get('a').contains('INSTELLINGEN').click()
      cy.url().should('include', '/settings')
    })
  })
  
})
