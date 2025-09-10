import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JobPostForm } from "@/components/job-post-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { Briefcase } from "lucide-react"

export default async function PostJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile for header display
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header (same style as dashboard) */}
      <DashboardHeader user={user} profile={profile} />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create a New Job Posting</h2>
          <p className="text-slate-600">
            Fill out the form below to post your job opportunity. All fields marked with * are required.
          </p>
        </div>

        <JobPostForm userId={user.id} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold">VioPath</span>
          </div>
          <p className="text-sm">© 2025 VioPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
