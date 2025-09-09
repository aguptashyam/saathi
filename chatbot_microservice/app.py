from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# Conversation memory
conversation_history = []

def get_gemini_response(user_message, conversation_context):
    """Generate a mental health focused response using Google Gemini"""

    # Create context-aware prompt
    system_prompt = """You are Saathi, an empathetic AI mental health companion. You provide supportive, non-judgmental responses to help users with their mental health concerns.

Guidelines for your responses:
- Be warm, empathetic, and compassionate
- Validate the user's feelings without judgment
- Listen actively and encourage sharing
- Provide practical coping strategies when appropriate
- Recognize when someone might need professional help
- Never diagnose conditions or prescribe medication
- Focus on emotional support and positive reinforcement
- If you detect signs of crisis or self-harm, strongly recommend professional help
- Keep responses conversational and natural
- Maintain user privacy and confidentiality

Important: If someone expresses suicidal thoughts, self-harm, or severe distress, provide crisis resources:
- In the US: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line)
- Encourage immediate professional help

Current conversation context:
{context}

User's message: {message}

Respond as a caring mental health companion:"""

    # Build conversation context
    context = ""
    if conversation_context:
        recent_messages = conversation_context[-5:]  # Last 5 messages for context
        context = "\n".join([f"User: {msg}" for msg in recent_messages])

    # Create the full prompt
    full_prompt = system_prompt.format(context=context, message=user_message)

    try:
        # Generate response using Gemini
        response = model.generate_content(full_prompt)

        # Clean up the response
        generated_text = response.text.strip()

        # Remove any unwanted formatting
        generated_text = generated_text.replace("**", "").replace("*", "")

        return generated_text

    except Exception as e:
        print(f"Error generating Gemini response: {e}")
        return "I'm here to listen and support you. Could you tell me more about what's on your mind?"

@app.route("/chat", methods=["POST"])
def chat():
    global conversation_history

    data = request.json
    messages = data.get("messages", [])
    if not messages or not isinstance(messages, list):
        return jsonify({"error": "Invalid messages format"}), 400

    # Get the last user message
    user_message = messages[-1].get("content", "").strip()

    if not user_message:
        return jsonify({"response": "I didn't catch that. Could you please repeat what you said?"})

    # Add current message to history
    conversation_history.append(user_message)
    if len(conversation_history) > 20:  # Keep only last 20 messages
        conversation_history[:] = conversation_history[-20:]

    # Generate response using Gemini
    reply = get_gemini_response(user_message, conversation_history)

    return jsonify({"response": reply})

@app.route("/assessment", methods=["POST"])
def get_assessment():
    """Get mental health assessment for the current conversation"""
    if not conversation_history:
        return jsonify({
            "assessment": "No conversation history available for assessment.",
            "conversation_length": 0,
            "average_severity_score": 0.0,
            "detected_concerns": [],
            "recommendations": ["Start a conversation to get personalized assessment"]
        })

    # Use Gemini to analyze the conversation
    analysis_prompt = f"""Analyze this conversation for mental health concerns and provide a brief assessment:

Conversation:
{"\n".join([f"User: {msg}" for msg in conversation_history])}

Please provide a JSON response with:
- severity_level: "LOW_CONCERN", "MODERATE_CONCERN", "HIGH_CONCERN", or "CRISIS"
- detected_concerns: array of main concerns identified
- recommendations: array of suggested actions
- summary: brief summary of the analysis

Respond only with valid JSON:"""

    try:
        response = model.generate_content(analysis_prompt)
        analysis_text = response.text.strip()

        # Try to parse as JSON
        try:
            analysis = json.loads(analysis_text)
        except json.JSONDecodeError:
            # Fallback analysis if JSON parsing fails
            analysis = {
                "severity_level": "MODERATE_CONCERN",
                "detected_concerns": ["General mental health discussion"],
                "recommendations": ["Continue the conversation", "Consider professional support if needed"],
                "summary": "User is engaging in mental health discussion"
            }

        return jsonify({
            "conversation_length": len(conversation_history),
            "assessment": analysis.get("summary", "Analysis completed"),
            "severity_level": analysis.get("severity_level", "MODERATE_CONCERN"),
            "detected_concerns": analysis.get("detected_concerns", []),
            "recommendations": analysis.get("recommendations", [])
        })

    except Exception as e:
        print(f"Error in assessment: {e}")
        return jsonify({
            "assessment": "Unable to complete assessment at this time.",
            "conversation_length": len(conversation_history),
            "average_severity_score": 0.0,
            "detected_concerns": [],
            "recommendations": ["Please continue the conversation"]
        })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "saathi-chatbot"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
