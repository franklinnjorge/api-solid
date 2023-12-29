import { app } from '@/app'
import request from 'supertest'
import { describe, it, afterAll, beforeAll, expect } from 'vitest'
import { a } from 'vitest/dist/suite-SvxfaIxW'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'franklin-jorge@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.status).toBe(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'franklin-jorge@example.com',
      }),
    )
  })
})
