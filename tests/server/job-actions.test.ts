import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: () => ({
      insert: vi.fn(async () => ({ data: [{ id: 'job_1' }], error: null })),
      select: vi.fn(async () => ({ data: [], error: null })),
      delete: vi.fn(async () => ({ error: null })),
      update: vi.fn(async () => ({ error: null })),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    }),
  })),
}))

import { createJobPost } from '@/app/actions/job-actions'

describe('server actions: createJobPost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when required fields are missing', async () => {
    const fd = new FormData()
    // Missing: title, company, location, job_type, description
    fd.set('application_email', 'hr@example.com')

    const res = await createJobPost(fd, 'user_1')
    expect(res).toEqual({ error: 'Please fill in all required fields' })
  })

  it('succeeds and revalidates paths on valid input', async () => {
    const { revalidatePath } = await import('next/cache')
    const fd = new FormData()
    fd.set('title', 'Frontend Engineer')
    fd.set('company', 'Acme Inc')
    fd.set('location', 'Remote')
    fd.set('job_type', 'full-time')
    fd.set('description', 'Build great UIs')
    fd.set('application_email', 'hr@acme.test')
    fd.set('salary_min', '80000')
    fd.set('salary_max', '120000')

    const res = await createJobPost(fd, 'user_1')
    expect(res).toMatchObject({ success: true })
    expect((revalidatePath as unknown as ReturnType<typeof vi.fn>)).toHaveBeenCalled()
  })
})

