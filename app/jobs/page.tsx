import { createClient } from "@/lib/supabase/server"
import { JobsHeader } from "@/components/jobs-header"
import { JobFiltersWrapper } from "@/components/job-filters-wrapper"
import { JobCard } from "@/components/job-card"
import { Briefcase } from "lucide-react"

interface SearchParams {
  search?: string
  job_type?: string
  location?: string
  salary_min?: string
  salary_max?: string
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false })

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

  const { data: jobs, error } = await query

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  const jobsData = jobs || []

  return (
    <div className="min-h-screen bg-slate-50">
      <JobsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-slate-600">
            Discover {jobsData.length} job{jobsData.length !== 1 ? "s" : ""} from top companies
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFiltersWrapper />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {jobsData.length > 0 ? (
              <div className="space-y-4">
                {jobsData.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
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
        </div>
      </main>
    </div>
  )
}
