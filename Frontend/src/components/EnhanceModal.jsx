import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  FileText, 
  Briefcase, 
  Check, 
  Loader2, 
  Info,
  Code2,
  TrendingUp,
  Target
} from 'lucide-react';

export default function EnhanceModal({ isOpen, onClose, onGenerate, isGenerating }) {
  const [domain, setDomain] = useState('swe'); // 'swe' | 'mba'
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('');

  if (!isOpen) return null;

  const rolePresets = {
    swe: [
      'Software Engineer',
      'Backend Engineer',
      'Full Stack Developer',
      'Frontend Engineer',
      'AI / Machine Learning Engineer',
      'DevOps / Cloud Engineer',
      'Data Engineer'
    ],
    mba: [
      'Product Manager (PM)',
      'Management Consultant',
      'Strategy & Operations Manager',
      'Corporate Finance / Investment Associate',
      'Product Marketing Manager (PMM)',
      'Business Development / Sales Lead',
      'General Management / Program Manager'
    ]
  };

  const sampleJDs = {
    swe: `Role: Backend Engineer / AI Engineer
Responsibilities:
- Build and scale high-performance REST APIs in Python using FastAPI or Flask.
- Integrate Large Language Models (LLMs), OpenAI / Anthropic APIs, and RAG pipelines.
- Manage databases (PostgreSQL, MySQL, MongoDB) and cache layers (Redis).
- Implement automated testing, Docker containers, and CI/CD deployment pipelines.
- Collaborate with frontend engineers to deliver intuitive, production-ready features.`,
    mba: `Role: Strategy & Product Operations Lead / Product Manager
Responsibilities:
- Drive strategic initiatives, cross-functional roadmap planning, and product growth across global teams.
- Conduct market analysis, competitor benchmarking, and user research to identify high-ROI opportunities.
- Define and monitor key performance indicators (OKRs, CAC, LTV, churn rate, sprint velocity).
- Partner with engineering, sales, and executive leadership to execute go-to-market (GTM) launches.
- Optimize operational workflows, reducing costs by 20% while accelerating delivery milestones.`
  };

  const handleDomainChange = (newDomain) => {
    setDomain(newDomain);
    setTargetRole(rolePresets[newDomain][0]);
    if (!jobDescription || jobDescription === sampleJDs.swe || jobDescription === sampleJDs.mba) {
      setJobDescription(sampleJDs[newDomain]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '30px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#faedcd',
                color: '#d4a373',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2b2d24' }}>
                Enhance Resume with Role & Job Description
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#606553' }}>
              Select your target career domain and specific role. Even with minimal or no job description, our specialized prompts calibrate keywords, action verbs, and impact metrics.
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={isGenerating}
            style={{
              background: '#fefae0',
              border: '1px solid #ccd5ae',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#606553'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Career Domain Selection (SWE vs MBA) */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#2b2d24', marginBottom: '8px' }}>
            1. Target Career Domain
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* SWE Card */}
            <div 
              onClick={() => handleDomainChange('swe')}
              style={{
                border: `2px solid ${domain === 'swe' ? '#d4a373' : '#ccd5ae'}`,
                background: domain === 'swe' ? 'rgba(250, 237, 205, 0.4)' : '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Code2 size={18} color={domain === 'swe' ? '#d4a373' : '#606553'} />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#2b2d24' }}>
                  Software & Tech
                </span>
                {domain === 'swe' && <Check size={16} color="#d4a373" style={{ marginLeft: 'auto' }} />}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#606553', margin: 0, lineHeight: 1.35 }}>
                Emphasizes tech stack, system architecture, latency, algorithms, and technical ATS keywords.
              </p>
            </div>

            {/* MBA Card */}
            <div 
              onClick={() => handleDomainChange('mba')}
              style={{
                border: `2px solid ${domain === 'mba' ? '#d4a373' : '#ccd5ae'}`,
                background: domain === 'mba' ? 'rgba(250, 237, 205, 0.4)' : '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <TrendingUp size={18} color={domain === 'mba' ? '#d4a373' : '#606553'} />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#2b2d24' }}>
                  MBA / Business Leadership
                </span>
                {domain === 'mba' && <Check size={16} color="#d4a373" style={{ marginLeft: 'auto' }} />}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#606553', margin: 0, lineHeight: 1.35 }}>
                Grads & experienced. Focuses on ROI, cross-functional leadership, KPIs, strategy, and business growth.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Target Specific Role */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2b2d24' }}>
              2. Target Role
            </label>
            <span style={{ fontSize: '0.78rem', color: '#606553' }}>
              Helps calibrate role-specific ATS keywords
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #ccd5ae',
                background: '#fefae0',
                color: '#2b2d24',
                fontSize: '0.88rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {rolePresets[domain].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Or type custom role..."
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #ccd5ae',
                background: '#ffffff',
                color: '#2b2d24',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 3. Job Description */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2b2d24' }}>
              3. Target Job Description <span style={{ fontWeight: 400, color: '#606553' }}>(Optional - role prompt fills gaps if empty)</span>
            </label>
            <button 
              type="button"
              onClick={() => setJobDescription(sampleJDs[domain])}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4a373',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Paste Sample {domain.toUpperCase()} JD
            </button>
          </div>

          <textarea 
            rows={6}
            placeholder={`Paste role requirements or leave empty (AI will use built-in ${domain === 'mba' ? 'MBA' : 'SWE'} prompt knowledge for ${targetRole})...`}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1.5px solid #ccd5ae',
              background: '#fefae0',
              color: '#2b2d24',
              fontSize: '0.88rem',
              fontFamily: 'inherit',
              lineHeight: '1.45',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        {/* Info Tip */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: 'rgba(233, 237, 201, 0.4)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid #e9edc9',
          color: '#606553',
          fontSize: '0.8rem',
          marginBottom: '20px'
        }}>
          <Info size={16} color="#d4a373" style={{ flexShrink: 0 }} />
          <span>
            {domain === 'mba' 
              ? 'MBA Prompt Mode: Reframes bullets using Google XYZ format with ROI, leadership, and KPI power verbs.'
              : 'SWE Prompt Mode: Enhances technical metrics, system scale, and developer tools.'}
          </span>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onClose}
            disabled={isGenerating}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            Cancel
          </button>
          <button 
            onClick={() => onGenerate({ jobDescription, domain, targetRole })}
            disabled={isGenerating}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '0.88rem',
              opacity: isGenerating ? 0.6 : 1,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Tailoring for {targetRole}...
              </>
            ) : (
              <>
                Enhance for {targetRole} <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
