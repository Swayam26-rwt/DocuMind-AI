from app.core.config import settings

class EmbeddingService:
    def embed(self, text):
        if not settings.gemini_api_key:
            return None
        from google import genai
        client = genai.Client(api_key=settings.gemini_api_key)
        result = client.models.embed_content(
            model=settings.embedding_model, contents=text
        )
        return result.embeddings[0].values
