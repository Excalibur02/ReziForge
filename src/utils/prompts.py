import json

PARSE_RESUME_PROMPT_TEMPLATE = """
You are an expert resume parser. Extract information from the following resume text with exact or suitable values and format it as a JSON object.

Rules for mapping profile links:
- If a link contains "codechef.com", map it to "codechef_profile_link".
- If a link contains "leetcode.com", map it to "leetcode_profile_link".
- If a link contains "codeforces.com", map it to "codeforces_profile_link".
- If a link contains "hackerrank.com", map it to "hackerrank_profile_link".
- If a link contains "github.com", map it to "github".
- If a link contains "linkedin.com", map it to "linkedin".

The JSON schema you must follow is:

{{
    "type": "OBJECT",
    "properties": {{
        "name": {{"type": "STRING"}},
        "email": {{"type": "STRING"}},
        "phone": {{"type": "STRING"}},
        "github": {{"type": "STRING"}},
        "linkedin": {{"type": "STRING"}},
        "codechef_profile_link": {{"type": "STRING"}},
        "leetcode_profile_link": {{"type": "STRING"}}, 
        "codeforces_profile_link": {{"type": "STRING"}},
        "hackerrank_profile_link": {{"type": "STRING"}},
        "academic_qualifications": {{
            "type": "ARRAY",
            "items": {{
                "type": "OBJECT",
                "properties": {{
                    "end_year": {{"type": "STRING"}},
                    "degree": {{"type": "STRING"}},
                    "institution": {{"type": "STRING"}},
                    "cgpa_percentage": {{"type": "STRING"}}
                }}
            }}
        }},
        "experience": {{
            "type": "ARRAY",
            "items": {{
                "type": "OBJECT",
                "properties": {{
                    "role": {{"type": "STRING"}},
                    "company": {{"type": "STRING"}},
                    "location": {{"type": "STRING", "nullable": true}},
                    "duration": {{"type": "STRING", "nullable": true}},
                    "description": {{
                        "type": "ARRAY",
                        "items": {{"type": "STRING"}}
                    }}
                }}
            }}
        }},
        "projects": {{
            "type": "ARRAY",
            "items": {{
                "type": "OBJECT",
                "properties": {{
                    "name": {{"type": "STRING"}},
                    "project_link": {{"type": "STRING", "nullable": true}},
                    "tech_stack": {{
                        "type": "ARRAY",
                        "items": {{"type": "STRING"}},
                        "nullable": true
                    }},
                    "duration": {{"type": "STRING", "nullable": true}},
                    "description": {{
                        "type": "ARRAY",
                        "items": {{"type": "STRING"}}
                    }}
                }}
            }}
        }},
        "skills": {{
            "type": "OBJECT",
            "properties": {{
                "technical_skills": {{"type": "ARRAY", "items": {{"type": "STRING"}}}},
                "tools": {{"type": "ARRAY", "items": {{"type": "STRING"}}}},
                "soft_skills": {{"type": "ARRAY", "items": {{"type": "STRING"}}}},
                "courses": {{"type": "ARRAY", "items": {{"type": "STRING"}}}}
            }}
        }},
        "positions_of_responsibility": {{
            "type": "ARRAY",
            "items": {{
                "type": "OBJECT",
                "properties": {{
                    "role": {{"type": "STRING"}},
                    "organization": {{"type": "STRING"}},
                    "description": {{"type": "STRING"}}
                }}
            }}
        }},
        "achievements": {{
            "type": "ARRAY",
            "items": {{
                "type": "OBJECT",
                "properties": {{
                    "description": {{"type": "STRING"}}
                }}
            }}
        }},
        "extra_curricular_activities": {{
            "type": "ARRAY",
            "items": {{"type": "STRING"}}
        }}
    }},
    "required": [
        "name", "email", "phone", "academic_qualifications",
        "experience", "projects", "skills",
        "positions_of_responsibility", "achievements", "extra_curricular_activities"
    ]
}}

The resume text is as follows:
---
{resume_text}
---
"""

EXTRACT_JD_KEYWORDS_PROMPT_TEMPLATE = """
You are an expert technical recruiter and ATS specialist. Extract a comprehensive list of keywords, technical skills, tools, methodologies, and core competencies from the following Job Description.
Return ONLY a JSON list of strings representing the keywords. 
Format: ["Python", "FastAPI", "Agile", "AWS", ...]

Job Description:
---
{jd_text}
---
"""

ENHANCE_RESUME_PROMPT_TEMPLATE = """
You are an expert career coach and ATS optimization specialist.
I will provide you with a parsed resume JSON and a Job Description.
Your task is to tailor the resume to perfectly match the job description, ensuring maximum ATS score.

Rules:
1. DO NOT invent fake experiences or completely unrelated skills.
2. Rewrite the professional summary to highlight relevance to the job description.
3. Reframe the experience bullet points to use the keywords from the job description and focus on achievements relevant to this role.
4. Reframe the projects bullet points to use the keywords from the job description and focus on achievements relevant to this role.
5. Reorder or filter the skills to prioritize those mentioned in the job description.
6. Return the result strictly matching the following JSON schema. No additional text or markdown.
7. In case no job description is provided, just enhance the existing resume and return the result strictly matching the following JSON schema. No additional text or markdown.
8. CRITICALLY IMPORTANT: You MUST bold the keywords in experience and project bullet points. For making bold, use **keyword**.
9. Enforce using bold (**keyword**) when suitable for:
    - Metrics → **60%**, **2x**, **1000+ users**
    - Tech → **React**, **FastAPI**, **MongoDB**
    - Key actions → **Optimized**, **Designed**, **Deployed**

Schema:
{
    "type": "OBJECT",
    "properties": {
        "summary": {"type": "STRING"},
        "skills": {
            "type": "OBJECT",
            "properties": {
                "technical_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "tools": {"type": "ARRAY", "items": {"type": "STRING"}},
                "soft_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "courses": {"type": "ARRAY", "items": {"type": "STRING"}}
            }
        },
        "academic_qualifications": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "end_year": {"type": "STRING"},
                    "degree": {"type": "STRING"},
                    "institution": {"type": "STRING"},
                    "cgpa_percentage": {"type": "STRING"}
                }
            }
        },
        "projects": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "name": {"type": "STRING"},
                    "project_link": {"type": "STRING", "nullable": true},
                    "tech_stack": {"type": "ARRAY", "items": {"type": "STRING"}, "nullable": true},
                    "duration": {"type": "STRING", "nullable": true},
                    "description": {"type": "ARRAY", "items": {"type": "STRING"}}
                }
            }
        },
        "positions_of_responsibility": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "position": {"type": "STRING"}
            }
        },
        "experience": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "role": {"type": "STRING"},
                    "company": {"type": "STRING"},
                    "location": {"type": "STRING", "nullable": true},
                    "duration": {"type": "STRING", "nullable": true},
                    "description": {
                        "type": "ARRAY",
                        "items": {"type": "STRING"}
                    }
                }
            }
        },
        "achievements": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "description": {"type": "STRING"}
                }
            }
        },
        "extra_curricular_activities": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        }
    }
}

Job Description:
---
{jd_text}
---

Original Resume JSON:
---
{resume_data_json}
---
"""

