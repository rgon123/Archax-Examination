describe('SDET Exercise Frontend Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should assert that you begin with a $1000 USD balance', () => {
      cy.contains('USD Balance: $1000').should('exist');
    });
  
    it('should assert that there are four coin options available', () => {
      cy.get('.ticket').should('have.length', 4);
    });
  
    it('should assert "Coins owned" has incremented by the quantity you provided and that the "Market value" correctly reflects the cost per coin', () => {
      const amountToBuy = 3;
      const coinPrice = 100; 
  
      // Buy 3 coins
      cy.get('.ticket').eq(0).within(() => {
        cy.get('input').clear().type(amountToBuy);
        cy.contains('Buy').click();
      });
  
      // Assert the coins owned
      cy.contains('Coins owned: 3').should('exist');
  
      // Assert the market value
      cy.contains(`Market value: $${amountToBuy * coinPrice}`).should('exist');
    });
  });
  