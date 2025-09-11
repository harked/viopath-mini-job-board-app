// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock next/link to a simple anchor
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

import { JobCard } from '@/components/job-card'

describe('JobCard', () => {
  const realDate = Date

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-10T12:00:00.000Z'))
  })

  afterAll(() => {
    vi.useRealTimers()
    // restore Date if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).Date = realDate
  })

  it('renders job info and salary range', () => {
    const job = {
      id: 'job_1',
      title: 'Frontend Engineer',
      company: 'Acme Inc',
      location: 'Remote',
      job_type: 'full-time',
      salary_min: 80000,
      salary_max: 120000,
      description: 'Build and ship UI features',
      created_at: '2024-06-05T12:00:00.000Z', // 5 days before mocked now
    }

    render(<JobCard job={job as any} />)

    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Inc')).toBeInTheDocument()
    expect(screen.getByText('Remote')).toBeInTheDocument()
    expect(screen.getByText('Full-Time')).toBeInTheDocument()
    expect(screen.getByText('$80,000 - $120,000')).toBeInTheDocument()
    expect(screen.getByText('View Details')).toBeInTheDocument()
    expect(screen.getByText(/5 days ago/)).toBeInTheDocument()
  })
})

