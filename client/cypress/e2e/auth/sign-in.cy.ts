describe('Sign In Page', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in');
  });

  it('should display the sign-in page correctly', () => {
    // Check page structure
    cy.get('[data-cy="signin-title"]').should('contain', 'Sign In');
    cy.get('[data-cy="signin-subtitle"]').should('contain', 'Sign in if you already have an account');
    cy.get('[data-cy="signin-form"]').should('be.visible');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="signin-button"]').should('be.visible').and('contain', 'Sign in');
    cy.get('[data-cy="passkey-button"]').should('be.visible');
    cy.get('[data-cy="continue-with-google-button"]').should('be.visible');
    cy.get('[data-cy="continue-with-github-button"]').should('be.visible');
    cy.get('[data-cy="switch-to-sign-up"]').should('be.visible');
    cy.get('[data-cy="sign-up-link"]').should('be.visible').and('contain', 'Sign Up');
  });

  it('should validate form inputs', () => {
    // Submit empty form
    cy.get('[data-cy="signin-button"]').click();
    
    // Form should show validation errors (email required)
    cy.get('[data-cy="email-input"]').parent().parent().find('[role="alert"]')
      .should('exist')
      .and('contain', 'Email is required');
      
    // Enter invalid email and valid password
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="signin-button"]').click();
    
    // Should show email validation error
    cy.get('[data-cy="email-input"]').parent().parent().find('[role="alert"]')
      .should('exist')
      .and('contain', 'Invalid email');
    
    // Clear inputs
    cy.get('[data-cy="email-input"]').clear();
    cy.get('[data-cy="password-input"]').clear();
    
    // Enter valid email but no password
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="signin-button"]').click();
    
    // Should show password validation error
    cy.get('[data-cy="password-input"]').parent().parent().find('[role="alert"]')
      .should('exist')
      .and('contain', 'Password is required');
    
    // Enter valid email but short password
    cy.get('[data-cy="password-input"]').type('12345');
    cy.get('[data-cy="signin-button"]').click();
    
    // Should show password length validation error
    cy.get('[data-cy="password-input"]').parent().parent().find('[role="alert"]')
      .should('exist')
      .and('contain', 'Password is too short');
  });

  it('should handle failed login attempt', () => {
    // Intercept API call
    cy.interceptSignIn({
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid email or password'
      }
    });

    // Enter credentials and submit
    cy.get('[data-cy="email-input"]').type('wrong@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="signin-button"]').click();

    // Verify API call was made
    cy.wait('@signInRequest');

    // Check for error toast (using whatever toast library is in your app)
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should handle successful login', () => {
    // Mock a successful login
    cy.interceptSignIn({
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User'
          },
          deviceId: 'test-device-id'
        }
      }
    });

    // Intercept the redirection to the homepage
    cy.intercept('GET', '/').as('homePageRedirect');

    // Enter credentials and submit
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="signin-button"]').click();

    // Verify API call was made
    cy.wait('@signInRequest');

    // Verify redirect to homepage
    cy.url().should('not.include', '/auth/sign-in');
  });

  it('should navigate to sign-up page when clicking the sign-up link', () => {
    cy.get('[data-cy="sign-up-link"]').click();
    cy.url().should('include', '/auth/sign-up');
  });

  it('should test passkey login functionality', () => {
    // Since passkey functionality requires browser APIs that may not work in Cypress
    // We can just test the UI interaction
    
    // Type email only
    cy.get('[data-cy="email-input"]').type('test@example.com');
    
    // Click passkey button
    cy.get('[data-cy="passkey-button"]').click();
    
    // Since we cannot fully test WebAuthn in Cypress, this is a partial test
    // Ideally, we would mock the WebAuthn API and verify the workflow
  });

  it('should handle page reload', () => {
    // Fill out the form
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    
    // Reload the page
    cy.reload();
    
    // Modern browsers may restore form values, but this depends on browser behavior
    // We'll at least check that the page loads correctly after reload
    cy.get('[data-cy="signin-title"]').should('contain', 'Sign In');
    cy.get('[data-cy="signin-form"]').should('be.visible');
  });

  it('should have functioning social login buttons', () => {
    // Test that the social login buttons are present
    cy.get('[data-cy="continue-with-google-button"]').should('be.visible');
    cy.get('[data-cy="continue-with-github-button"]').should('be.visible');
    
    // We cannot fully test OAuth flows in Cypress, but we can check the UI elements
  });
});
