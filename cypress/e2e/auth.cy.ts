describe('Authentication E2E Flow', () => {
  beforeEach(() => {
    // Reset database or use mock API responses if needed
  });

  it('Should successfully load the login page', () => {
    cy.visit('/portal');
    cy.contains('Sign in to your account').should('be.visible');
  });

  it('Should display error for invalid credentials', () => {
    cy.visit('/portal');
    cy.get('input[type="email"]').type('invalid@nexoratech.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Application should show alert or error message
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Invalid credentials');
    });
  });

  it('Should toggle between login and registration', () => {
    cy.visit('/portal');
    cy.contains('Sign Up').click();
    cy.contains('Create an account').should('be.visible');
    cy.contains('Sign In').click();
    cy.contains('Sign in to your account').should('be.visible');
  });
});
