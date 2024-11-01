import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    MTA_API_KEY = os.getenv("MTA_API_KEY")
