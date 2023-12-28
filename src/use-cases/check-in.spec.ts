import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    await gymsRepository.create({
      id: 'gym-id-01',
      description: 'Gym Description',
      latitude: 43.7321728,
      longitude: -79.4591232,
      created_at: new Date(),
      title: 'No Pain no Gain',
      phone: 'null',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 43.7321728,
      userLongitude: -79.4591232,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 3, 23, 4, 0, 0))

    await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 43.7321728,
      userLongitude: -79.4591232,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id-01',
        userId: 'user-id-01',
        userLatitude: 43.7321728,
        userLongitude: -79.4591232,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice, but in diferents days', async () => {
    vi.setSystemTime(new Date(2022, 3, 23, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 43.7321728,
      userLongitude: -79.4591232,
    })

    vi.setSystemTime(new Date(2022, 3, 24, 2, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 43.7321728,
      userLongitude: -79.4591232,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id-02',
      description: 'Gym Description',
      latitude: new Decimal(43.7828841),
      longitude: new Decimal(-79.1866481),
      title: 'No Pain no Gain',
      created_at: new Date(),
      phone: 'null',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id-02',
        userId: 'user-id-01',
        userLatitude: 43.7321728,
        userLongitude: -79.4591232,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
