import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    expect(() => {
      registerUseCase.execute({
        name: 'Franklin Jorge',
        email: 'franklin-jorge@example.com',
        password: '123456',
      })
    }).not.toThrow()
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Franklin Jorge',
      email: 'franklin-jorge@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHasded = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHasded).toBe(true)
  })

  it('it should not be able register with same email twice', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)
    const email = 'franklin-jorge@example.com'

    await registerUseCase.execute({
      name: 'Franklin Jorge',
      email,
      password: '123456',
    })

    await expect(async () => {
      await registerUseCase.execute({
        name: 'Franklin Jorge',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
