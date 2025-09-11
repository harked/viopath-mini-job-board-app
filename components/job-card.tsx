import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Clock, Building } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  description: string
  created_at: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `$${min.toLocaleString()}+`
    if (max) return `Up to $${max.toLocaleString()}`
    return null
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

  const salary = formatSalary(job.salary_min, job.salary_max)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <div className="flex items-center text-slate-600 space-x-4">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span className="text-sm">{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{job.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="text-xs">
              {formatJobType(job.job_type)}
            </Badge>
            <div className="flex items-center text-slate-500 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(job.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {salary && (
              <div className="flex items-center text-green-600 text-sm font-medium">
                {salary}
              </div>
            )}
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
