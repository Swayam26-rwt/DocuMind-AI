from .base_processor import BaseProcessor, ParsedDocument
class TextProcessor(BaseProcessor):
    def process(self, data, filename):
        return ParsedDocument(data.decode("utf-8", errors="replace"))
