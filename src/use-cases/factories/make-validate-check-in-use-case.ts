import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkinRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkinRepository)

  return useCase
}
