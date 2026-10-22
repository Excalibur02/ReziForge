import json
from dotenv import load_dotenv
import os
load_dotenv()

class Settings:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_api_url = os.getenv("GEMINI_API_URL")
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

settings = Settings()
