# ReziFORGE : AI-Powered ATS Resume Tailor

An AI-powered resume enhancement tool that transforms an existing resume into a **job-specific, ATS-friendly resume** by analyzing the candidate’s experience, skills, and projects against a target Job Description (JD).

The application takes an existing resume and a job description as input, uses an LLM to tailor the resume content, and generates a professionally formatted PDF designed to highlight the most relevant qualifications for the target role.

## Overview

Applying for different jobs often requires manually updating a resume to match each job's requirements. This project automates that process by using Generative AI to customize resume content while preserving the candidate's actual background and achievements.

### How It Works

1. **Upload Existing Resume** — Provide your current resume in PDF format.
2. **Provide Job Description** — Paste the job description for the position you're targeting.
3. **Extract Resume Information** — Parse the existing resume into structured data.
4. **AI-Powered Tailoring** — Use an LLM to analyze the resume against the JD and prioritize relevant skills, experience, projects, and qualifications.
5. **Generate Tailored Resume** — Populate a structured resume template with the enhanced content.
6. **Export PDF** — Generate a professionally formatted resume ready for review and submission.

## Key Features

- **Job-Specific Resume Tailoring:** Aligns resume content with the skills, qualifications, and responsibilities mentioned in the target JD.
- **AI-Powered Content Enhancement:** Improves summaries, experience descriptions, and project bullet points for clarity, relevance, and impact.
- **ATS-Friendly Formatting:** Uses a clean, structured layout with conventional section headings and readable text.
- **Structured Resume Data:** Organizes candidate information, education, experience, projects, skills, achievements, and extracurricular activities into a consistent schema.
- **Dynamic Resume Sections:** Renders sections conditionally based on available information, avoiding unnecessary empty sections.
- **PDF Generation:** Converts HTML templates into a polished PDF using Jinja2 and Playwright.
- **Candidate Information Preservation:** Aims to retain the candidate's original details while tailoring the presentation to the target role.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python |
| AI / LLM Integration | Large Language Models (LLMs) |
| Prompt Engineering | JD-aware resume enhancement prompts |
| Template Engine | Jinja2 |
| PDF Generation | Playwright |
| Input Processing | PDF resume parsing and structured data extraction |
| Output Format | PDF |

## Resume Sections

The generated resume can include:

1. Contact Details
2. Professional Summary
3. Education
4. Experience — displayed when available
5. Projects
6. Achievements — displayed when available
7. Extra-curricular Activities — displayed when available

Skills and relevant technical keywords can be incorporated into the resume content according to the candidate's existing profile and the target JD.

## Project Workflow

```text
Existing Resume (PDF) + Job Description
                  |
                  v
        Resume Text Extraction
                  |
                  v
       Structured Resume Data
                  |
                  v
     LLM-Based Resume Enhancement
                  |
                  v
       Tailored Resume JSON
                  |
                  v
       Jinja2 HTML Template
                  |
                  v
        Playwright PDF Export
                  |
                  v
          Tailored Resume
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Access to a supported LLM API
- Required API credentials configured through environment variables

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   ```

   Windows:

   ```bash
   venv\Scripts\activate
   ```

   macOS/Linux:

   ```bash
   source venv/bin/activate
   ```

3. Install the project dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Install the browser dependencies required by Playwright:

   ```bash
   playwright install chromium
   ```

5. Configure the required API credentials using environment variables or your project's configuration mechanism.

6. Start the application using the entry point configured in your repository.

## Input and Output

**Input**
- An existing resume, typically in PDF format.
- A target job description in text format.

**Output**
- A tailored resume containing job-relevant content.
- A professionally formatted PDF generated from the resume data.

## Design Principles

- **Relevance over keyword stuffing:** Prioritize genuinely relevant skills and experience instead of inserting keywords unnaturally.
- **Factual accuracy:** Do not fabricate qualifications, work experience, skills, metrics, or achievements.
- **Readable formatting:** Use conventional section headings, clear typography, and consistent spacing.
- **Content preservation:** Retain important candidate details while improving how they are presented.
- **Human review:** Treat AI-generated changes as suggestions and review the final resume before submission.

## Limitations

- Resume tailoring quality depends on the quality of the original resume, the target JD, and the LLM response.
- PDF text extraction may be less reliable for scanned documents or complex layouts.
- ATS compatibility varies across recruitment platforms; ATS-friendly formatting does not guarantee a particular score or interview.
- Generated content should be reviewed for factual correctness before use.

## Future Enhancements

- Interactive resume editing before PDF export.
- Multiple professional resume templates.
- Resume-to-JD relevance analysis and skill-gap reporting.
- Support for DOCX input and output.
- Automated checks for missing information, formatting consistency, and unsupported claims.
- Side-by-side comparison of the original and tailored resumes.

## Disclaimer

This project assists with resume customization and formatting. It does not guarantee ATS ranking, interview selection, or employment outcomes. Candidates should verify all generated content before submitting their resumes.

---

**Built to make job-specific resume customization faster, more consistent, and easier to manage.**