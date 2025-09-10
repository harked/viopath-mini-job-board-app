"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData, userId: string) {
  const supabase = await createClient()

  // Extract form data
  const fullName = formData.get("full_name") as string
  const company = formData.get("company") as string
  const bio = formData.get("bio") as string
  const website = formData.get("website") as string

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName || null,
        company: company || null,
        bio: bio || null,
        website: website || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to update profile. Please try again." }
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/profile")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
