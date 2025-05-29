describe('Basic Navigation', () => {
  it('visits the home page', () => {
    cy.visit('/');
    cy.contains('Nicolas Gruwe');
  });

  it('navigates to about page', () => {
    cy.visit('/about');
    cy.contains('Crafting Digital');
  });

  it('navigates to portfolio page', () => {
    cy.visit('/portfolio');
    cy.contains('Portfolio');
  });

  it('navigates to contact page', () => {
    cy.visit('/contact');
    cy.contains('Contact');
  });
});