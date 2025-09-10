"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, ExternalLink, MapPin, Building, DollarSign, Clock } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  application_email: string | null
  application_url: string | null
  created_at: string
}

interface JobApplicationSectionProps {
  job: Job
}

export function JobApplicationSection({ job }: JobApplicationSectionProps) {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `$${min.toLocaleString()}+`
    if (max) return `Up to $${max.toLocaleString()}`
    return "Not specified"
  }

  const formatJobType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="space-y-6">
      {/* Application Card */}
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Apply for this Job</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.application_url && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply Online
              </a>
            </Button>
          )}

          {job.application_email && (
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href={`mailto:${job.application_email}?subject=Application for ${job.title} at ${job.company}`}>
                <Mail className="w-4 h-4 mr-2" />
                Email Application
              </a>
            </Button>
          )}

          {!job.application_url && !job.application_email && (
            <div className="text-center py-4">
              <p className="text-slate-600 text-sm">
                No application method specified. Please contact the company directly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">Company</span>
              </div>
              <span className="font-medium text-slate-900">{job.company}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Location</span>
              </div>
              <span className="font-medium text-slate-900">{job.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Job Type</span>
              </div>
              <Badge variant="secondary">{formatJobType(job.job_type)}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Salary</span>
              </div>
              <span className="font-medium text-green-600">{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Posted</span>
              </div>
              <span className="font-medium text-slate-900">{formatDate(job.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Job */}
      <Card>
        <CardHeader>
          <CardTitle>Share this Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${job.title} at ${job.company}`,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="flex-1"
            >
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
