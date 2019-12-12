Cypress.Commands.add('login', (username, password) => {
  cy.server({
    status: 200
  })
  cy.route('POST', 'Authenticate', 'fixture:mockAuthenticate').as('login')
  cy.visit('http://vidden.karenbrakband.nl')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@login')
})

Cypress.Commands.add('loginFalse', (username, password) => {
  cy.server({
    status: 400,
  })
  cy.route('POST', 'Authenticate', '').as('loginFalse')
  cy.visit('http://vidden.karenbrakband.nl')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@loginFalse')
})

Cypress.Commands.add('logout', () => {
  cy.server({
    status: 200
  })
  cy.route('GET', 'Logout', '').as('logout')
  cy.get('div').contains('Uitloggen').click()
  cy.wait('@logout')
})

Cypress.Commands.add('openBrowsePage', () => {
  cy.server()
  cy.route('GET', 'GetAssessments', 'fixture:mockAssessments').as('assessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait('@assessments')
})

Cypress.Commands.add('backToBrowsePage', () => {
  cy.server()
  cy.route('GET', 'GetAssessments', 'fixture:mockAssessments').as('getAssessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait(['@getAssessments'])
})

Cypress.Commands.add('openNewAssessmentPage', () => {
  cy.server()
  cy.route('GET', 'GetStudents', 'fixture:mockStudents').as('getStudents')
  cy.route('GET', 'Template', 'fixture:mockTemplate').as('getTemplate')
  cy.get('a').contains('Nieuw').click()
  cy.wait(['@getStudents', '@getTemplate'])
})

Cypress.Commands.add('openEditAssessmentPage', () => {
  cy.server()
  cy.route('GET', '6', 'fixture:mockAnswers').as('getAssessmentTeacher')
  cy.visit('http://vidden.karenbrakband.nl/#/edit/1/6')
  cy.wait(['@getAssessmentTeacher'])
})

Cypress.Commands.add('chooseAnswer', (answer) => {
  cy.server()
  cy.route('POST', 'AnswerSave', '').as('answerSaved')
  const answerWithHash = '#' + answer;
  cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
    .parent().get(answerWithHash).click()
  cy.wait(['@answerSaved'])
})

Cypress.Commands.add('confirmNewAssessment', () => {
  cy.server()
  cy.route('POST', 'assessment', 13).as('postNewAssessment')
  cy.route('GET', '13', 'fixture:mockAssessment').as('getNewAssessment')
  cy.get('a').contains('Bevestigen').click()
  cy.wait(['@postNewAssessment'])
  cy.wait(['@getNewAssessment'])
})

Cypress.Commands.add('openSummaryPage', () => {
  cy.server()
  cy.route('GET', '13', 'fixture:mockSummary').as('getSummary')
  cy.visit('http://vidden.karenbrakband.nl/#/summary/13')
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToSummaryPage', () => {
  cy.server()
  cy.route('GET', '1', 'fixture:mockSummary').as('getSummary')
  cy.get('a').contains('Samenvatting beoordeling').click()
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToDashboardPage', () => {
  cy.get('a').contains('Dashboard').click()
})
