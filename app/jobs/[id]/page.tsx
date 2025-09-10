import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { JobDetailHeader } from "@/components/job-detail-header"
import { JobDetailContent } from "@/components/job-detail-content"
import { JobApplicationSection } from "@/components/job-application-section"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase.from("jobs").select("*").eq("id", id).eq("is_active", true).single()

  if (error || !job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <JobDetailHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <JobDetailContent job={job} />
          </div>

          {/* Application Sidebar */}
          <div className="lg:col-span-1">
            <JobApplicationSection job={job} />
          </div>
        </div>
      </main>
    </div>
  )
}
