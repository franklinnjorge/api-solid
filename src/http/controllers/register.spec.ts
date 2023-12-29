import { app } from '@/app'
import request from 'supertest'
import { describe, it, afterAll, beforeAll, expect } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to regist a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password: '123456',
    })
    expect(response.status).toBe(201)
  })
})
