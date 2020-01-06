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
    cy.get('h3').should('contain', 'Joost Reijmer')
    cy.get('table').children('tr').eq(0).children('td').eq(1).should('contain', 'ICT.AFSTSE.D19')
    cy.get('table').children('tr').eq(1).children('td').eq(1).should('contain', 'In behandeling')
    cy.get('table').children('tr').eq(2).children('td').eq(1).should('contain', '')
    cy.get('table').children('tr').eq(3).children('td').eq(1).should('contain', 'Er is nog geen eindresultaat berekend')
    cy.get('.card-title.mb-3').eq(0).should('contain', '(BV0111996)')
    cy.get('.card-title.mb-3').eq(1).should('contain', 'Invulling door Douwe van der Meer (DM0067514)')
  })

  it("Should be able to open a form if it isn't finalized", function () {
    cy.get('button').contains('Open invulling').eq(0).should('be.disabled')
  })
  
  it("Should be able to open a summary if it is finalized", function () {
    cy.get('button').contains('Samenvatting inzien').eq(0).should('not.be.disabled')
  })

  it("Shouldn't be able to open a form if it is finalized", function () {
    cy.get('button').contains('Open invulling').eq(1).should('not.be.disabled')
  })

  it("Shouldn't be able to open a summary if it isn't finalized", function () {
    cy.get('button').eq(4).should('be.disabled')
  })

  it("Should show a pop up if finalize button is clicked", function () {
    cy.server()
    cy.route('POST', 'api/assessment/finalizemeta', { userId: 6, assessmentMetaId: "13", finalMark: "9.0" }).as('finalizeMeta')  
    const stub = cy.stub()
    cy.on('window:confirm', stub)
    cy
      .get('button').contains('Cijfer definitief maken').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Weet je zeker dat je de beoordeling definitief wilt maken? De beoordeling is hierna niet meer te wijzigen.")
      })
    cy.wait(['@finalizeMeta'])
  })

  it("Should show a message if assessment is successfully finalized", function () {
    cy.server({
      status: 200
    })
    cy.route('POST', 'api/assessment/finalizemeta', { userId: 6, assessmentMetaId: "13", finalMark: "9.0" }).as('finalizeMeta')    
    cy.get('button').contains('Cijfer definitief maken').click()      
    cy.wait(['@finalizeMeta'])
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Je beoordeling is definitief gemaakt')
  })

  it("Should show a message if assessment is not successfully finalized", function () {
    cy.server({
      status: 400
    })
    cy.route('POST', 'api/assessment/finalizemeta', { userId: 6, assessmentMetaId: "13", finalMark: "9.0" }).as('finalizeMeta')
    cy.get('button').contains('Cijfer definitief maken').click()
    cy.wait(['@finalizeMeta'])
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Er is iets misgegaan bij het afronden van de beoordeling')
  })
})
