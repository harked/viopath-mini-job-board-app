"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJobPost } from "@/app/actions/job-actions"

interface JobPostFormProps {
  userId: string
}

export function JobPostForm({ userId }: JobPostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createJobPost(formData, userId)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>Provide comprehensive information about the position</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700">
                Job Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Senior Software Engineer"
                required
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-700">
                Company Name *
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g. Acme Corp"
                required
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-700">
                Location *
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. San Francisco, CA or Remote"
                required
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_type" className="text-slate-700">
                Job Type *
              </Label>
              <Select name="job_type" required>
                <SelectTrigger className="border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min" className="text-slate-700">
                Minimum Salary (USD)
              </Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                placeholder="e.g. 80000"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max" className="text-slate-700">
                Maximum Salary (USD)
              </Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                placeholder="e.g. 120000"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">
              Job Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              required
              rows={6}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-slate-700">
              Requirements
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="List the required skills, experience, and qualifications..."
              rows={4}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits" className="text-slate-700">
              Benefits & Perks
            </Label>
            <Textarea
              id="benefits"
              name="benefits"
              placeholder="Describe the benefits, perks, and company culture..."
              rows={4}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          {/* Application Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application_email" className="text-slate-700">
                Application Email
              </Label>
              <Input
                id="application_email"
                name="application_email"
                type="email"
                placeholder="jobs@company.com"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="application_url" className="text-slate-700">
                Application URL
              </Label>
              <Input
                id="application_url"
                name="application_url"
                type="url"
                placeholder="https://company.com/careers/job-id"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Job"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
