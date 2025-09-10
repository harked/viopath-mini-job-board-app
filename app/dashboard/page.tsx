import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserJobsList } from "@/components/user-jobs-list"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const userJobs = jobs || []

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {profile?.full_name || user.email}</h1>
            <p className="text-slate-600">Manage your job postings and track their performance.</p>
          </div>

          {/* Stats */}
          <DashboardStats jobs={userJobs} />

          {/* Jobs List */}
          <UserJobsList jobs={userJobs} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
