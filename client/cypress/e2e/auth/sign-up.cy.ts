describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-up')
  })

  it('should display the sign-up form correctly', () => {
    cy.get('h1').should('have.text', 'Sign Up')
    cy.get('p').first().should('have.text', 'Create an account to continue')
    cy.get('input[name="first_name"]').should('be.visible')
    cy.get('input[name="last_name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="confirm_password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('First name is required').should('be.visible')
    cy.contains('Last name is required').should('be.visible')
    cy.contains('Email is required').should('be.visible')
    cy.contains('Password is required').should('be.visible')
    cy.contains('Confirm password is required').should('be.visible')
  })

  it('should validate email format', () => {
    cy.get('input[name="email"]').type('invalidemail')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid email').should('be.visible')
  })

  it('should validate password requirements', () => {
    cy.get('input[name="password"]').type('short')
    cy.get('button[type="submit"]').click()
    cy.contains('Password is too short').should('be.visible')

    cy.get('input[name="password"]').clear().type('onlyletters')
    cy.get('button[type="submit"]').click()
    cy.contains('Password must contain at least one letter and one number').should('be.visible')

    cy.get('input[name="password"]').clear().type('12345678')
    cy.get('button[type="submit"]').click()
    cy.contains('Password must contain at least one letter and one number').should('be.visible')
  })

  it('should validate password match', () => {
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm_password"]').type('DifferentPassword123')
    cy.get('button[type="submit"]').click()
    cy.contains('Passwords do not match').should('be.visible')
  })

  it('should navigate to sign-in page when clicking sign-in link', () => {
    cy.get('[data-cy="sign-in-link"]').click()
    cy.url().should('include', '/auth/sign-in')
  })

  it('should attempt to sign up with valid form data', () => {
    cy.intercept('POST', '/api/auth/sign-up', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe'
          }
        }
      }
    }).as('signUpRequest')

    cy.get('input[name="first_name"]').type('John')
    cy.get('input[name="last_name"]').type('Doe')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm_password"]').type('Password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@signUpRequest').its('request.body').should('deep.include', {
      email: 'test@example.com',
      password: 'Password123',
      first_name: 'John',
      last_name: 'Doe'
    })

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should show error toast on failed sign up', () => {
    cy.intercept('POST', '/api/auth/sign-up', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Email already exists'
      }
    }).as('failedSignUp')

    cy.get('input[name="first_name"]').type('John')
    cy.get('input[name="last_name"]').type('Doe')
    cy.get('input[name="email"]').type('existing@example.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm_password"]').type('Password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@failedSignUp')
    cy.contains('Email already exists').should('be.visible')
  })

  it('should handle Google sign-up', () => {
    const googleUserStub = {
      email: 'google@example.com',
      photoURL: 'https://example.com/photo.jpg',
      displayName: 'Google User'
    }

    cy.intercept('POST', '/api/auth/google/sign-up', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, email: 'google@example.com' }
        }
      }
    }).as('googleSignUp')

    cy.window().then((win) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      win.googleSignUpCallback = cy.stub().callsFake((user) => {
        cy.get('@googleAuthFunction').invoke('call', null, googleUserStub)
      })
    })

    cy.get('[data-cy="google-signin-button"]').should('be.visible')
  })

  it('should handle GitHub sign-up', () => {
    cy.get('[data-cy="github-signin-button"]').should('be.visible')
  })

  it('should redirect to home page after successful sign-up', () => {
    cy.intercept('POST', '/api/auth/sign-up', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe'
          }
        }
      }
    }).as('signUpRequest')

    cy.get('input[name="first_name"]').type('John')
    cy.get('input[name="last_name"]').type('Doe')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm_password"]').type('Password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@signUpRequest').its('request.body').should('deep.include', {
      email: 'test@example.com',
      password: 'Password123',
      first_name: 'John',
      last_name: 'Doe'
    })

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})

export {}
