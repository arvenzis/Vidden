describe('Assessment editing page', function () {
  before(function () {    
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openEditAssessmentPage()
  })

  after(function () {
    cy.backToSummaryPage()
    cy.backToBrowsePage()
    cy.backToDashboardPage()
    cy.logout()
  })

  it('Should show "items loaded" message', function () {
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Items geladen')
  })

  it('Should show the first question answered with Excellent', function () {
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#excellent').should('have.class', 'assessment__answer excellent excellent--active')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#good').should('have.class', 'assessment__answer good good')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#proficient').should('have.class', 'assessment__answer proficient proficient')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').should('have.class', 'assessment__answer poor poor')
  })

  it('Should show "answer saved" message if Good is clicked', function () {
    cy.chooseAnswer('good')
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Antwoord opgeslagen')

    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#excellent').should('have.class', 'assessment__answer excellent excellent')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#good').should('have.class', 'assessment__answer good good--active')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#proficient').should('have.class', 'assessment__answer proficient proficient')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').should('have.class', 'assessment__answer poor poor')
  })

  it('Should show the first question answered with Poor after Poor is clicked', function () {
    cy.chooseAnswer('poor')

    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#excellent').should('have.class', 'assessment__answer excellent excellent')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#good').should('have.class', 'assessment__answer good good')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#proficient').should('have.class', 'assessment__answer proficient proficient')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').should('have.class', 'assessment__answer poor poor--active')
  })

  it('Should show "comment saved" message when a product comment is made', function () {
    cy.addComment('test', 'Betreft producten:')
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Opmerking opgeslagen')
  })

  it('Should show "comment saved" message when a complexity comment is made', function () {
    // wait 10 seconds: comment saved-message has gone
    cy.wait(10000)
    cy.get('.toasted-container.top-right')
      .and('not.contain', 'Opmerking opgeslagen')
    cy.addComment('test', 'Complexiteit blijkt uit:')
    cy.get('.toasted-container.top-right')
      .and('contain', 'Opmerking opgeslagen')
  })

  it('Manage mark should be average of questions', function () {
    cy.get('.sidebar--open-button').click()
    cy.get('a').contains('Beheren').parent().should('contain', '8.8')
  })

  it('Manage mark should be 4 if one question is anwered with 4', function () {
    cy.get('a').contains('Analyseren').parent().should('contain', '4')
  })

  it('Competence clicked in sidebar: competence is shown', function () {
    cy.get('a').contains('Realiseren').click()
    cy.get('h4').should('contain', 'Realiseren')
  })
})
