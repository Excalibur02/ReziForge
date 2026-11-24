import React, { useRef, useState } from 'react';
import { Download, Printer, Palette, Loader2, Sparkles } from 'lucide-react';

export default function ResumePreview({ data, template = 'resume_basic_3.html', onTemplateChange }) {
  const [downloading, setDownloading] = useState(false);

  if (!data) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#606553' }}>
        No resume data available for preview.
      </div>
    );
  }

  // Pure printable window containing only the template resume HTML
  const handlePrintOnlyResume = () => {
    const resumeEl = document.querySelector('.resume-sheet');
    if (!resumeEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.name || 'Resume'} - Tailored Resume</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 0;
              font-family: ${template === 'resume_basic.html' ? '"Georgia", serif' : '"Plus Jakarta Sans", sans-serif'};
              color: #1a1a1a;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .resume-sheet {
              width: 100%;
              padding: 0;
            }
            a { text-decoration: none; color: inherit; }
            ul { margin: 3px 0 2px 18px; padding: 0; }
            li { margin-bottom: 2px; }
          </style>
        </head>
        <body>
          <div class="resume-sheet">
            ${resumeEl.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Backend Playwright PDF Generator for exact server-side template PDF
  const handleDownloadServerPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_data: data,
          template_name: template
        })
      });

      if (!response.ok) {
        throw new Error("Backend PDF rendering failed. Using browser print fallback.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name?.replace(/\s+/g, '_') || 'Tailored'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.warn("Server PDF error, switching to isolated print:", err);
      handlePrintOnlyResume();
    } finally {
      setDownloading(false);
    }
  };

  const templatesList = [
    { id: 'resume_basic_3.html', name: 'Minimal Modern', desc: 'Sleek headers & accent lines' },
    { id: 'resume_basic.html', name: 'Classic Ivy League', desc: 'Timeless serif single-column' },
    { id: 'resume_basic_2.html', name: 'Technical Executive', desc: 'High-density skills & projects' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e9edc9' }}>
      {/* Top Toolbar */}
      <div className="resume-toolbar-wrapper" style={{
        padding: '12px 18px',
        background: '#ffffff',
        borderBottom: '1px solid #e9edc9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Template Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} color="#d4a373" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2b2d24' }}>Template:</span>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1.5px solid #ccd5ae',
              background: '#fefae0',
              color: '#2b2d24',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {templatesList.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePrintOnlyResume}
            className="btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            title="Print only this resume sheet"
          >
            <Printer size={14} /> Print Resume
          </button>
          
          <button
            onClick={handleDownloadServerPDF}
            disabled={downloading}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            title="Generate and download exact PDF template"
          >
            {downloading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download size={14} /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sheet Container */}
      <div 
        className="resume-sheet-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          background: '#ecebe4'
        }}
      >
        {/* Realistic A4 paper simulation */}
        <div 
          className="resume-sheet"
          style={{
            width: '100%',
            maxWidth: '794px',
            minHeight: '1020px',
            background: '#ffffff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            borderRadius: '2px',
            padding: template === 'resume_basic_3.html' ? '36px 40px' : '32px 36px',
            fontFamily: template === 'resume_basic.html' ? '"Georgia", serif' : '"Plus Jakarta Sans", sans-serif',
            color: '#1a1a1a',
            lineHeight: 1.45,
            fontSize: '13px'
          }}
        >
          {/* Header */}
          <div style={{
            textAlign: template === 'resume_basic_2.html' ? 'left' : 'center',
            borderBottom: template === 'resume_basic_3.html' ? '2px solid #d4a373' : (template === 'resume_basic_2.html' ? '2px solid #2b2d24' : '1px solid #ddd'),
            paddingBottom: '14px',
            marginBottom: '16px'
          }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textTransform: template === 'resume_basic_2.html' ? 'uppercase' : 'none',
              color: '#1a1a1a',
              margin: '0 0 6px 0'
            }}>
              {data.name || 'Your Name'}
            </h1>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: template === 'resume_basic_2.html' ? 'flex-start' : 'center',
              gap: '10px 14px',
              fontSize: '11.5px',
              color: '#444'
            }}>
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.linkedin && <span>• <a href={data.linkedin} target="_blank" rel="noreferrer" style={{ color: '#2b5282', textDecoration: 'none' }}>LinkedIn</a></span>}
              {data.github && <span>• <a href={data.github} target="_blank" rel="noreferrer" style={{ color: '#2b5282', textDecoration: 'none' }}>GitHub</a></span>}
              {data.leetcode_profile_link && <span>• <a href={data.leetcode_profile_link} target="_blank" rel="noreferrer" style={{ color: '#2b5282', textDecoration: 'none' }}>LeetCode</a></span>}
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <div style={{ marginBottom: '14px' }}>
              <div style={sectionHeadingStyle(template)}>
                <span>Summary</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#2a2a2a', lineHeight: 1.5 }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={sectionHeadingStyle(template)}>
                <span>Professional Experience</span>
              </div>
              {data.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{exp.role}</span>
                    <span style={{ fontSize: '11.5px', color: '#555', fontStyle: 'italic' }}>{exp.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#444', fontSize: '12px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <ul style={{ margin: '3px 0 0 16px', padding: 0 }}>
                      {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((bullet, bIdx) => (
                        <li key={bIdx} style={{ fontSize: '11.5px', color: '#2b2b2b', marginBottom: '2px', lineHeight: 1.4 }}>
                          {formatBulletBold(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={sectionHeadingStyle(template)}>
                <span>Projects</span>
              </div>
              {data.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '12.5px' }}>
                      {proj.name}
                      {proj.project_link && (
                        <span style={{ fontWeight: 400, marginLeft: '6px' }}>
                          [<a href={proj.project_link} target="_blank" rel="noreferrer" style={{ color: '#2b5282', textDecoration: 'none', fontSize: '11px' }}>Link</a>]
                        </span>
                      )}
                    </span>
                    {proj.duration && <span style={{ fontSize: '11px', color: '#555' }}>{proj.duration}</span>}
                  </div>
                  {proj.tech_stack && (
                    <div style={{ fontSize: '11px', color: '#555', marginBottom: '2px' }}>
                      <strong>Stack:</strong> {Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack}
                    </div>
                  )}
                  {proj.description && (
                    <ul style={{ margin: '2px 0 0 16px', padding: 0 }}>
                      {(Array.isArray(proj.description) ? proj.description : [proj.description]).map((bullet, bIdx) => (
                        <li key={bIdx} style={{ fontSize: '11.5px', color: '#2b2b2b', marginBottom: '2px', lineHeight: 1.4 }}>
                          {formatBulletBold(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.academic_qualifications && data.academic_qualifications.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={sectionHeadingStyle(template)}>
                <span>Education</span>
              </div>
              {data.academic_qualifications.map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{edu.institution}</span> — <span style={{ fontStyle: 'italic' }}>{edu.degree}</span>
                  </div>
                  <div style={{ color: '#555', fontSize: '11.5px' }}>
                    <span>{edu.cgpa_percentage && `(${edu.cgpa_percentage}) `}</span>
                    <span>{edu.end_year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills && (
            <div style={{ marginBottom: '14px' }}>
              <div style={sectionHeadingStyle(template)}>
                <span>Skills & Competencies</span>
              </div>
              <div style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#222' }}>
                {data.skills.technical_skills && data.skills.technical_skills.length > 0 && (
                  <div style={{ marginBottom: '2px' }}>
                    <strong>Technical Skills:</strong> {Array.isArray(data.skills.technical_skills) ? data.skills.technical_skills.join(', ') : data.skills.technical_skills}
                  </div>
                )}
                {data.skills.tools && data.skills.tools.length > 0 && (
                  <div style={{ marginBottom: '2px' }}>
                    <strong>Tools & Platforms:</strong> {Array.isArray(data.skills.tools) ? data.skills.tools.join(', ') : data.skills.tools}
                  </div>
                )}
                {data.skills.soft_skills && data.skills.soft_skills.length > 0 && (
                  <div>
                    <strong>Soft Skills:</strong> {Array.isArray(data.skills.soft_skills) ? data.skills.soft_skills.join(', ') : data.skills.soft_skills}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements / Extracurricular */}
          {((data.achievements && data.achievements.length > 0) || (data.positions_of_responsibility && data.positions_of_responsibility.length > 0)) && (
            <div>
              <div style={sectionHeadingStyle(template)}>
                <span>Key Accomplishments & Leadership</span>
              </div>
              <ul style={{ margin: '3px 0 0 16px', padding: 0 }}>
                {data.achievements?.map((ach, idx) => (
                  <li key={`ach-${idx}`} style={{ fontSize: '11.5px', color: '#2b2b2b', marginBottom: '2px' }}>
                    {formatBulletBold(ach.description || ach)}
                  </li>
                ))}
                {data.positions_of_responsibility?.map((pos, idx) => (
                  <li key={`pos-${idx}`} style={{ fontSize: '11.5px', color: '#2b2b2b', marginBottom: '2px' }}>
                    <strong>{pos.role}</strong> ({pos.organization}) - {pos.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function formatBulletBold(text) {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function sectionHeadingStyle(template) {
  if (template === 'resume_basic_3.html') {
    return {
      fontSize: '13px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#d4a373',
      borderBottom: '1px solid #faedcd',
      paddingBottom: '3px',
      marginBottom: '6px'
    };
  } else if (template === 'resume_basic_2.html') {
    return {
      fontSize: '12px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#2b2d24',
      borderBottom: '1.5px solid #2b2d24',
      paddingBottom: '2px',
      marginBottom: '6px'
    };
  } else {
    // classic
    return {
      fontSize: '13px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: '#222',
      borderBottom: '1px solid #ccc',
      paddingBottom: '2px',
      marginBottom: '6px'
    };
  }
}
