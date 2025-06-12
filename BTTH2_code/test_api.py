import requests
import json

def test_chatbot():
    url = "http://localhost:8001/chat"
    
    test_messages = [
        "xin chào",
        "giá nhà ở Quận 7",
        "dự án Vinhomes",
        "tư vấn đầu tư",
        "cho thuê căn hộ"
    ]
    
    for message in test_messages:
        print(f"\n🧪 Testing: '{message}'")
        
        try:
            response = requests.post(url, json={
                "query": message,
                "conversation_id": "test-123"
            }, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Success: {data['answer'][:100]}...")
                print(f"📊 Confidence: {data['confidence']}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_chatbot()