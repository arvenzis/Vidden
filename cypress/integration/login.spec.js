describe('Test the API Authenticate endpoint', function () {
  it('Should return a 200 status when my credentials are correct', function () {
    cy.request({
      method: 'POST',
      url: 'User/Authenticate',
      body: '{"emailaddress": "s1019744@student.windesheim.nl",  "password": "12345"}',
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.eq(200)
      })
  })
  it('Should return a 400 status when my credentials are incorrect', function () {
    cy.request({
      method: 'POST',
      url: 'User/Authenticate',
      body: '{"emailaddress": "string",  "password": "string"}',
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.eq("Username or password is incorrect")
      })
  })
})

describe('Login page', function () {
  beforeEach(function () {
    cy.visit('http://vidden.karenbrakband.nl')
  })

  after(function () {
    cy.logout()
  })

  it('Should display an error on absent credentials', function () {
    cy.get('input#emailaddress').type('email')
      .should('have.attr', 'required', 'required')
    cy.get('input#password').type('email')
      .should('have.attr', 'required', 'required')
  })

  it('Should display a spinner when loading', function () {
    // 4 seconds delay: test the loader
    cy.server({
      delay: 4000,
      status: 400,
      response: {}
    })
    cy.route('POST', 'Authenticate').as('authenticate')
    cy.get('input[name=emailaddress]').type('test@test.com')
    cy.get('input[name=password]').type('password123{enter}')

    // spinner should be visible during loading
    cy.get('.vue-simple-spinner').should('be.visible')

    // spinner should be invisible after response
    cy.wait(['@authenticate'])
    cy.get('@authenticate').its('status').should('eq', 400)
    cy.get('.vue-simple-spinner').should('not.be.visible')
  })

  it('Should display an error message on incorrect credentials', function () {
    // no visible errors when at the beginning
    cy.get('label.alert.alert-danger.col-md-6.offset-md-4')
      .should('be.not.be.visible')

    // incorrect username on purpose
    cy.login('test@test.com', 'password123')

    // we should have visible errors now
    cy.get('label.alert.alert-danger.col-md-6.offset-md-4')
      .should('be.visible')
      .and('contain', 'Uw gebruikersnaam en / of wachtwoord is onjuist.')
  })

  it('Should redirect to /dashboard on success', function () {
    cy.login('s1019744@student.windesheim.nl', '12345')

    // we should be redirected to dashboard
    cy.get('.container.dashboard-container').should('be.visible')
    cy.get('span.header__user').should('contain', 'Bernard Bos')
  })
})
