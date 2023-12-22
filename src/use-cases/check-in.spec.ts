import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Register', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '1',
      userId: '1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 3, 23, 0, 0, 0))
    await sut.execute({
      gymId: '1',
      userId: '1',
    })

    await expect(() =>
      sut.execute({
        gymId: '1',
        userId: '1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but in diferents days', async () => {
    vi.setSystemTime(new Date(2022, 3, 23, 0, 0, 0))

    await sut.execute({
      gymId: '1',
      userId: '1',
    })

    vi.setSystemTime(new Date(2022, 3, 24, 0, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: '1',
      userId: '1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
