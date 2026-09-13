from .pdf_processor import PDFProcessor
from .docx_processor import DOCXProcessor
from .pptx_processor import PPTXProcessor
from .xlsx_processor import XLSXProcessor
from .csv_processor import CSVProcessor
from .text_processor import TextProcessor
from .json_processor import JSONProcessor
from .image_processor import ImageProcessor

MAPPING = {
 ".pdf": PDFProcessor, ".docx": DOCXProcessor, ".pptx": PPTXProcessor,
 ".xlsx": XLSXProcessor, ".csv": CSVProcessor, ".txt": TextProcessor,
 ".md": TextProcessor, ".json": JSONProcessor, ".png": ImageProcessor,
 ".jpg": ImageProcessor, ".jpeg": ImageProcessor, ".webp": ImageProcessor,
}
def get_processor(ext):
    if ext not in MAPPING:
        raise ValueError(f"Unsupported extension: {ext}")
    return MAPPING[ext]()
