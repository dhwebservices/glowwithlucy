import requests
import sys
from datetime import datetime

class CandleAPITester:
    def __init__(self, base_url="https://candle-studio-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        response_data = response.json()
                        print(f"Response: {response_data}")
                    except:
                        print(f"Response text: {response.text[:200]}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}")

            return success, response.json() if response.content and success else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test Customer",
            "email": "test@example.com",
            "candleSize": "9oz",
            "scentPreference": "Vanilla and lavender",
            "message": "I would like to order a custom candle"
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success and response:
            # Verify response structure
            required_fields = ['id', 'name', 'email', 'timestamp', 'status']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            print(f"✅ Contact form response structure is correct")
            return response.get('id')
        return None

    def test_get_contact_submissions(self):
        """Test getting contact submissions"""
        return self.run_test("Get Contact Submissions", "GET", "contact", 200)

    def test_status_endpoint_post(self):
        """Test status endpoint POST"""
        test_data = {
            "client_name": "test_client"
        }
        
        return self.run_test(
            "Status Check POST",
            "POST", 
            "status",
            200,
            data=test_data
        )

    def test_status_endpoint_get(self):
        """Test status endpoint GET"""
        return self.run_test("Status Check GET", "GET", "status", 200)

def main():
    print("🚀 Starting GlowWithLucy API Tests")
    print("=" * 50)
    
    # Setup
    tester = CandleAPITester()

    # Run tests
    print("\n📡 Testing API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status endpoints
    tester.test_status_endpoint_post()
    tester.test_status_endpoint_get()
    
    # Test contact form functionality
    contact_id = tester.test_contact_form_submission()
    tester.test_get_contact_submissions()

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())