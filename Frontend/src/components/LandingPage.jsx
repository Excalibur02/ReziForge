import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Upload
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(254, 250, 224, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e9edc9',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#d4a373',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(212, 163, 115, 0.3)'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#2b2d24' }}>
              Elevate<span style={{ color: '#d4a373' }}>CV</span>
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#606553', fontWeight: 500 }}>
            Minimalist ATS Architecture
          </span>
          <button 
            onClick={onGetStarted}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '8px 20px' }}
          >
            Upload Resume <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#e9edc9',
          color: '#2b2d24',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '28px',
          border: '1px solid #ccd5ae'
        }}>
          <Sparkles size={14} color="#d4a373" /> Powered by Smart Job-Matching LLMs
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: '800',
          lineHeight: '1.15',
          maxWidth: '850px',
          color: '#2b2d24',
          marginBottom: '24px',
          letterSpacing: '-0.03em'
        }}>
          Turn your experience into an <span style={{ color: '#d4a373', fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>interview magnet</span>.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          color: '#606553',
          maxWidth: '650px',
          marginBottom: '40px',
          fontWeight: 400,
          lineHeight: '1.6'
        }}>
          Upload your existing resume, effortlessly review & refine your details, and dynamically tailor every section against any target job description in seconds.
        </p>

        {/* Action Button & Upload Callout */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onGetStarted}
            className="btn-primary"
            style={{ 
              fontSize: '1.15rem', 
              padding: '16px 36px',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            <Upload size={22} /> Upload Your Resume
          </button>
          <span style={{ fontSize: '0.85rem', color: '#606553' }}>
            Supports PDF & DOCX • Instant parsing • No credit card needed
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          width: '100%',
          marginTop: '70px',
          textAlign: 'left'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid #faedcd',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#e9edc9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: '#2b2d24'
            }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#2b2d24' }}>
              Editable Structured Data
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#606553', lineHeight: '1.5' }}>
              We convert raw resumes into clean, human-friendly editable fields so you retain 100% control before running enhancements.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid #faedcd',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#faedcd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: '#d4a373'
            }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#2b2d24' }}>
              JD Keyword Enhancer
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#606553', lineHeight: '1.5' }}>
              Provide any Job Description. Our LLM highlights key qualifications and optimizes project descriptions to pass ATS filters.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid #faedcd',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ccd5ae',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: '#2b2d24'
            }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#2b2d24' }}>
              Multi-Template Preview
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#606553', lineHeight: '1.5' }}>
              Switch seamlessly between Modern Clean, Classic Ivy, and Minimal Executive templates with real-time side-by-side rendering.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid #e9edc9',
        color: '#606553',
        fontSize: '0.85rem'
      }}>
        Designed with minimalism and intention • ReziForge 2026
      </footer>
    </div>
  );
}
