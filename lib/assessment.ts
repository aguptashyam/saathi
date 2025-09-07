export interface AssessmentQuestion {
  id: string
  category: "anxiety" | "depression" | "stress" | "sleep" | "social" | "academic"
  question: string
  options: {
    text: string
    value: number
  }[]
}

export interface AssessmentResult {
  _id?: string
  userId: string
  responses: Record<string, number>
  scores: {
    anxiety: number
    depression: number
    stress: number
    sleep: number
    social: number
    academic: number
    overall: number
  }
  riskLevel: "low" | "moderate" | "high" | "crisis"
  recommendations: string[]
  completedAt: Date
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Anxiety Questions (GAD-7 inspired)
  {
    id: "anxiety_1",
    category: "anxiety",
    question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "anxiety_2",
    category: "anxiety",
    question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "anxiety_3",
    category: "anxiety",
    question: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },

  // Depression Questions (PHQ-9 inspired)
  {
    id: "depression_1",
    category: "depression",
    question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "depression_2",
    category: "depression",
    question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "depression_3",
    category: "depression",
    question:
      "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },

  // Stress Questions
  {
    id: "stress_1",
    category: "stress",
    question:
      "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: [
      { text: "Never", value: 0 },
      { text: "Almost never", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Fairly often", value: 3 },
      { text: "Very often", value: 4 },
    ],
  },
  {
    id: "stress_2",
    category: "stress",
    question:
      "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    options: [
      { text: "Very often", value: 0 },
      { text: "Fairly often", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Almost never", value: 3 },
      { text: "Never", value: 4 },
    ],
  },

  // Academic Stress
  {
    id: "academic_1",
    category: "academic",
    question: "How often do you feel overwhelmed by your academic workload?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Always", value: 4 },
    ],
  },
  {
    id: "academic_2",
    category: "academic",
    question: "How often do you worry about your academic performance?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Always", value: 4 },
    ],
  },

  // Sleep Questions
  {
    id: "sleep_1",
    category: "sleep",
    question: "Over the past month, how would you rate your sleep quality overall?",
    options: [
      { text: "Very good", value: 0 },
      { text: "Fairly good", value: 1 },
      { text: "Fairly bad", value: 2 },
      { text: "Very bad", value: 3 },
    ],
  },
  {
    id: "sleep_2",
    category: "sleep",
    question: "How often do you have trouble falling asleep or staying asleep?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Always", value: 4 },
    ],
  },

  // Social Support
  {
    id: "social_1",
    category: "social",
    question: "How satisfied are you with the support you receive from friends?",
    options: [
      { text: "Very satisfied", value: 0 },
      { text: "Satisfied", value: 1 },
      { text: "Neutral", value: 2 },
      { text: "Dissatisfied", value: 3 },
      { text: "Very dissatisfied", value: 4 },
    ],
  },
  {
    id: "social_2",
    category: "social",
    question: "How often do you feel lonely or isolated?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Always", value: 4 },
    ],
  },
]

export function calculateAssessmentScores(responses: Record<string, number>): AssessmentResult["scores"] {
  const categories = ["anxiety", "depression", "stress", "sleep", "social", "academic"]
  const scores: any = {}

  categories.forEach((category) => {
    const categoryQuestions = assessmentQuestions.filter((q) => q.category === category)
    const categoryResponses = categoryQuestions.map((q) => responses[q.id] || 0)
    const maxPossibleScore = categoryQuestions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.value)), 0)
    const actualScore = categoryResponses.reduce((sum, score) => sum + score, 0)

    // Normalize to 0-100 scale
    scores[category] = maxPossibleScore > 0 ? Math.round((actualScore / maxPossibleScore) * 100) : 0
  })

  // Calculate overall score (weighted average)
  const weights = { anxiety: 0.2, depression: 0.2, stress: 0.15, sleep: 0.15, social: 0.15, academic: 0.15 }
  scores.overall = Math.round(
    Object.entries(weights).reduce((sum, [category, weight]) => sum + scores[category] * weight, 0),
  )

  return scores
}

export function determineRiskLevel(scores: AssessmentResult["scores"]): AssessmentResult["riskLevel"] {
  const { anxiety, depression, overall } = scores

  // Crisis level indicators
  if (anxiety >= 80 || depression >= 80 || overall >= 75) {
    return "crisis"
  }

  // High risk
  if (anxiety >= 60 || depression >= 60 || overall >= 60) {
    return "high"
  }

  // Moderate risk
  if (anxiety >= 40 || depression >= 40 || overall >= 40) {
    return "moderate"
  }

  // Low risk
  return "low"
}

export function generateRecommendations(
  scores: AssessmentResult["scores"],
  riskLevel: AssessmentResult["riskLevel"],
): string[] {
  const recommendations: string[] = []

  // Crisis recommendations
  if (riskLevel === "crisis") {
    recommendations.push("Seek immediate professional help from a counselor or therapist")
    recommendations.push("Contact your campus counseling center or crisis hotline")
    recommendations.push("Reach out to a trusted friend, family member, or support person")
    recommendations.push("Consider visiting the emergency room if you have thoughts of self-harm")
  }

  // High risk recommendations
  if (riskLevel === "high" || riskLevel === "crisis") {
    recommendations.push("Schedule an appointment with a mental health professional")
    recommendations.push("Consider joining a support group on campus")
    recommendations.push("Explore therapy options through your student health services")
  }

  // Specific category recommendations
  if (scores.anxiety >= 50) {
    recommendations.push("Practice deep breathing and mindfulness exercises")
    recommendations.push("Try progressive muscle relaxation techniques")
    recommendations.push("Limit caffeine intake, especially in the afternoon")
  }

  if (scores.depression >= 50) {
    recommendations.push("Maintain a regular daily routine and sleep schedule")
    recommendations.push("Engage in physical activity, even light exercise like walking")
    recommendations.push("Connect with friends and family regularly")
  }

  if (scores.stress >= 50) {
    recommendations.push("Practice time management and prioritization techniques")
    recommendations.push("Break large tasks into smaller, manageable steps")
    recommendations.push("Set realistic goals and expectations for yourself")
  }

  if (scores.sleep >= 50) {
    recommendations.push("Establish a consistent bedtime routine")
    recommendations.push("Avoid screens for at least 1 hour before bed")
    recommendations.push("Create a comfortable, dark, and quiet sleep environment")
  }

  if (scores.social >= 50) {
    recommendations.push("Join clubs or organizations that interest you")
    recommendations.push("Attend campus social events and activities")
    recommendations.push("Consider volunteering to meet like-minded people")
  }

  if (scores.academic >= 50) {
    recommendations.push("Visit your academic advisor to discuss course load")
    recommendations.push("Utilize campus tutoring and academic support services")
    recommendations.push("Practice effective study techniques and time management")
  }

  // General wellness recommendations for all levels
  if (riskLevel !== "crisis") {
    recommendations.push("Maintain regular exercise and healthy eating habits")
    recommendations.push("Practice self-care activities that you enjoy")
    recommendations.push("Consider keeping a mood or gratitude journal")
  }

  return recommendations
}
