import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export async function JobsHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">VioPath</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
