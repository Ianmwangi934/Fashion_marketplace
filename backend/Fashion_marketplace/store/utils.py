import os
from dotenv import load_dotenv
import vonage
from vonage_http_client import HttpClient
from vonage_sms import Sms
import base64
from pydantic import BaseModel, Field


load_dotenv()

class BasicAuth:
    def __init__(self, api_key,secret_key):
        self.api_key = api_key
        self.secret_key = secret_key
        self._signature_secret = None
    def get_headers(self):
        credentials = f"{self.api_key}:{self.secret_key}"
        encoded_credetials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
        return {
            "Authorization": f"Basic {encoded_credetials}"
        }
class SmsRequest(BaseModel):
    from_: str = Field(..., alias="from")
    to: str
    text: str

    class Config:
        populate_by_name=True

def send_sms(to, message):
    # Create the BasicAuth manually
    auth = BasicAuth(
        api_key=os.getenv("VONAGE_API_KEY"),
        secret_key=os.getenv("VONAGE_API_SERECT_KEY")  
    )

    # Create the HTTP client
    http_client = HttpClient(auth=auth)

    # Create the SMS instance
    sms = Sms(http_client)

    

    sms_request = SmsRequest(
        from_=os.getenv("VONAGE_VIRTUAL_NUMBER"),
        to=str(to),
        text=message
    )
    payload = sms_request.model_dump(by_alias=True)
    response_data = sms.send(payload)
    if response_data["messages"][0]["status"] == "0":
        print("✅ SMS sent successfully")
    else:
        print("❌ SMS failed:", response_data["messages"][0]["error-text"])