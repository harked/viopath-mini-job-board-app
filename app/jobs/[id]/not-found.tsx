import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Job Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">The job you're looking for doesn't exist or may have been removed.</p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/jobs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
