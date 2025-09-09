import requests
import json

def test_chat_endpoint():
    """Test the /chat endpoint with a sample message"""

    # Test data
    test_message = "Hello, I am feeling a bit stressed about work lately"
    payload = {
        "messages": [
            {
                "content": test_message,
                "role": "user"
            }
        ]
    }

    try:
        # Make POST request to /chat endpoint
        response = requests.post(
            "http://localhost:5001/chat",
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Chat endpoint is working!")
            print(f"🤖 AI Response: {response.json().get('response', 'No response')}")
        else:
            print("❌ Chat endpoint returned error")

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to chatbot microservice. Is it running on port 5001?")
    except Exception as e:
        print(f"❌ Error testing chat endpoint: {e}")

def test_health_endpoint():
    """Test the /health endpoint"""

    try:
        response = requests.get("http://localhost:5001/health")

        print(f"\nHealth Check - Status Code: {response.status_code}")
        print(f"Health Response: {response.json()}")

        if response.status_code == 200:
            print("✅ Health endpoint is working!")
        else:
            print("❌ Health endpoint returned error")

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to chatbot microservice. Is it running on port 5001?")
    except Exception as e:
        print(f"❌ Error testing health endpoint: {e}")

if __name__ == "__main__":
    print("🧪 Testing Chatbot Microservice")
    print("=" * 40)

    test_health_endpoint()
    test_chat_endpoint()

    print("\n" + "=" * 40)
    print("Test completed!")
