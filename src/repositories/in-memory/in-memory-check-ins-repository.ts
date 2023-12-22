import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../prisma/check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(checkInId: string, date: Date) {
    const checkInOnSameDate = this.items.find(
      (item) => item.user_id === checkInId,
    )

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }
}
