describe('Summary page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openSummaryPage()
  })

  after(function () {
    cy.backToBrowsePage()
    cy.backToDashboardPage()
    cy.logout()
  })

  it('Should show "items loaded" message', function () {
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Items geladen')
  })

  it('Should show the chosen variables', function () {
    cy.get('h3').should('contain', 'ICT.AFSTSE.D19')
    cy.get('h3').should('contain', 'Bernard Bos')
    cy.get('table').children('tr').eq(0).children('td').eq(1).should('contain', 'ICT.AFSTSE.D19')
    cy.get('table').children('tr').eq(1).children('td').eq(1).should('contain', 'Nieuw')
    cy.get('table').children('tr').eq(2).children('td').eq(1).should('contain', '')
    cy.get('table').children('tr').eq(3).children('td').eq(1).should('contain', 'Er is nog geen eindresultaat berekend')
    cy.get('.card-title.mb-3').eq(0).should('contain', '(BV0111996)')
    cy.get('.card-title.mb-3').eq(1).should('contain', 'Invulling door Eugene van Roden (P69750694)')
  })
})
