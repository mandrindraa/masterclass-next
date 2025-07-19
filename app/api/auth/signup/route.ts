import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth-server"

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role } = await request.json()

    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["ADMIN", "TEACHER", "STUDENT"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const user = await createUser({ email, name, password, role })

    if (!user) {
      return NextResponse.json({ error: "User creation failed. Email might already exist." }, { status: 400 })
    }

    const token = generateToken(user)

    const response = NextResponse.json({
      user,
      message: "Account created successfully",
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
