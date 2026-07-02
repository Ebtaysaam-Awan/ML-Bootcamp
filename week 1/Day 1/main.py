"""
Gemini API - First Project
---------------------------
A minimal Python project that demonstrates how to call Google's
Gemini API (free-tier models: gemini-2.0-flash / gemini-2.5-flash)
using your own API key.

Usage:
    1. Put your API key in a file called `.env` (see .env.example)
       or set it as an environment variable named GEMINI_API_KEY.
    2. Run:  python main.py
    3. Type a prompt and press Enter. Type 'exit' to quit.

No paid SDK required — this uses plain `requests` calls to the
Gemini REST API, so it works with just your free API key.
"""

import os
import sys
import json
import requests

# Try to load a .env file if python-dotenv is installed (optional convenience)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# You can switch between "gemini-2.0-flash" and "gemini-2.5-flash"
# depending on what's available on your free-tier key.
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

API_KEY = os.getenv("GEMINI_API_KEY")

BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"


def get_api_key() -> str:
    """Return the API key, prompting the user if it isn't set."""
    key = API_KEY
    if not key:
        key = input("Enter your Gemini API key: ").strip()
    if not key:
        print("Error: No API key provided. Get one for free at "
              "https://aistudio.google.com/app/apikey")
        sys.exit(1)
    return key


def call_gemini(prompt: str, api_key: str, model: str = MODEL_NAME) -> str:
    """
    Send a single text prompt to the Gemini API and return the model's
    text response.
    """
    url = f"{BASE_URL}/{model}:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code != 200:
        raise RuntimeError(
            f"Gemini API error {response.status_code}: {response.text}"
        )

    data = response.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise RuntimeError(f"Unexpected response format: {data}")


def main():
    api_key = get_api_key()

    print(f"\nGemini API Chat — model: {MODEL_NAME}")
    print("Type your message and press Enter. Type 'exit' to quit.\n")

    while True:
        try:
            prompt = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

        if not prompt:
            continue
        if prompt.lower() in ("exit", "quit"):
            print("Goodbye!")
            break

        try:
            reply = call_gemini(prompt, api_key)
            print(f"\nGemini: {reply}\n")
        except Exception as e:
            print(f"\n[Error] {e}\n")


if __name__ == "__main__":
    main()
