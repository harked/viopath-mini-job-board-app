import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JobPostForm } from "@/components/job-post-form"

export default async function PostJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">Post a Job</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create a New Job Posting</h2>
          <p className="text-slate-600">
            Fill out the form below to post your job opportunity. All fields marked with * are required.
          </p>
        </div>

        <JobPostForm userId={user.id} />
      </main>
    </div>
  )
}
