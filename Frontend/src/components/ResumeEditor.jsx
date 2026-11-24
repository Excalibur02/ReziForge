import React, { useEffect, useRef, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe,
  BookOpen, 
  Briefcase, 
  Code, 
  Award, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';

export default function ResumeEditor({ data, onChange, readOnly = false }) {
  const [activeTab, setActiveTab] = useState('contact');

  const updateField = (path, value) => {
    if (readOnly) return;
    const updated = JSON.parse(JSON.stringify(data));
    let current = updated;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(updated);
  };

  const handleArrayAdd = (field, defaultItem) => {
    if (readOnly) return;
    const list = data[field] ? [...data[field]] : [];
    list.push(defaultItem);
    updateField([field], list);
  };

  const handleArrayRemove = (field, index) => {
    if (readOnly) return;
    const list = [...(data[field] || [])];
    list.splice(index, 1);
    updateField([field], list);
  };

  const tabs = [
    { id: 'contact', label: 'Basics & Links', icon: User },
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'experience', label: `Experience (${data?.experience?.length || 0})`, icon: Briefcase },
    { id: 'projects', label: `Projects (${data?.projects?.length || 0})`, icon: Code },
    { id: 'education', label: `Education (${data?.academic_qualifications?.length || 0})`, icon: Award },
    { id: 'skills', label: 'Skills & Tools', icon: CheckCircle2 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', borderRadius: '16px', border: '1px solid #e9edc9', overflow: 'hidden' }}>
      {/* Category Navigation Bar */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        background: '#fefae0',
        borderBottom: '1px solid #e9edc9',
        padding: '6px 8px',
        gap: '4px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#faedcd' : 'transparent',
                color: isActive ? '#2b2d24' : '#606553',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} color={isActive ? '#d4a373' : '#606553'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={data.name || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['name'], e.target.value)}
                style={inputStyle}
                placeholder="Simran Dhanai"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={data.email || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['email'], e.target.value)}
                style={inputStyle}
                placeholder="simran@example.com"
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="text"
                value={data.phone || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['phone'], e.target.value)}
                style={inputStyle}
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input
                type="text"
                value={data.github || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['github'], e.target.value)}
                style={inputStyle}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input
                type="text"
                value={data.linkedin || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['linkedin'], e.target.value)}
                style={inputStyle}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label style={labelStyle}>LeetCode Profile</label>
              <input
                type="text"
                value={data.leetcode_profile_link || ''}
                readOnly={readOnly}
                onChange={(e) => updateField(['leetcode_profile_link'], e.target.value)}
                style={inputStyle}
                placeholder="https://leetcode.com/..."
              />
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            <label style={labelStyle}>Professional Summary / Objective</label>
            <textarea
              rows={6}
              value={data.summary || ''}
              readOnly={readOnly}
              onChange={(e) => updateField(['summary'], e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="A concise, impact-oriented pitch highlighting your core tech stack and domain expertise..."
            />
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#606553' }}>Work Positions</span>
              {!readOnly && (
                <button
                  onClick={() => handleArrayAdd('experience', { role: 'Software Engineer', company: 'Company Name', location: 'City, Country', duration: '2023 - Present', description: ['Accomplished key milestones and delivered measurable results.'] })}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Role
                </button>
              )}
            </div>

            {(!data.experience || data.experience.length === 0) ? (
              <p style={{ color: '#606553', fontSize: '0.9rem', fontStyle: 'italic', padding: '20px 0' }}>No experience entries added yet.</p>
            ) : (
              data.experience.map((exp, idx) => (
                <div key={idx} style={cardContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#2b2d24', fontSize: '0.95rem' }}>#{idx + 1} {exp.role || 'Role'}</span>
                    {!readOnly && (
                      <button onClick={() => handleArrayRemove('experience', idx)} style={deleteBtnStyle}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Role / Title"
                      value={exp.role || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].role = e.target.value;
                        updateField(['experience'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].company = e.target.value;
                        updateField(['experience'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., Jun 2023 - Present)"
                      value={exp.duration || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].duration = e.target.value;
                        updateField(['experience'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g., New York, NY)"
                      value={exp.location || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].location = e.target.value;
                        updateField(['experience'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Bullet Points (one per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || '')}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].description = e.target.value.split('\n');
                        updateField(['experience'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#606553' }}>Personal & Technical Projects</span>
              {!readOnly && (
                <button
                  onClick={() => handleArrayAdd('projects', { name: 'Project Title', project_link: '', tech_stack: ['Python', 'React'], duration: '2024', description: ['Built an end-to-end platform.'] })}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Project
                </button>
              )}
            </div>

            {(!data.projects || data.projects.length === 0) ? (
              <p style={{ color: '#606553', fontSize: '0.9rem', fontStyle: 'italic', padding: '20px 0' }}>No projects listed.</p>
            ) : (
              data.projects.map((proj, idx) => (
                <div key={idx} style={cardContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#2b2d24', fontSize: '0.95rem' }}>#{idx + 1} {proj.name || 'Project'}</span>
                    {!readOnly && (
                      <button onClick={() => handleArrayRemove('projects', idx)} style={deleteBtnStyle}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].name = e.target.value;
                        updateField(['projects'], updated);
                      }}
                      style={inputStyle}
                    />
                    <CommaSeparatedInput
                      placeholder="Tech Stack (comma separated)"
                      value={proj.tech_stack}
                      readOnly={readOnly}
                      onCommit={(value) => {
                        const updated = [...data.projects];
                        updated[idx] = {
                          ...updated[idx],
                          tech_stack: value
                        };
                        updateField(['projects'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Repository / Live Demo Link"
                      value={proj.project_link || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].project_link = e.target.value;
                        updateField(['projects'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Project Description Bullets (one per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].description = e.target.value.split('\n');
                        updateField(['projects'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#606553' }}>Degrees & Certifications</span>
              {!readOnly && (
                <button
                  onClick={() => handleArrayAdd('academic_qualifications', { degree: 'B.Tech CSE', institution: 'University', end_year: '2023-2027', cgpa_percentage: '8.5' })}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Education
                </button>
              )}
            </div>

            {(!data.academic_qualifications || data.academic_qualifications.length === 0) ? (
              <p style={{ color: '#606553', fontSize: '0.9rem', fontStyle: 'italic', padding: '20px 0' }}>No education records found.</p>
            ) : (
              data.academic_qualifications.map((edu, idx) => (
                <div key={idx} style={cardContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#2b2d24', fontSize: '0.95rem' }}>#{idx + 1} {edu.degree || 'Degree'}</span>
                    {!readOnly && (
                      <button onClick={() => handleArrayRemove('academic_qualifications', idx)} style={deleteBtnStyle}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Degree / Program"
                      value={edu.degree || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.academic_qualifications];
                        updated[idx].degree = e.target.value;
                        updateField(['academic_qualifications'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Institution / University"
                      value={edu.institution || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.academic_qualifications];
                        updated[idx].institution = e.target.value;
                        updateField(['academic_qualifications'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year / Span"
                      value={edu.end_year || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.academic_qualifications];
                        updated[idx].end_year = e.target.value;
                        updateField(['academic_qualifications'], updated);
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="CGPA / Score"
                      value={edu.cgpa_percentage || ''}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const updated = [...data.academic_qualifications];
                        updated[idx].cgpa_percentage = e.target.value;
                        updateField(['academic_qualifications'], updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Technical Skills (comma separated)</label>
              <CommaSeparatedInput
                value={data.skills?.technical_skills}
                readOnly={readOnly}
                onCommit={(value) => {
                  updateField(['skills', 'technical_skills'], value);
                }}
                style={inputStyle}
                placeholder="Python, FastAPI, SQL, Docker, Redis"
              />
            </div>
            <div>
              <label style={labelStyle}>Tools & Frameworks (comma separated)</label>
              <CommaSeparatedInput
                value={data.skills?.tools}
                readOnly={readOnly}
                onCommit={(value) => {
                  updateField(['skills', 'tools'], value);
                }}
                style={inputStyle}
                placeholder="Git, Postman, Docker"
              />
            </div>
            <div>
              <label style={labelStyle}>Soft Skills (comma separated)</label>
              <CommaSeparatedInput
                value={data.skills?.soft_skills}
                readOnly={readOnly}
                onCommit={(value) => {
                  updateField(['skills', 'soft_skills'], value);
                }}
                style={inputStyle}
                placeholder="Problem-Solving, Communication, Leadership"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Keeps the input string independent from the normalized array in parent state.
// Parent data is still updated on every keystroke, so the resume preview stays live.
function CommaSeparatedInput({ value, onCommit, readOnly, style, placeholder }) {
  const valueAsString = Array.isArray(value)
    ? value.join(', ')
    : (value || '');

  const [inputValue, setInputValue] = useState(valueAsString);
  const isFocused = useRef(false);

  // Sync external changes, but never overwrite the user's in-progress text.
  useEffect(() => {
    if (!isFocused.current) {
      setInputValue(valueAsString);
    }
  }, [valueAsString]);

  const parseValue = (text) =>
    text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleChange = (e) => {
    const nextValue = e.target.value;

    // The input is controlled by this exact string, preserving spaces and cursor position.
    setInputValue(nextValue);

    // Update parent data on every keystroke for real-time side-by-side preview.
    onCommit(parseValue(nextValue));
  };

  const handleBlur = () => {
    isFocused.current = false;

    // Normalize the displayed string after editing is complete.
    const parsedValue = parseValue(inputValue);
    const normalizedValue = parsedValue.join(', ');

    setInputValue(normalizedValue);
    onCommit(parsedValue);
  };

  return (
    <input
      type="text"
      value={inputValue}
      readOnly={readOnly}
      onFocus={() => {
        isFocused.current = true;
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      style={style}
      placeholder={placeholder}
    />
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#2b2d24',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #ccd5ae',
  background: '#ffffff',
  color: '#2b2d24',
  fontSize: '0.88rem',
  outline: 'none',
  fontFamily: 'inherit'
};

const cardContainerStyle = {
  background: '#fcfbf7',
  border: '1px solid #e9edc9',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '14px'
};

const deleteBtnStyle = {
  background: '#fff0ed',
  border: '1px solid #ffcdcd',
  color: '#cf3838',
  borderRadius: '6px',
  padding: '4px 8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
