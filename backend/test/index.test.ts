import request from 'supertest';
import { server } from '../src/index'; 
import superwstest from 'superwstest';
import { Server } from 'http';

describe('API Tests', () => {
  let app: Server;

  beforeAll(() => {
    app = server;
  });

  afterAll((done) => {
    app.close(done);
  });

  it('should return successful response payload from purchase-coin endpoint', async () => {
    const response = await request(app)
      .post('/purchase-coin')
      .send({ coinId: 2, amount: 1 })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('inventory');
  });

  it('should test that CoinB increments by one dollar with each message over a period of time', async () => {
    await new Promise(resolve => setTimeout(resolve, 11000)); // Delay to ensure price update

    await superwstest(app)
      .ws('/path-to-your-websocket-endpoint') 
      .expectMessage((msg: any) => {
        const data = JSON.parse(msg.data);
        const coinB = data.coins.find((coin: any) => coin.id === 3);
        console.log(`CoinB price received in test: ${coinB.price}`); // Debug logging
        expect(coinB.price).toBeGreaterThan(100);
      })
      .close();
  }, 30000); // Increase timeout for this test to 30 seconds

  it('should test that inventory.<coinId>.amountOwned reflects owned inventory following purchase-coin execution', async () => {
    const response = await request(app)
      .post('/purchase-coin')
      .send({ coinId: 2, amount: 1 })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.inventory.find((inv: any) => inv.coinId === 2).amountOwned).toBe(1);
  });
});
