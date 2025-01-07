describe('Sign In Page', () => {
  beforeEach(() => {
    const apiUrl = Cypress.env('BASE_URL')
    cy.visit(`${apiUrl}/auth/sign-in`)
  })

  it('should display sign-in page correctly', () => {
    cy.get('h1').contains('Sign In').should('be.visible')
    cy.get('p').contains('Sign in if you already have an account').should('be.visible')
    cy.get('form').should('exist')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]')
      .contains('Sign in')
      .should('be.visible')
      .should('have.class', 'bg-blue-500')
      .trigger('hover')
      .should('have.class', 'hover:bg-blue-600')
    cy.get('span').contains('or').should('be.visible')
    cy.get('[data-cy="continue-with-google-button"]')
      .should('be.visible')
      .contains('Continue with Google')
      .should('be.visible')
    cy.get('[data-cy="continue-with-github-button"]')
      .should('be.visible')
      .contains('Continue with Github')
      .should('be.visible')
    cy.get('[data-cy="switch-to-sign-up"]').should('be.visible').contains("Don't have an account? Sign Up")
    cy.get('[data-cy="sign-up-link"]').contains('Sign Up').should('be.visible')
  })

  it('test operation of sign-in page', () => {
    cy.get('input').each(($input) => {
      const inputId = $input.attr('id')
      cy.get(`label[for="${inputId}"]`)
        .should('be.visible')
        .click()
        .then(() => {
          cy.get(`input[id="${inputId}"]`).should('have.focus')
        })
    })
  })

  it('test redirect to sign up page', () => {
    cy.get('[data-cy="sign-up-link"]').click()
    cy.get('h1').contains('Sign Up').should('be.visible')
  })
})
