"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, AlertTriangle, Brain, Activity } from "lucide-react"

interface AdminDashboardData {
  stats: {
    totalUsers: number
    totalAssessments: number
    highRiskUsers: number
    crisisUsers: number
    activeToday: number
  }
  recentAssessments: Array<{
    _id: string
    userId: string
    userName: string
    riskLevel: string
    completedAt: string
    scores: Record<string, number>
  }>
  highRiskUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    university: string
    latestRiskLevel: string
    lastAssessment: string
  }>
  riskDistribution: Record<string, number>
}

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const adminData = await response.json()
          setData(adminData)
        } else {
          throw new Error("Failed to fetch admin data")
        }
      } catch (error) {
        console.error("Admin dashboard error:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load admin data</p>
          <Button onClick={() => router.push("/admin/login")} className="mt-4">
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-xl font-bold text-emerald-900">Saathi Admin Portal</h1>
                <p className="text-sm text-gray-600">Mental Health Platform Administration</p>
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
        {data.stats.crisisUsers > 0 && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Crisis Alert:</strong> {data.stats.crisisUsers} student(s) currently at crisis risk level.
              Immediate intervention may be required.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Total Users</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{data.stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Assessments</CardTitle>
              <Brain className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{data.stats.totalAssessments}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{data.stats.highRiskUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Crisis Level</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{data.stats.crisisUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Active Today</CardTitle>
              <Activity className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{data.stats.activeToday}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-emerald-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-100">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-100">
              User Management
            </TabsTrigger>
            <TabsTrigger value="assessments" className="data-[state=active]:bg-emerald-100">
              Assessments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-100">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Risk Distribution */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Risk Level Distribution</CardTitle>
                  <CardDescription>Current risk levels across all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(data.riskDistribution).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskLevelColor(level)}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Badge>
                        </div>
                        <span className="font-medium">{count} users</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* High Risk Users */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">High Risk Users</CardTitle>
                  <CardDescription>Users requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.highRiskUsers.length > 0 ? (
                    <div className="space-y-3">
                      {data.highRiskUsers.slice(0, 5).map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-orange-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-orange-700">{user.university}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getRiskLevelColor(user.latestRiskLevel)}>{user.latestRiskLevel}</Badge>
                            <p className="text-xs text-orange-600 mt-1">
                              {new Date(user.lastAssessment).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No high-risk users currently</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">User Management</CardTitle>
                <CardDescription>Manage student accounts and access</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Last Assessment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.highRiskUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.university}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Badge className={getRiskLevelColor(user.latestRiskLevel)}>{user.latestRiskLevel}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.lastAssessment).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="border-emerald-200 bg-transparent">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Recent Assessments</CardTitle>
                <CardDescription>Latest mental health assessments submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentAssessments.map((assessment) => (
                      <TableRow key={assessment._id}>
                        <TableCell className="font-medium">{assessment.userName}</TableCell>
                        <TableCell>
                          <Badge className={getRiskLevelColor(assessment.riskLevel)}>{assessment.riskLevel}</Badge>
                        </TableCell>
                        <TableCell>{assessment.scores.overall}/100</TableCell>
                        <TableCell>{new Date(assessment.completedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="border-emerald-200 bg-transparent">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Platform Usage</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Registrations</span>
                    <span className="text-lg font-bold text-emerald-900">{data.stats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assessments Completed</span>
                    <span className="text-lg font-bold text-emerald-900">{data.stats.totalAssessments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users Today</span>
                    <span className="text-lg font-bold text-emerald-900">{data.stats.activeToday}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">System Health</CardTitle>
                  <CardDescription>Platform status and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm">Database: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm">Authentication: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm">Assessment Engine: Operational</span>
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
