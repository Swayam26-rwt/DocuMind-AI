from app.core.config import settings

class GeminiClient:
    def __init__(self):
        self.client = None
        if settings.gemini_api_key:
            from google import genai
            self.client = genai.Client(api_key=settings.gemini_api_key)

    def generate(self, prompt: str) -> str:
        if not self.client:
            raise RuntimeError("GEMINI_API_KEY is not configured")
        response = self.client.models.generate_content(
            model=settings.gemini_model, contents=prompt
        )
        return response.text or ""
