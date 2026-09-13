import fitz
from .base_processor import BaseProcessor, ParsedDocument

class PDFProcessor(BaseProcessor):
    def process(self, data, filename):
        doc = fitz.open(stream=data, filetype="pdf")
        pages, texts = [], []
        for i, page in enumerate(doc):
            text = page.get_text()
            pages.append({"page": i + 1, "text": text})
            texts.append(text)
        return ParsedDocument("\n".join(texts), pages, metadata={"pages": len(doc)})
