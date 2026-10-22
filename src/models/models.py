from pydantic import BaseModel, EmailStr
from typing import List, Optional


class Experience(BaseModel):
    """Model for professional experience entries."""
    role: str
    company: str
    location: Optional[str] = None
    duration: Optional[str] = None
    description: List[str]

class Project(BaseModel):
    """Model for personal projects."""
    name: str
    project_link: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    duration: Optional[str] = None
    description: List[str]

class Education(BaseModel):
    """Model for academic qualifications."""
    end_year: str
    degree: str
    institution: str
    cgpa_percentage: str

class Responsibility(BaseModel):
    """Model for positions of responsibility."""
    role: str
    organization: str
    description: str

class Achievement(BaseModel):
    """Model for achievements and awards."""
    description: str

class Skills(BaseModel):
    technical_skills: List[str]
    tools: List[str]
    soft_skills: List[str]
    courses: List[str]

class ResumeParsed(BaseModel):
    """The main Pydantic model for the entire resume."""
    name: str
    email: EmailStr
    phone: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    leetcode_profile_link: Optional[str] = None
    codeforces_profile_link: Optional[str] = None
    hackerrank_profile_link: Optional[str] = None
    codechef_profile_link: Optional[str] = None
    academic_qualifications: List[Education]
    experience: List[Experience]
    projects: List[Project]
    skills: Skills
    positions_of_responsibility: List[Responsibility]
    achievements: List[Achievement]
    extra_curricular_activities: List[str]

class JobDescriptionRequest(BaseModel):
    job_description: str

class JobDescriptionResponse(BaseModel):
    job_description: str
    keywords: List[str]

# class ResumeGenerationRequest(BaseModel):
#     resume: File
#     job_description: str
#     preferences: Optional[str] = "default"

class TailoredResume(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    github: Optional[str] = None
    linkedin: Optional[str] = None
    leetcode_profile_link: Optional[str] = None
    codeforces_profile_link: Optional[str] = None
    hackerrank_profile_link: Optional[str] = None
    codechef_profile_link: Optional[str] = None
    experience: List[Experience] = []
    skills: Skills = None
    academic_qualifications: List[Education]
    projects: List[Project]
    positions_of_responsibility: List[Responsibility] = []
    achievements: List[Achievement] = []
    extra_curricular_activities: List[str] = []

class ResumeGenerationResponse(BaseModel):
    session_id: str
    tailored_resume: TailoredResume

class ResumePreviewResponse(BaseModel):
    tailored_resume: TailoredResume

class DownloadResumeRequest(BaseModel):
    tailored_resume: TailoredResume
    template_style: Optional[str] = "classic"

class UploadResumeResponse(BaseModel):
    parsed_resume: ResumeParsed