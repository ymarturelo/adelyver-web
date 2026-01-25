import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerUser, loginUser } from './auth'
import * as supabaseServer from '@/lib/supabase/server'
import * as db from '@/lib/db'
import * as schema from '@/lib/db/schema'

// Mock dependencies
vi.mock('@/lib/supabase/server')
vi.mock('@/lib/db')
vi.mock('@/lib/db/schema')
vi.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid-123',
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('registerUser', () => {
    it('should register user with email', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: {
                user: {
                  id: 'user-123',
                  email: 'test@example.com',
                },
              },
              error: null,
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      const mockDbInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      })

      vi.mocked(db.db).insert = mockDbInsert

      const result = await registerUser({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      })

      expect(result).toEqual({ id: 'user-123' })
      expect(mockSupabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({
        password: 'password123',
        email: 'test@example.com',
        phone: undefined,
      })
      expect(mockDbInsert).toHaveBeenCalled()
    })

    it('should register user with phone', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: {
                user: {
                  id: 'user-456',
                  phone: '+34123456789',
                },
              },
              error: null,
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      const mockDbInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      })

      vi.mocked(db.db).insert = mockDbInsert

      const result = await registerUser({
        phone: '+34123456789',
        password: 'password123',
        fullName: 'Jane Doe',
      })

      expect(result).toEqual({ id: 'user-456' })
      expect(mockSupabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({
        password: 'password123',
        email: undefined,
        phone: '+34123456789',
      })
    })

    it('should throw error if neither email nor phone provided', async () => {
      await expect(
        registerUser({
          password: 'password123',
          fullName: 'John Doe',
        })
      ).rejects.toThrow('Se requiere al menos email o phone')
    })

    it('should throw error on createUser failure', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('User already exists'),
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      await expect(
        registerUser({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'John Doe',
        })
      ).rejects.toThrow('User already exists')
    })

    it('should throw error if user data is null', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: { user: null },
              error: null,
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      await expect(
        registerUser({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'John Doe',
        })
      ).rejects.toThrow('No se pudo crear el usuario')
    })

    it('should set role as admin if provided', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: {
                user: {
                  id: 'user-789',
                  email: 'admin@example.com',
                },
              },
              error: null,
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      const mockValues = vi.fn().mockResolvedValue(undefined)
      const mockInsert = vi.fn().mockReturnValue({
        values: mockValues,
      })

      vi.mocked(db.db).insert = mockInsert

      await registerUser({
        email: 'admin@example.com',
        password: 'password123',
        fullName: 'Admin User',
        role: 'admin',
      })

      expect(mockInsert).toHaveBeenCalled()
      const valuesArg = mockValues.mock.calls[0][0]
      expect(valuesArg.role).toBe('admin')
    })
  })

  describe('loginUser', () => {
    it('should login user with email', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: {
              user: { id: 'user-123', email: 'test@example.com' },
              session: { access_token: 'token-123', refresh_token: 'refresh-123' },
            },
            error: null,
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const result = await loginUser({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        user: { id: 'user-123', email: 'test@example.com' },
        session: { access_token: 'token-123', refresh_token: 'refresh-123' },
      })
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should login user with phone', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: {
              user: { id: 'user-456', phone: '+34123456789' },
              session: { access_token: 'token-456', refresh_token: 'refresh-456' },
            },
            error: null,
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const result = await loginUser({
        phone: '+34123456789',
        password: 'password123',
      })

      expect(result).toEqual({
        user: { id: 'user-456', phone: '+34123456789' },
        session: { access_token: 'token-456', refresh_token: 'refresh-456' },
      })
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        phone: '+34123456789',
        password: 'password123',
      })
    })

    it('should throw error if neither email nor phone provided', async () => {
      await expect(
        loginUser({
          password: 'password123',
        })
      ).rejects.toThrow('Se requiere email o teléfono para iniciar sesión')
    })

    it('should throw error on login failure', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Invalid credentials'),
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials')
    })

    it('should prioritize email over phone when both provided', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: {
              user: { id: 'user-123', email: 'test@example.com' },
              session: { access_token: 'token-123', refresh_token: 'refresh-123' },
            },
            error: null,
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      await loginUser({
        email: 'test@example.com',
        phone: '+34123456789',
        password: 'password123',
      })

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })
})
