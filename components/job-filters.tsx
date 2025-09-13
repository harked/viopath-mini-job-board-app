"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [jobType, setJobType] = useState(searchParams.get("job_type") || "all")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [salaryMin, setSalaryMin] = useState(searchParams.get("salary_min") || "")
  const [salaryMax, setSalaryMax] = useState(searchParams.get("salary_max") || "")

  const updateFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (jobType && jobType !== "all") params.set("job_type", jobType)
    if (location) params.set("location", location)
    if (salaryMin) params.set("salary_min", salaryMin)
    if (salaryMax) params.set("salary_max", salaryMax)

    router.push(`/jobs?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setJobType("all")
    setLocation("")
    setSalaryMin("")
    setSalaryMax("")
    router.push("/jobs")
  }

  const hasActiveFilters = search || (jobType && jobType !== "all") || location || salaryMin || salaryMax

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="search"
              placeholder="Job title, company, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
            />
          </div>
        </div>

        {/* Job Type, Location, Salary Range, and Apply Filters in one row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
          {/* Location */}
          <div className="flex-1 space-y-2 min-w-0">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
            />
          </div>

          {/* Salary Range */}
          <div className="flex-1 space-y-2 min-w-0">
            <Label>Salary Range (USD)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateFilters()}
              />
              <Input
                placeholder="Max"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateFilters()}
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="flex-1 space-y-2 min-w-0">
            <Label htmlFor="job-type">Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Filters Button */}
          <div className="flex-1 flex flex-col justify-end min-w-0">
            <Button onClick={updateFilters} className="w-full bg-blue-600 hover:bg-blue-700 mt-6 md:mt-0">
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
