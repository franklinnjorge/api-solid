import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUsersCheckInsUseCaseRequest {
  userId: string
  page: number
}

interface FetchUsersCheckInsUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUsersCheckInsUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUsersCheckInsUseCaseRequest): Promise<FetchUsersCheckInsUseCaseResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
