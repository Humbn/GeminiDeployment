from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gemini import generate_chat_response

app = FastAPI(title="Gemini Chatbot API")

# COMMENT
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # ADD Deploy Origins
]

# COMMENT
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# COMMENT
class ChatRequest(BaseModel):
    message: str

# COMMENT
class ChatResponse(BaseModel):
    reply: str


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Simple chat endpoint:
    - input: { "message": "hello" }
    - output: { "reply": "Hi! I'm a Gemini-based bot..." }
    """
    # COMMENT
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # COMMENT
    reply = generate_chat_response(
        user_message=req.message,
        # TODO
        system_prompt="You are a friendly full-stack development assistant.",
    )

    # COMMENT
    if reply.startswith("Error talking to Gemini:"):
        # Map internal error into a 500 for the client
        raise HTTPException(status_code=500, detail=reply)

    return ChatResponse(reply=reply)


@app.get("/")
def root():
    return {"status": "ok", "message": "Gemini chatbot backend is running."}
