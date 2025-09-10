import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, Users, MapPin, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              id="logo"
              href="/"
              className="flex items-center space-x-2"
              aria-label="VioPath Home"
            >
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">VioPath</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Find Your Next <span className="text-blue-600">Dream Job</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and ambitions. Start your
            career journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Why Choose Our Job Board?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Quality Employers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with verified companies and startups looking for talented professionals like you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Remote & Local</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find opportunities both in your local area and remote positions from around the world.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Fresh Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  New job postings added daily. Be the first to apply to the latest opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers and employers already using our platform.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/sign-up">Create Your Account</Link>
          </Button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold">VioPath</span>
          </div>
          <p className="text-sm">© 2025 VioPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
