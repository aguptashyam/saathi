"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Brain,
  Users,
  Phone,
  BookOpen,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Shield,
  MessageCircle,
  Activity,
} from "lucide-react"

interface DashboardData {
  user: {
    firstName: string
    lastName: string
    university: string
    yearOfStudy: string
  }
  latestAssessment?: {
    scores: Record<string, number>
    riskLevel: string
    recommendations: string[]
    completedAt: string
  }
  assessmentHistory: Array<{
    _id: string
    scores: Record<string, number>
    riskLevel: string
    completedAt: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)
        } else {
          throw new Error("Failed to fetch dashboard data")
        }
      } catch (error) {
        console.error("Dashboard error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load dashboard data</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "crisis":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-xl font-bold text-emerald-900">Welcome back, {data.user.firstName}</h1>
                <p className="text-sm text-gray-600">
                  {data.user.university} • {data.user.yearOfStudy}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-emerald-200 bg-transparent">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crisis Alert */}
        {data.latestAssessment?.riskLevel === "crisis" && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Immediate Support Available:</strong> Your recent assessment indicates you may benefit from
              immediate professional support. Please contact the crisis hotline at 988 or visit your campus counseling
              center.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-emerald-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-100">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-emerald-100">
              Progress
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-emerald-100">
              Resources
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-emerald-100">
              Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Latest Assessment */}
              {data.latestAssessment ? (
                <Card className="border-emerald-200 col-span-full lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-900">Latest Assessment Results</CardTitle>
                      <Badge className={getRiskLevelColor(data.latestAssessment.riskLevel)}>
                        {data.latestAssessment.riskLevel.charAt(0).toUpperCase() +
                          data.latestAssessment.riskLevel.slice(1)}{" "}
                        Risk
                      </Badge>
                    </div>
                    <CardDescription>
                      Completed on {new Date(data.latestAssessment.completedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(data.latestAssessment.scores)
                        .filter(([key]) => key !== "overall")
                        .map(([category, score]) => (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize font-medium">{category}</span>
                              <span className="text-gray-600">{score}/100</span>
                            </div>
                            <Progress value={score as number} className="h-2" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-emerald-200 col-span-full lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-emerald-900">Take Your First Assessment</CardTitle>
                    <CardDescription>Get personalized insights into your mental health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => router.push("/assessment")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-emerald-200 bg-transparent"
                    onClick={() => router.push("/assessment")}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    New Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Counseling
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Support Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 bg-transparent">
                    <Phone className="mr-2 h-4 w-4" />
                    Crisis Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Personalized Recommendations */}
            {data.latestAssessment?.recommendations && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Personalized Recommendations</CardTitle>
                  <CardDescription>Based on your latest assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {data.latestAssessment.recommendations.slice(0, 6).map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-emerald-900">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Assessment History</CardTitle>
                <CardDescription>Track your mental health journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                {data.assessmentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {data.assessmentHistory.slice(0, 5).map((assessment, index) => (
                      <div key={assessment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">Assessment #{data.assessmentHistory.length - index}</span>
                          </div>
                          <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                            {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Overall: {assessment.scores.overall}/100</span>
                          <span>{new Date(assessment.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No assessment history yet</p>
                    <Button
                      onClick={() => router.push("/assessment")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Take Your First Assessment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Self-Help Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Mindfulness Exercises
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Breathing Techniques
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Sleep Hygiene Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Stress Management
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Campus Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Counseling Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Support Groups
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Peer Counselors
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-emerald-200 bg-transparent">
                    Academic Support
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Crisis Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 bg-transparent">
                    <Phone className="mr-2 h-4 w-4" />
                    Crisis Hotline: 988
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 bg-transparent">
                    Campus Emergency
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 bg-transparent">
                    24/7 Text Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Professional Support</CardTitle>
                  <CardDescription>Connect with licensed mental health professionals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Counseling Session
                  </Button>
                  <Button variant="outline" className="w-full border-emerald-200 bg-transparent">
                    <Users className="mr-2 h-4 w-4" />
                    Find Support Groups
                  </Button>
                  <Button variant="outline" className="w-full border-emerald-200 bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Peer Counselor
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Emergency Contacts</CardTitle>
                  <CardDescription>Available 24/7 for immediate support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900 mb-2">Crisis Support</h4>
                    <p className="text-sm text-red-800 mb-3">
                      If you're having thoughts of self-harm or suicide, please reach out immediately:
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full border-red-300 text-red-700 bg-transparent">
                        <Phone className="mr-2 h-4 w-4" />
                        National Suicide Prevention Lifeline: 988
                      </Button>
                      <Button variant="outline" className="w-full border-red-300 text-red-700 bg-transparent">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Crisis Text Line: Text HOME to 741741
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
