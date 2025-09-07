import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyAdminToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyAdminToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid admin token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get platform statistics
    const totalUsers = await db.collection("users").countDocuments({ role: { $ne: "admin" } })
    const totalAssessments = await db.collection("assessments").countDocuments()

    // Get risk level distribution
    const riskDistribution = await db
      .collection("assessments")
      .aggregate([
        {
          $group: {
            _id: "$riskLevel",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    const riskDistributionObj = riskDistribution.reduce(
      (acc, item) => {
        acc[item._id] = item.count
        return acc
      },
      { low: 0, moderate: 0, high: 0, crisis: 0 },
    )

    // Get high risk users
    const highRiskUsers = await db
      .collection("assessments")
      .aggregate([
        { $match: { riskLevel: { $in: ["high", "crisis"] } } },
        { $sort: { completedAt: -1 } },
        {
          $group: {
            _id: "$userId",
            latestRiskLevel: { $first: "$riskLevel" },
            lastAssessment: { $first: "$completedAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            university: "$user.university",
            latestRiskLevel: 1,
            lastAssessment: 1,
          },
        },
        { $limit: 10 },
      ])
      .toArray()

    // Get recent assessments
    const recentAssessments = await db
      .collection("assessments")
      .aggregate([
        { $sort: { completedAt: -1 } },
        { $limit: 20 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            riskLevel: 1,
            scores: 1,
            completedAt: 1,
            userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          },
        },
      ])
      .toArray()

    const stats = {
      totalUsers,
      totalAssessments,
      highRiskUsers: riskDistributionObj.high + riskDistributionObj.crisis,
      crisisUsers: riskDistributionObj.crisis,
      activeToday: 0, // This would require tracking daily active users
    }

    const adminData = {
      stats,
      recentAssessments,
      highRiskUsers,
      riskDistribution: riskDistributionObj,
    }

    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
