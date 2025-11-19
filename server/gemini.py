import os
from typing import Optional

from google import genai
from dotenv import load_dotenv

# COMMENT
load_dotenv()

# COMMENT
client = genai.Client()

#COMMENT
MODEL_NAME = "gemini-2.5-flash-lite"  #TODO


def generate_chat_response(user_message: str, system_prompt: Optional[str] = None) -> str:
    """
    Send a simple text message to Gemini and return the text response.
    You can optionally include a system prompt to control behavior.
    """

    # COMMENT
    if not user_message.strip():
        return "Please type something so I can help 🙂"

    # COMMENT
    contents = []
    if system_prompt:
        
        contents.append(f"System: {system_prompt}")
    contents.append(f"User: {user_message}")

    # COMMENT
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents="\n".join(contents),
        )
        # The Python SDK exposes a convenience .text property. :contentReference[oaicite:1]{index=1}
        return response.text or "Sorry, I couldn't generate a response."
    except Exception as e:
        # Log the Error
        return f"Error talking to Gemini: {e}"
