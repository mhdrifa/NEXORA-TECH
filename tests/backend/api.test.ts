import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import apiRouter from '../../server/routes/api';

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

describe('API Endpoints Testing', () => {
  it('should return 401 for protected /api/client resources', async () => {
    const res = await request(app).get('/api/client/projects');
    expect(res.status).toBe(401); // Unauthorized without token
  });

  it('should return 401 for protected /api/cms resources', async () => {
    const res = await request(app).get('/api/cms/pages');
    expect(res.status).toBe(401);
  });

  it('should handle missing fields in email contact endpoint', async () => {
    const res = await request(app).post('/api/email/contact').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
