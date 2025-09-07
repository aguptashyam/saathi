"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Heart, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import {
  assessmentQuestions,
  calculateAssessmentScores,
  determineRiskLevel,
  generateRecommendations,
} from "@/lib/assessment"

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  const handleResponse = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const scores = calculateAssessmentScores(responses)
      const riskLevel = determineRiskLevel(scores)
      const recommendations = generateRecommendations(scores, riskLevel)

      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          responses,
          scores,
          riskLevel,
          recommendations,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data.result)
        setCompleted(true)
      } else {
        throw new Error("Failed to submit assessment")
      }
    } catch (error) {
      console.error("Assessment submission error:", error)
      alert("Failed to submit assessment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const currentQuestionData = assessmentQuestions[currentQuestion]
  const currentResponse = responses[currentQuestionData?.id]

  if (completed && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-900">Assessment Complete</h1>
            </div>
            <p className="text-gray-600">Your mental health assessment results</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Your Scores</CardTitle>
                <CardDescription>Scores are on a scale of 0-100 (higher scores indicate more symptoms)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize font-medium">{category}</span>
                      <span className="text-sm text-gray-600">{score}/100</span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card
              className={`border-2 ${
                result.riskLevel === "crisis"
                  ? "border-red-300 bg-red-50"
                  : result.riskLevel === "high"
                    ? "border-orange-300 bg-orange-50"
                    : result.riskLevel === "moderate"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-emerald-300 bg-emerald-50"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`${
                    result.riskLevel === "crisis"
                      ? "text-red-900"
                      : result.riskLevel === "high"
                        ? "text-orange-900"
                        : result.riskLevel === "moderate"
                          ? "text-yellow-900"
                          : "text-emerald-900"
                  }`}
                >
                  Risk Level: {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                </CardTitle>
                <CardDescription>
                  {result.riskLevel === "crisis" && "Immediate attention recommended"}
                  {result.riskLevel === "high" && "Professional support strongly recommended"}
                  {result.riskLevel === "moderate" && "Some support may be beneficial"}
                  {result.riskLevel === "low" && "Continue maintaining good mental health practices"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">Personalized Recommendations:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.slice(0, 5).map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {result.riskLevel === "crisis" && (
            <Alert className="mt-6 border-red-300 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please contact the National
                Suicide Prevention Lifeline at 988 or your local emergency services immediately.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-8 text-center space-y-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              View Dashboard
            </Button>
            <p className="text-sm text-gray-600">
              Your results have been saved securely and can be accessed in your dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-900">Mental Health Assessment</h1>
          </div>
          <p className="text-gray-600">This assessment will help us understand your current mental health status</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-900">{currentQuestionData?.question}</CardTitle>
            <CardDescription>Please select the option that best describes your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentResponse?.toString()}
              onValueChange={(value) => handleResponse(currentQuestionData.id, Number.parseInt(value))}
            >
              <div className="space-y-3">
                {currentQuestionData?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentResponse === undefined || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentQuestion === assessmentQuestions.length - 1 ? (
                  "Complete Assessment"
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your responses are confidential and will be used to provide personalized recommendations
          </p>
        </div>
      </div>
    </div>
  )
}
