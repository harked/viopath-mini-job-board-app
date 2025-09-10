"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/app/actions/profile-actions"

interface ProfileFormProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string
    company?: string
    bio?: string
    website?: string
  } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateProfile(formData, user.id)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
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
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and professional details</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-slate-50 border-slate-300"
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-700">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Enter your full name"
                defaultValue={profile?.full_name || ""}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-700">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Your company name"
                defaultValue={profile?.company || ""}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-slate-700">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
                defaultValue={profile?.website || ""}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself and your professional background..."
              rows={4}
              defaultValue={profile?.bio || ""}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Profile updated successfully!
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
