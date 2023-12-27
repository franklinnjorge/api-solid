import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      title: 'Fitness Academy JS',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: 43.7321728,
      longitude: -79.4591232,
    })

    await gymRepository.create({
      title: 'Fitness Academy TS',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: 43.7321728,
      longitude: -79.4591232,
    })

    const { gyms } = await sut.execute({
      query: 'Fitness Academy JS',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fitness Academy JS' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Fitness Academy JS ${i}`,
        description: 'The best gym in the world',
        phone: '123456789',
        latitude: 43.7321728,
        longitude: -79.4591232,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Fitness Academy JS',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fitness Academy JS 21' }),
      expect.objectContaining({ title: 'Fitness Academy JS 22' }),
    ])
  })
})
