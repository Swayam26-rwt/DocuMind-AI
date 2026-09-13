from dataclasses import dataclass, field

@dataclass
class ParsedDocument:
    text: str
    pages: list[dict] = field(default_factory=list)
    tables: list[dict] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

class BaseProcessor:
    def process(self, data: bytes, filename: str) -> ParsedDocument:
        raise NotImplementedError
