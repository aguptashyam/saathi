import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { responses, scores, riskLevel, recommendations } = body

    const { db } = await connectToDatabase()

    const assessmentResult = {
      userId: decoded.userId,
      responses,
      scores,
      riskLevel,
      recommendations,
      completedAt: new Date(),
    }

    const result = await db.collection("assessments").insertOne(assessmentResult)

    return NextResponse.json({
      message: "Assessment submitted successfully",
      result: { ...assessmentResult, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Assessment submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
