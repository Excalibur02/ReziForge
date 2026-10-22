"""
pdf_generator.py
Utility to generate an ATS-friendly PDF from a TailoredResume object using HTML and Playwright.
"""
import os
from jinja2 import Environment, FileSystemLoader
from playwright.sync_api import sync_playwright
from src.models.models import TailoredResume
from src.utils.extractPdf import pdfExtractor
from src.utils.resumeLLMHandler import ResumeLLMHandler
from src.config.logging import logger

def process_resume_strings(data):
    """Recursively processes all strings in the data."""
    import re
    if isinstance(data, dict):
        return {k: process_resume_strings(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [process_resume_strings(item) for item in data]
    elif isinstance(data, str):
        return pdfExtractor.clean_text(data)
    return data

class ResumePDFGenerator:
    def __init__(self, resume: TailoredResume):
        logger.info("Initializing ResumePDFGenerator")
        # Process all strings in the resume object
        resume_dict = resume.model_dump()
        formatted_dict = process_resume_strings(resume_dict)
        self.resume = TailoredResume(**formatted_dict)

        # Set up Jinja2 environment
        template_dir = os.path.join(os.path.dirname(__file__), "templates")
        self.env = Environment(loader=FileSystemLoader(template_dir))
        # Updated to use the recently created resume_basic_3.html template
        self.template_name = "resume_basic.html"
        
    def render_html(self) -> str:
        """Renders the resume data into the HTML template."""
        template = self.env.get_template(self.template_name)
        return template.render(resume=self.resume)

    def generate(self, output_path: str):
        """Generates the PDF using Playwright with auto-scaling."""
        html_content = self.render_html()
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            page.set_content(html_content, wait_until="networkidle")

            # 🔥 Step 1: Measure content height
            content_height = page.evaluate("""
                    () => {
                        const body = document.body;
                        const html = document.documentElement;
                        return Math.max(
                            body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight
                        );
                    }
                """)

            # A4 usable height (in px, tuned experimentally)
            A4_HEIGHT = 1040  

            # 🔥 Step 2: Compute scale dynamically
            scale = A4_HEIGHT / content_height

            # Clamp scale (VERY IMPORTANT)
            # scale = max(0.85, min(scale, 1.20))
            scale = 1.0

            print(f"[AutoScale] Content height: {content_height}px | Scale: {scale:.2f}")

            # 🔥 Step 3: Generate PDF
            page.pdf(
                path=output_path,
                format="A4",
                print_background=True,
                scale=scale,
                margin={
                    "top": "10mm",
                    "right": "10mm",
                    "bottom": "10mm",
                    "left": "10mm"
                },
                prefer_css_page_size=True
            )
            
            browser.close()

def generate_pdf(resume: TailoredResume, output_path: str):
    """
    Helper function to generate the PDF using the ResumePDFGenerator class.
    """
    generator = ResumePDFGenerator(resume)
    generator.generate(output_path)

def generate_pdf_from_json(json_file_path: str, output_path: str):
    """
    Directly parses a JSON file and generates a PDF without making any LLM calls.
    """
    import json
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    resume = TailoredResume(**data)
    generate_pdf(resume, output_path)

# if __name__ == "__main__":
#     import json
#     resume_data_loader = ResumeLLMHandler()
#     # pdf_file = "Sneha Prasad.pdf"
#     # pdf_file = "Dhruv Sharma.pdf"
#     # pdf_file = "Harshit gupta.pdf"
#     pdf_file = "Dhruv_Resume.pdf"
#     file_name = pdf_file.split(".")[0]
    
#     # This returns a JSON string of a ResumeParsed object
#     resume_json_str = resume_data_loader.resume_json(pdf_file)
#     resume_dict = json.loads(resume_json_str)

#     jd_text = ""
#     enhanced_resume = resume_data_loader.enhance_resume(resume_dict, jd_text)
    
#     if enhanced_resume:
#         print("Enhanced Resume : \n", enhanced_resume)
#         with open(f"{file_name}.json", "w") as file:
#             json.dump(enhanced_resume.model_dump(), file, indent=4)
        
#         # Ensure templates dir exists in case the user runs this raw
#         os.makedirs(os.path.join(os.path.dirname(__file__), "templates"), exist_ok=True)
        
#         generate_pdf(enhanced_resume, f"{file_name}_enhanced_resume.pdf")
#         print("PDF generated successfully using Playwright!")
#     else:
#         print("Failed to enhance resume. Check API logs.")

if __name__ == "__main__":
    generate_pdf_from_json("E:/ResumeBuilder/Backend/resumes/simran.json", "Simran_resume.pdf")