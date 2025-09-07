import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, university, yearOfStudy, studentId } = body

    // Basic validation
    if (!firstName || !lastName || !email || !password || !university || !yearOfStudy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Create user
    const user = await createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      university,
      yearOfStudy,
      studentId,
    })

    // Generate token
    const token = generateToken(user._id!)

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        yearOfStudy: user.yearOfStudy,
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message === "User already exists with this email") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
