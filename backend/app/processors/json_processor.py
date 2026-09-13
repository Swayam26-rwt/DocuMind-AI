import json
from .base_processor import BaseProcessor, ParsedDocument
class JSONProcessor(BaseProcessor):
    def process(self, data, filename):
        obj = json.loads(data.decode("utf-8"))
        return ParsedDocument(json.dumps(obj, indent=2, ensure_ascii=False))
