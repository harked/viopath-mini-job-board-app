import { createClient } from "@/lib/supabase/server"
import { JobsHeader } from "@/components/jobs-header"
import { JobFiltersWrapper } from "@/components/job-filters-wrapper"
import { JobCard } from "@/components/job-card"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SearchParams {
  search?: string
  job_type?: string
  location?: string
  salary_min?: string
  salary_max?: string
  page?: string
}

export default async function JobsPage({
  searchParams,
}: {
  // Next.js app router passes `searchParams` synchronously
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const sp = searchParams || {}
  const toStr = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const params: SearchParams = {
    search: toStr(sp.search),
    job_type: toStr(sp.job_type),
    location: toStr(sp.location),
    salary_min: toStr(sp.salary_min),
    salary_max: toStr(sp.salary_max),
    page: toStr(sp.page),
  }
  const supabase = await createClient()

  const PAGE_SIZE = 5
  const page = Math.max(1, Number.parseInt(params.page || "1"))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Build query with filters
  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Apply search filter
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,company.ilike.%${params.search}%,description.ilike.%${params.search}%`,
    )
  }

  // Apply job type filter
  if (params.job_type && params.job_type !== "all") {
    query = query.eq("job_type", params.job_type)
  }

  // Apply location filter
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  // Apply salary filters
  if (params.salary_min) {
    const minSalary = Number.parseInt(params.salary_min)
    query = query.gte("salary_max", minSalary)
  }

  if (params.salary_max) {
    const maxSalary = Number.parseInt(params.salary_max)
    query = query.lte("salary_min", maxSalary)
  }

  // Apply pagination range
  query = query.range(from, to)

  const { data: jobs, error, count } = await query

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  const jobsData = jobs || []
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const hasPrev = page > 1
  const hasNext = page < totalPages

  const buildPageHref = (targetPage: number) => {
    const qs = new URLSearchParams()
    if (params.search) qs.set("search", params.search)
    if (params.job_type) qs.set("job_type", params.job_type)
    if (params.location) qs.set("location", params.location)
    if (params.salary_min) qs.set("salary_min", params.salary_min)
    if (params.salary_max) qs.set("salary_max", params.salary_max)
    qs.set("page", String(targetPage))
    const queryStr = qs.toString()
    return queryStr ? `/jobs?${queryStr}` : "/jobs"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <JobsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-slate-600">
            Discover {totalCount} job{totalCount !== 1 ? "s" : ""} from top companies
          </p>
        </div>

        {/* Filters on top, jobs below */}
        <div className="mb-6">
          <JobFiltersWrapper />
        </div>
        <div>
          {jobsData.length > 0 ? (
            <>
              <div className="space-y-4">
                {jobsData.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  {hasPrev ? (
                    <Button asChild variant="outline">
                      <Link href={buildPageHref(page - 1)}>Previous</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Previous
                    </Button>
                  )}

                  <div className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </div>

                  {hasNext ? (
                    <Button asChild variant="outline">
                      <Link href={buildPageHref(page + 1)}>Next</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Next
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-600">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
