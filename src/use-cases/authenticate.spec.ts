import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credential-error'

describe('Register', () => {
  it('it should be able to authenticate', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'franklin-jorge@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('it should not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(userRepository)

    expect(async () => {
      await sut.execute({
        email: 'franklin-jorge@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('it should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'franklin-jorge@example.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
