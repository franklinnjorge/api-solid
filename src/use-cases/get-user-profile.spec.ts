import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found'

let userRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Register', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('it should be able to get user profile', async () => {
    const userCreated = await userRepository.create({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: userCreated.id,
    })

    expect(user.name).toEqual('Franklin Jorge')
  })

  it('it should not be able to get a user profile with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'not-exists-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
