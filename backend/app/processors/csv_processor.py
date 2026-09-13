from io import BytesIO
import pandas as pd
from .base_processor import BaseProcessor, ParsedDocument

class CSVProcessor(BaseProcessor):
    def process(self, data, filename):
        df = pd.read_csv(BytesIO(data))
        return ParsedDocument(df.to_csv(index=False), metadata={"rows": len(df), "columns": list(df.columns)})
