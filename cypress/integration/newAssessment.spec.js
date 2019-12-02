describe('New assessment page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openNewAssessmentPage()
  })

  after(function () {
    cy.backToBrowsePage()
    cy.backToDashboardPage()
    cy.logout()
  })

  it('Should show a warning if meta-data is missing', function () {
    // new assessment: fill in first page
    cy.get('.form-group').contains('Soort beoordeling').parent().click()
    cy.get('.form-group').contains('HBOICT Beoordelingsformulier stage- en afstudeerproject 2019-2020').click()
    cy.get('.form-group').contains('Student').parent().click()
    cy.get('.form-group').contains('Joost Reijmer').click()
    cy.get('.form-group').contains('Onderwijseenheid').parent().click()
    cy.get('.form-group').contains('Afstudeeropdracht Software Engineering 2019-2020').click()
    cy.get('a').contains('Volgende').click()

    // new assessment: fill in second page
    cy.get('#start-date').type('2019-02-01')
    cy.get('#end-date').type('2019-03-02')
    cy.get('#company').type('Hogeschool Windesheim')
    cy.get('a').contains('Volgende').click() // no address administered
    cy.get('.alert.alert-danger').should('contain', 'Niet alle gegevens zijn ingevuld.')
  })

  it('Should show a warning if start date is after end date', function () {
    cy.get('#address').type('Campus 5, 8017 CB Zwolle ')
    cy.get('#start-date').type('2019-04-01') // start date after end date
    cy.get('a').contains('Volgende').click()
    cy.get('.alert.alert-danger').should('contain', 'De begindatum mag niet na de einddatum liggen.')
  })

  it('Should show summary page before confirming new assessment', function () {
    cy.get('#start-date').type('2019-02-01')
    cy.get('a').contains('Volgende').click()
    cy.get('h2').should('contain', 'Overzicht beoordeling')
    cy.get('strong').first().should('contain', 'Joost Reijmer (s1120128)')
    cy.get('.wizard__body__step>div>span').eq(0).should('contain', '2019-02-01 - 2019-03-02')
    cy.get('.wizard__body__step>div>span').eq(1).should('contain', 'Hogeschool Windesheim')
    cy.get('.wizard__body__step>div>span').eq(2).should('contain', 'Campus 5, 8017 CB Zwolle')
  })

  it('Should show a flash message after confirming new assessment', function () {
    cy.confirmNewAssessment()
    cy.get('.flash__message-content').should('contain', 'Je beoordeling is succesvol aangemaakt')
  })
})
