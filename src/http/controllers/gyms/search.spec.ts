import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'No Pain No Gain',
        description: 'No excuses, just results',
        phone: '11999999999',
        latitude: 43.7321728,
        longitude: -79.4591232,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Fitness Club',
        description: 'better than yesterday',
        phone: '11999999999',
        latitude: 43.7321728,
        longitude: -79.4591232,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Gain',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'No Pain No Gain',
      }),
    ])
  })
})
