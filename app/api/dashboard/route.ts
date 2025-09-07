import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get user information
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          university: 1,
          yearOfStudy: 1,
          email: 1,
        },
      },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get assessment history
    const assessmentHistory = await db
      .collection("assessments")
      .find({ userId: decoded.userId })
      .sort({ completedAt: -1 })
      .toArray()

    // Get latest assessment
    const latestAssessment = assessmentHistory[0] || null

    const dashboardData = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        yearOfStudy: user.yearOfStudy,
      },
      latestAssessment,
      assessmentHistory,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
