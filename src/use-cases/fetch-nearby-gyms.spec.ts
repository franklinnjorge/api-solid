import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymRepository)
  })

  it('should be able to fetch nearby for gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: 43.7321728,
      longitude: -79.4591232,
    })

    await gymRepository.create({
      title: 'Far Gym',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: 42.985487,
      longitude: -81.225497,
    })

    const { gyms } = await sut.execute({
      userLatitude: 43.7321728,
      userLongitude: -79.4591232,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
