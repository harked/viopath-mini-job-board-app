import { Button } from "@/components/ui/button"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function JobDetailHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/jobs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
            <div className="h-6 w-px bg-slate-300" />
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-slate-900">VioPath</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
