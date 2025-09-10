import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Eye, Clock, CheckCircle } from "lucide-react"

interface Job {
  id: string
  is_active: boolean
  created_at: string
}

interface DashboardStatsProps {
  jobs: Job[]
}

export function DashboardStats({ jobs }: DashboardStatsProps) {
  const totalJobs = jobs.length
  const activeJobs = jobs.filter((job) => job.is_active).length
  const inactiveJobs = totalJobs - activeJobs

  // Calculate jobs posted this month
  const thisMonth = new Date()
  thisMonth.setDate(1)
  const jobsThisMonth = jobs.filter((job) => new Date(job.created_at) >= thisMonth).length

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Inactive Jobs",
      value: inactiveJobs,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "This Month",
      value: jobsThisMonth,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
