
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const userMessage = messages[messages.length - 1].content

    // Forward the request to the local Python microservice
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Microservice API error:", error)
      return NextResponse.json(
        { error: "Error from chatbot microservice. Please try again later." },
        { status: 500 }
      )
    }

    const data = await response.json()
    const generatedText = data.response || "Sorry, I couldn't generate a response."

    return NextResponse.json({ response: generatedText })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json(
      { error: "I'm sorry, I'm having trouble connecting right now. Please try again later or reach out to a human counselor." },
      { status: 500 }
    )
  }
}
