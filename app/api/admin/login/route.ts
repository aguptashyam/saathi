import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateAdminToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email.toLowerCase(), password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if user has admin or counselor role
    if (user.role !== "admin" && user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Generate admin token
    const token = generateAdminToken(user._id!.toString(), user.role)

    return NextResponse.json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
