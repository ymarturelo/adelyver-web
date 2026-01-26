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

      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
      expect(result.data?.id).toBe('user-123')
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

      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
      expect(result.data?.id).toBe('user-456')
      expect(mockSupabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({
        password: 'password123',
        email: undefined,
        phone: '+34123456789',
      })
    })

    it('should return 400 error if neither email nor phone provided', async () => {
      const result = await registerUser({
        password: 'password123',
        fullName: 'John Doe',
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.error).toBeDefined()
    })

    it('should return 400 error on createUser failure', async () => {
      const mockSupabaseAdmin = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'User already exists' },
            }),
          },
        },
      }

      vi.mocked(supabaseServer.supabaseAdmin).mockReturnValue(mockSupabaseAdmin as any)

      const result = await registerUser({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.error).toBeDefined()
    })

    it('should return 500 error if user data is null', async () => {
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

      const result = await registerUser({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe(500)
      expect(result.error).toBeDefined()
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

      const result = await registerUser({
        email: 'admin@example.com',
        password: 'password123',
        fullName: 'Admin User',
        role: 'admin',
      })

      expect(result.success).toBe(true)
      expect(result.status).toBe(201)
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

      expect(result.success).toBe(true)
      expect(result.status).toBe(200)
      expect(result.data?.user.id).toBe('user-123')
      expect(result.data?.session.access_token).toBe('token-123')
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

      expect(result.success).toBe(true)
      expect(result.status).toBe(200)
      expect(result.data?.user.id).toBe('user-456')
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        phone: '+34123456789',
        password: 'password123',
      })
    })

    it('should return 400 error if neither email nor phone provided', async () => {
      const result = await loginUser({
        password: 'password123',
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe(400)
      expect(result.error).toBeDefined()
    })

    it('should return 401 error on login failure', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
          }),
        },
      }

      vi.mocked(supabaseServer.supabase).mockReturnValue(mockSupabase as any)

      const result = await loginUser({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe(401)
      expect(result.error).toBeDefined()
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
