describe('Browse page', function () {
  before(function () {
    // mock assessment: 5 assessments
    cy.server()
    cy.route('GET', 'GetAssessments', 'fixture:mockAssessments').as('assessments')
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')   
    cy.get('a').contains('BLADEREN').click()
    cy.wait('@assessments')
  })

  after(function () {
    cy.get('a').contains('Terug naar dashboard').click()
    cy.logout()
  })

  describe('Alle beoordelingen: ', function () {
    describe('First page', function () {
      it('Should show two tabs, "Alle beoordelingen" is selected', function () {
        cy.get('.vue-tab').contains('Alle beoordelingen').should('have.attr', 'aria-selected', 'true')
        cy.get('.vue-tab').contains('Mijn beoordelingen').should('have.attr', 'aria-selected', 'false')
      })

      it('Alle beoordelingen: should have 2 pages, page 1 is selected', function () {
        // 5 assessments, 3 assessments per page => 2 pages
        cy.get('#assessment-listAll').should('contain', 'Pagina: 1 van 2')
        cy.get('.page-item.active').should('contain', '1')
        cy.get('.page-item').should('contain', '2')
      })

      it('Alle beoordelingen: Should show 3 assessments at first page', function () {
        // assessment 1-3 of 5
        cy.get('.card').its('length').should('eq', 3)
      })
    })

    describe('Second page', function () {
      before(function () {
        cy.get('.page-item').contains('2').click()
      })

      it('Alle beoordelingen: page 2 should be selected when clicked', function () {        
        cy.get('#assessment-listAll').should('contain', 'Pagina: 2 van 2')
        cy.get('.page-item').should('contain', '1')
        cy.get('.page-item.active').should('contain', '2')
      })

      it('Alle beoordelingen: Should show 2 assessments at second page', function () {
        // assessment 4-5 of 5
        cy.get('.card').its('length').should('eq', 2)
      })
    })
  })

  describe('Mijn beoordelingen: ', function () {
    before(function () {
      cy.get('.vue-tab').contains('Mijn beoordelingen').click()
    })

    it('"Mijn beoordelingen" is selected after clicked', function () {      
      cy.get('.vue-tab').contains('Alle beoordelingen').should('have.attr', 'aria-selected', 'false')
      cy.get('.vue-tab').contains('Mijn beoordelingen').should('have.attr', 'aria-selected', 'true')
    })

    it('Mijn beoordelingen: Should show 3 assessments with logged in account as teacher', function () {
      // 3 out of 5 assessments have this account as teacher
      // 3 assessments, 3 assessments per page => 1 page
      cy.get('#assessment-listAll').should('contain', 'Pagina: 1 van 1')
      cy.get('.card').its('length').should('eq', 3)
      cy.get('.text-muted span').should('have.length', 3)
        .each(($assessment) => {
          const text = $assessment.text()
          expect(text).to.include('Arjen Korevaar\n                  (BV0111996)')
        })
    })
  }) 
})


