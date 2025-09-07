import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  _id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  university: string
  yearOfStudy: string
  studentId?: string
  role?: "student" | "admin" | "counselor"
  createdAt: Date
  lastLogin?: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await hashPassword(userData.password)
  const user: User = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return { ...user, _id: result.insertedId.toString() }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  // Update last login
  await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

  return user
}

export function generateAdminToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyAdminToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    if (decoded.role === "admin" || decoded.role === "counselor") {
      return decoded
    }
    return null
  } catch {
    return null
  }
}

export async function createAdminUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await hashPassword(userData.password)
  const user: User = {
    ...userData,
    password: hashedPassword,
    role: userData.role || "admin",
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return { ...user, _id: result.insertedId.toString() }
}
