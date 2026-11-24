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
You are an expert career coach and ATS optimization specialist for Software Engineering and Technical roles.
I will provide you with a parsed resume JSON, an optional target role domain, and an optional Job Description.
Your task is to tailor the resume to highlight technical rigor, software design, engineering impact, and technical ATS keywords.

Target Domain: Software Engineering / Technical Roles
Role Specified: {target_role}

Rules:
1. DO NOT invent fake companies, degrees, or completely unrelated experiences.
2. Rewrite the professional summary to highlight relevance to software engineering and the specified role/job description (e.g., system architecture, clean code, scalability, API design, problem-solving).
3. If the provided Job Description is brief or minimal, leverage industry-standard competencies for {target_role} (e.g. backend/frontend architecture, algorithms, cloud deployments, code optimization, unit testing, databases).
4. Reframe experience bullet points to emphasize technical achievements, measurable impact, latency/throughput gains, and architectural ownership.
5. Reframe projects bullet points to showcase the tech stack, problem solved, and technical deliverables.
6. Reorder or filter skills to prioritize technical languages, frameworks, developer tools, and system methodologies.
7. Return the result strictly matching the following JSON schema. No additional text or markdown.
8. CRITICALLY IMPORTANT: You MUST bold the keywords in experience and project bullet points using **keyword**.
9. Enforce bold (**keyword**) when suitable for:
    - Metrics → **60%**, **2x**, **1000+ users**, **99.9% uptime**
    - Technologies & Languages → **Python**, **React**, **FastAPI**, **Docker**, **PostgreSQL**
    - Technical Actions → **Architected**, **Optimized**, **Deployed**, **Engineered**

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

Target Role: {target_role}

Job Description:
---
{jd_text}
---

Original Resume JSON:
---
{resume_data_json}
---
"""

ENHANCE_RESUME_MBA_PROMPT_TEMPLATE = """
You are an executive MBA career consultant, management coach, and corporate ATS strategist.
I will provide you with a parsed resume JSON, a target MBA role (e.g., Product Management, Strategy & Operations, Management Consulting, Finance, Marketing, General Management), and an optional Job Description.
Your task is to reframe and enhance the resume into a high-caliber business leadership resume suitable for top MBA graduates and experienced business professionals.

Target Domain: Business Administration / MBA (Grads & Experienced)
Role Specified: {target_role}

Rules:
1. DO NOT invent fake employers or fabricated degrees.
2. Rewrite the professional summary to position the candidate as a high-impact, strategic, and data-driven business professional or MBA candidate tailored to {target_role}.
3. Even if the job description is short, sparse, or minimal, infuse business management standards for {target_role} (e.g. cross-functional leadership, P&L awareness, revenue growth, cost reduction, market analysis, stakeholder management, KPI tracking, agile execution).
4. Frame experience bullet points using the executive Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]"). Elevate technical tasks into strategic business value, customer retention, efficiency, and ROI.
5. In projects, emphasize strategic vision, business rationale, go-to-market strategies, user impact, financial metrics, and cross-functional teamwork.
6. Re-categorize skills to highlight business and managerial competencies:
   - "technical_skills": Quantitative analysis, Financial modeling, SQL, Tableau/PowerBI, Market Research, Python for Analytics, Agile/Scrum, Product Strategy.
   - "tools": Jira, Salesforce, Excel (Advanced/VBA), ERP/SAP, Figma, Notion, Google Analytics.
   - "soft_skills": Executive Stakeholder Management, Strategic Negotiation, Cross-functional Leadership, Conflict Resolution, Public Speaking, Change Management.
   - "courses": Corporate Finance, Marketing Strategy, Operations Management, Business Analytics, Microeconomics, Organizational Leadership.
7. Return strictly the JSON matching the schema below. No conversational prose or markdown wrap outside JSON.
8. CRITICALLY IMPORTANT: You MUST bold key metrics and strategic power terms in experience and project bullet points using **keyword**.
9. Enforce bold (**keyword**) when suitable for:
    - Business Metrics & ROI → **\$250K+**, **32% YoY growth**, **15% reduction in CAC**, **45-day turnaround**
    - Methodologies & Frameworks → **Agile/Scrum**, **DCF Valuation**, **SWOT Analysis**, **OKRs**, **GTM Strategy**
    - Executive Action Verbs → **Spearheaded**, **Orchestrated**, **Negotiated**, **Accelerated**, **Restructured**

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

Target MBA Role: {target_role}

Job Description:
---
{jd_text}
---

Original Resume JSON:
---
{resume_data_json}
---
"""

