from .base_processor import BaseProcessor, ParsedDocument
class ImageProcessor(BaseProcessor):
    def process(self, data, filename):
        return ParsedDocument("", metadata={"requires_vision": True})
