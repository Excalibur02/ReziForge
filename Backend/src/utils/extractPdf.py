import pymupdf4llm
import pathlib
import re
from src.config.logging import logger

class ExtractPdf:
    def __init__(self):
       logger.info("ExtractPdf initialized")


    async def make_md_local(self, pdf_file: str, make_md: bool = True):
        logger.info(f"Extracting markdown from {pdf_file}")
        md_text = pymupdf4llm.to_markdown(pdf_file)
        logger.info(f"Markdown extracted succesfully !")
        md_text = self.clean_text(md_text)
        if make_md:
            pathlib.Path(pdf_file.replace(".pdf", ".md")).write_bytes(md_text.encode())
        return md_text


    async def get_markdown(self, pdf_file: str, make_md: bool = True):
        logger.info(f"Extracting markdown from {pdf_file}")
        md_text = pymupdf4llm.to_markdown(pdf_file)
        logger.info(f"Markdown extracted succesfully !")
        md_text = self.clean_text(md_text)
        if make_md:
            pathlib.Path(pdf_file.replace(".pdf", ".md")).write_bytes(md_text.encode())
        return md_text


    def clean_text(self, raw_text):
        # Remove extra spaces
        filter_map = {
            "\n": " ",
            "\t": " ",
            "\r": " ",
            "  ": " ",
            "\u2019": "'",
            "\u2013" : "-",
            "\u2014" : "--",
            "\u2018" : "'",
            "\u201c" : "\"",
            "\u201d" : "\"",
            "\u2022" : "*",
            "\u2026" : "...",
            "\u2039" : "<",
            "\u203a" : ">"
        }

        for key, value in filter_map.items():
            raw_text = raw_text.replace(key, value)
        
        # Bind phrases in double asterisks with <strong></strong>
        raw_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', raw_text)
        
        return raw_text


pdfExtractor = ExtractPdf()