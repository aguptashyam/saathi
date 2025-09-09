import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Checking environment variables...")
print(f"GEMINI_API_KEY exists: {os.getenv('GEMINI_API_KEY') is not None}")
print(f"GEMINI_API_KEY length: {len(os.getenv('GEMINI_API_KEY', ''))}")

# Try to import and configure Gemini
try:
    import google.generativeai as genai
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        print("✅ Gemini API configured successfully")
        model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini model initialized successfully")
    else:
        print("❌ GEMINI_API_KEY not found")
except Exception as e:
    print(f"❌ Error configuring Gemini: {e}")
