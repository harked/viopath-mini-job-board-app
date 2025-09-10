"use client"

import { Suspense } from "react"
import { JobFilters } from "./job-filters"

function JobFiltersContent() {
  return <JobFilters />
}

export function JobFiltersWrapper() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      }
    >
      <JobFiltersContent />
    </Suspense>
  )
}
