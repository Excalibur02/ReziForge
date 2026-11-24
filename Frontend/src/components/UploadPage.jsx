import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function UploadPage({ onBack, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(selectedFile.type) && !['pdf', 'docx', 'doc'].includes(extension)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to parse resume from backend.");
      }

      const data = await response.json();
      onUploadSuccess(data, file.name);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect to backend server. Make sure it is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // Demo fallback to try sample resume if backend is starting or user wants instant test
  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock/sample structure matching Simran Dhanai
      const demoData = {
        "summary": "Motivated B.tech CSE graduate with strong proficiency in Python and SQL, seeking an AI Backend Engineer role to contribute FastAPI backend services, LLM integrations, and RAG pipelines.",
        "name": "Simran Dhanai",
        "email": "simrandhanai00@gmail.com",
        "phone": "+91 7303913933",
        "github": "https://github.com/simrandhanai",
        "linkedin": "https://linkedin.com/in/simrandhanai",
        "leetcode_profile_link": "https://leetcode.com/simrandhanai",
        "codeforces_profile_link": "",
        "hackerrank_profile_link": "",
        "codechef_profile_link": "",
        "skills": {
          "technical_skills": ["Python", "FastAPI", "SQL", "Git", "PostgreSQL", "Docker"],
          "tools": ["MongoDB", "MySQL", "React.js", "Node.js", "Playwright", "Linux"],
          "soft_skills": ["Problem-Solving", "Teamwork", "Agile Collaboration", "Technical Writing"],
          "courses": ["Data Structures & Algorithms", "Database Management Systems", "Artificial Intelligence"]
        },
        "academic_qualifications": [
          {
            "end_year": "2023-2027",
            "degree": "B.Tech in Computer Science and Engineering",
            "institution": "Manav Rachna International Institute of Research and Studies",
            "cgpa_percentage": "8.5 CGPA"
          },
          {
            "end_year": "2023",
            "degree": "CBSE (Class XII) - Science",
            "institution": "St. Columbus School",
            "cgpa_percentage": "85%"
          }
        ],
        "experience": [
          {
            "role": "Backend Engineering Intern",
            "company": "Apex AI Labs",
            "location": "Remote",
            "duration": "June 2024 - Present",
            "description": [
              "Designed RESTful APIs using FastAPI and Pydantic, reducing query latency by 35%.",
              "Integrated OpenAI and OpenRouter LLMs for automated document summarization.",
              "Constructed RAG vector pipelines with Qdrant and LangChain for internal knowledge retrieval."
            ]
          }
        ],
        "projects": [
          {
            "name": "AI ATS Resume Builder & Analyzer",
            "project_link": "https://github.com/simrandhanai/ats-resume",
            "tech_stack": ["FastAPI", "React", "Python", "LLMs", "Playwright"],
            "duration": "Oct 2024",
            "description": [
              "Engineered full-stack ATS Resume tailoring engine with dynamic keyword adaptation.",
              "Implemented automated PDF rendering pipeline with auto-scaling to prevent multi-page spill.",
              "Achieved sub-second parsing accuracy using structured prompt engineering."
            ]
          },
          {
            "name": "E-Commerce Cloud Architecture",
            "project_link": "https://github.com/simrandhanai/ecommerce",
            "tech_stack": ["React", "Node.js", "MySQL", "TailwindCSS"],
            "duration": "May 2024",
            "description": [
              "Architected responsive e-commerce web platform supporting real-time inventory tracking.",
              "Integrated payment gateway webhooks and role-based authentication."
            ]
          }
        ],
        "positions_of_responsibility": [
          {
            "role": "Technical Lead",
            "organization": "College Developer Student Club",
            "description": "Mentored 150+ students in Python, web development, and competitive programming."
          }
        ],
        "achievements": [
          {
            "description": "Secured Top 5 Rank in National Hackathon 2024 out of 300+ participating teams."
          },
          {
            "description": "Solved 350+ LeetCode algorithmic problems with top 15% contest rating."
          }
        ],
        "extra_curricular_activities": [
          "Organized 4 intra-college technical workshops on AI & Cloud Computing.",
          "Active open-source contributor to developer tooling repositories."
        ]
      };
      setTimeout(() => {
        setLoading(false);
        onUploadSuccess(demoData, "Simran_Demo_Resume.pdf");
      }, 600);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9edc9',
        background: 'rgba(254, 250, 224, 0.7)'
      }}>
        <button 
          onClick={onBack}
          className="btn-outline"
          style={{ fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span style={{ fontWeight: 600, color: '#606553', fontSize: '0.9rem' }}>
          Step 1: Upload Existing Resume
        </span>
      </header>

      {/* Main Upload Box */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2b2d24', marginBottom: '8px' }}>
            Upload Your Resume
          </h2>
          <p style={{ color: '#606553', marginBottom: '32px', fontSize: '0.95rem' }}>
            We will extract your details into organized fields you can preview and edit.
          </p>

          {/* Drag & Drop Area */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#d4a373' : '#ccd5ae'}`,
              backgroundColor: dragActive ? '#fefae0' : '#ffffff',
              borderRadius: '24px',
              padding: '48px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: varColor => 'var(--shadow-soft)',
              position: 'relative'
            }}
          >
            <input 
              ref={inputRef}
              type="file" 
              accept=".pdf,.docx,.doc" 
              onChange={handleChange}
              style={{ display: 'none' }}
            />

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#faedcd',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4a373',
              marginBottom: '16px'
            }}>
              <Upload size={32} />
            </div>

            {file ? (
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2b2d24', marginBottom: '4px' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#606553' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to change
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2b2d24', marginBottom: '6px' }}>
                  Click to upload or drag & drop
                </p>
                <p style={{ fontSize: '0.85rem', color: '#606553' }}>
                  PDF or DOCX (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#ffebe6',
              border: '1px solid #ffbdad',
              color: '#bf2600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="btn-primary"
              style={{
                fontSize: '1rem',
                padding: '14px 32px',
                opacity: (loading || !file) ? 0.6 : 1,
                cursor: (loading || !file) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Parsing Resume...
                </>
              ) : (
                <>
                  Parse & Review Details <FileText size={18} />
                </>
              )}
            </button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <span style={{ fontSize: '0.85rem', color: '#606553' }}>
              Want to test immediately?{' '}
              <button
                onClick={handleLoadDemo}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4a373',
                  fontWeight: '700',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Load Sample Resume
              </button>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
