export {}

type User = {
  email: string
  password: string
}

declare global {
  interface Window {
    googleSignInCallback: (user: User) => void
  }

  interface Window {
    googleSignUpCallback: (user: User) => void
  }
}

// Add custom commands to Cypress interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login directly via API
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<Element>

      /**
       * Custom command to check if toast with specific message is visible
       * @example cy.toastShouldContain('Successfully signed in')
       */
      toastShouldContain(message: string): Chainable<Element>

      /**
       * Custom command to get a DOM element by data-cy attribute
       * @example cy.dataCy('signin-button')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to stub WebAuthn API
       * @example cy.stubWebAuthn()
       */
      stubWebAuthn(): Chainable<Element>
    }
  }
}

// Login directly via API without UI
Cypress.Commands.add('login', (email: string, password: string) => {
  const device_id = Cypress.env('DEVICE_ID') || '12345-test-device-id'

  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/auth/sign-in`,
    body: {
      email,
      password,
      device_id,
      device: JSON.stringify({
        browser: 'Chrome',
        platform: 'test-platform',
        userAgent: 'cypress-test-agent'
      })
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.success).to.eq(true)

    // Store the device ID in localStorage
    window.localStorage.setItem('device_id', response.body.data.deviceId || device_id)

    // Visit the homepage after login
    cy.visit('/')
  })
})

// Check if a toast notification contains a specific message
Cypress.Commands.add('toastShouldContain', (message: string) => {
  // Adjust this selector based on how your toast notifications are rendered
  cy.get('.sonner-toast').should('contain', message)
})

// Get element by data-cy attribute
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

// -- Stubs for web authentication API --
Cypress.Commands.add('stubWebAuthn', () => {
  cy.window().then((win) => {
    // Stub for navigator.credentials.create (registration)
    cy.stub(win.navigator.credentials, 'create').resolves({
      id: 'test-credential-id',
      rawId: new ArrayBuffer(0),
      response: {
        clientDataJSON: new ArrayBuffer(0),
        attestationObject: new ArrayBuffer(0),
        getTransports: () => ['internal']
      },
      getClientExtensionResults: () => ({})
    })

    // Stub for navigator.credentials.get (authentication)
    cy.stub(win.navigator.credentials, 'get').resolves({
      id: 'test-credential-id',
      rawId: new ArrayBuffer(0),
      type: 'public-key',
      response: {
        authenticatorData: new ArrayBuffer(0),
        clientDataJSON: new ArrayBuffer(0),
        signature: new ArrayBuffer(0),
        userHandle: new ArrayBuffer(0)
      },
      getClientExtensionResults: () => ({})
    })
  })
})
