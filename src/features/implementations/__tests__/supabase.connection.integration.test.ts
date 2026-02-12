import { describe, it, expect } from 'vitest'
import { getSupabaseTestClient } from '../../../lib/supabase.test'

describe('Supabase – real connection', () => {
  it('connects to database successfully', async () => {
        
    
    const supabase = getSupabaseTestClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
