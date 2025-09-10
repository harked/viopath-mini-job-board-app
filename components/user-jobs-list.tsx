"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, DollarSign, Calendar, MoreVertical, Eye, Trash2, Power, PowerOff } from "lucide-react"
import Link from "next/link"
import { deleteJob, toggleJobStatus } from "@/app/actions/job-actions"
import { useRouter } from "next/navigation"

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  is_active: boolean
  created_at: string
}

interface UserJobsListProps {
  jobs: Job[]
  userId: string
}

export function UserJobsList({ jobs, userId }: UserJobsListProps) {
  const [loadingJobs, setLoadingJobs] = useState<Set<string>>(new Set())
  const router = useRouter()

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    setLoadingJobs((prev) => new Set(prev).add(jobId))
    try {
      await toggleJobStatus(jobId, userId, !currentStatus)
      router.refresh()
    } catch (error) {
      console.error("Error toggling job status:", error)
    } finally {
      setLoadingJobs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    setLoadingJobs((prev) => new Set(prev).add(jobId))
    try {
      await deleteJob(jobId, userId)
      router.refresh()
    } catch (error) {
      console.error("Error deleting job:", error)
    } finally {
      setLoadingJobs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs posted yet</h3>
          <p className="text-slate-600 mb-6">Start by posting your first job to attract talented candidates.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/post-job">Post Your First Job</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/post-job">Post New Job</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const salary = formatSalary(job.salary_min, job.salary_max)
          const isLoading = loadingJobs.has(job.id)

          return (
            <Card key={job.id} className={`${!job.is_active ? "opacity-75" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium">{job.company}</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <Badge variant="outline">{formatJobType(job.job_type)}</Badge>
                      {salary && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{salary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isLoading}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(job.id, job.is_active)}>
                        {job.is_active ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {formatDate(job.created_at)}</span>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
