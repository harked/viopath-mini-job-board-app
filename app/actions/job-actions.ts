"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createJobPost(formData: FormData, userId: string) {
  const supabase = await createClient()

  // Extract form data
  const title = formData.get("title") as string
  const company = formData.get("company") as string
  const location = formData.get("location") as string
  const jobType = formData.get("job_type") as string
  const salaryMin = formData.get("salary_min") as string
  const salaryMax = formData.get("salary_max") as string
  const description = formData.get("description") as string
  const requirements = formData.get("requirements") as string
  const benefits = formData.get("benefits") as string
  const applicationEmail = formData.get("application_email") as string
  const applicationUrl = formData.get("application_url") as string

  // Validate required fields
  if (!title || !company || !location || !jobType || !description) {
    return { error: "Please fill in all required fields" }
  }

  // Validate job type
  const validJobTypes = ["full-time", "part-time", "contract", "internship"]
  if (!validJobTypes.includes(jobType)) {
    return { error: "Invalid job type selected" }
  }

  // Validate salary range
  const minSalary = salaryMin ? Number.parseInt(salaryMin) : null
  const maxSalary = salaryMax ? Number.parseInt(salaryMax) : null

  if (minSalary && maxSalary && minSalary > maxSalary) {
    return { error: "Minimum salary cannot be greater than maximum salary" }
  }

  // Validate application method
  if (!applicationEmail && !applicationUrl) {
    return { error: "Please provide either an application email or URL" }
  }

  try {
    const { data, error } = await supabase.from("jobs").insert({
      title,
      company,
      location,
      job_type: jobType,
      salary_min: minSalary,
      salary_max: maxSalary,
      description,
      requirements: requirements || null,
      benefits: benefits || null,
      application_email: applicationEmail || null,
      application_url: applicationUrl || null,
      user_id: userId,
    })

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to create job posting. Please try again." }
    }

    // Revalidate relevant pages
    revalidatePath("/jobs")
    revalidatePath("/dashboard")

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function getUserJobs(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to fetch jobs" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteJob(jobId: string, userId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId).eq("user_id", userId)

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to delete job" }
    }

    // Revalidate relevant pages
    revalidatePath("/jobs")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function toggleJobStatus(jobId: string, userId: string, isActive: boolean) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("jobs")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", jobId)
      .eq("user_id", userId)

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to update job status" }
    }

    // Revalidate relevant pages
    revalidatePath("/jobs")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}
