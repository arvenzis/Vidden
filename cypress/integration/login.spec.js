describe('Login page', function () {
  beforeEach(function () {
    cy.visit('')
  })

  after(function () {
    cy.logout()
  })

  it('Should redirect to https://password.windesheim.nl when password is forgotten', function () {
    cy.get('a').contains('Forgot password?').should('have.attr', 'href', 'https://password.windesheim.nl')
  })

  it('Should display an error on absent credentials', function () {
    cy.get('input#emailaddress').type('email')
      .should('have.attr', 'required', 'required')
    cy.get('input#password').type('email')
      .should('have.attr', 'required', 'required')
  })

  it('Should show the password when mouse hover on field toggle', function () {
    cy.get('input[name=password]').type('password123')
    cy.get('input[name=password]').should('have.value', 'password123').should('have.attr', 'type', 'password')
    cy.get('.d-none.d-md-block.password_field__toggle').trigger('mouseover')
    cy.get('input[name=password]').should('have.value', 'password123').should('have.attr', 'type', 'text')
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
    cy.loginFalse('test@test.com', 'password123')

    // we should have visible errors now
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', "Your username and/of password isn't correct")
  })

  it('Should redirect to /dashboard on success', function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')

    // we should be redirected to dashboard
    cy.get('.container.dashboard-container').should('be.visible')
    cy.get('span.header__user').should('contain', 'Arjen Korevaar')
  })
})

