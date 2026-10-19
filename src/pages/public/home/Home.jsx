import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/routesPath';
import { getProjects } from '../../../services/dashboardService';
import './Home.css';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const categoryClasses = {
  'Real Estate': 'proj-real-estate',
  Energy: 'proj-fuel',
  Farmland: 'proj-farmland',
  Commercial: 'proj-commercial'
};

function ProjectArtwork({ category }) {
  if (category === 'Energy') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <circle cx="150" cy="110" r="80" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
      </svg>
    );
  }

  if (category === 'Farmland') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <path d="M 50 120 Q 150 50 250 120 L 250 180 L 50 180 Z" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
      </svg>
    );
  }

  if (category === 'Commercial') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <rect x="60" y="60" width="80" height="100" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
        <rect x="160" y="60" width="80" height="100" fill="rgba(248, 232, 183, 0.12)" stroke="rgba(248, 232, 183, 0.15)" />
      </svg>
    );
  }

  return (
    <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
      <rect x="40" y="50" width="220" height="140" fill="rgba(248, 232, 183, 0.1)" stroke="rgba(248, 232, 183, 0.2)" />
      <line x1="40" y1="80" x2="260" y2="80" stroke="rgba(248, 232, 183, 0.1)" />
      <line x1="40" y1="110" x2="260" y2="110" stroke="rgba(248, 232, 183, 0.1)" />
      <line x1="40" y1="140" x2="260" y2="140" stroke="rgba(248, 232, 183, 0.1)" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectsViewportRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');
  const [isSignupStepsOpen, setIsSignupStepsOpen] = useState(false);
  const [isInvestHintOpen, setIsInvestHintOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setProjectsError('Unable to load featured projects');
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const moveProjects = (direction) => {
    const viewport = projectsViewportRef.current;
    const card = viewport?.querySelector('.project-card');
    if (!viewport || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(viewport).columnGap) || 0;
    viewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'instant' });
  };

  useEffect(() => {
    if (!location.state?.showInvestHint) return;

    setIsInvestHintOpen(true);
    navigate(`${location.pathname}${location.hash}`, { replace: true, state: null });
  }, [location.hash, location.pathname, location.state, navigate]);

  useEffect(() => {
    if (location.hash !== '#featured-projects') return undefined;

    const timeout = window.setTimeout(() => {
      document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  useEffect(() => {
    if (!isSignupStepsOpen && !isInvestHintOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSignupStepsOpen(false);
        setIsInvestHintOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInvestHintOpen, isSignupStepsOpen]);

  return (
    <>
      <Header />
     {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg-lines"></div>

        {/* LEFT */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line"></div>

            <span className="hero-eyebrow-text">
              Investment Excellence
              Since 2015
            </span>
          </div>

          <h1 className="hero-h1">
            <strong>
              Building
            </strong>

            <br />

            <em>
              Sustainable
            </em>

            <br />

            <strong>
              Assets.
            </strong>
          </h1>

          <p className="hero-sub">
            Bhoomani Holdings
            Private Limited —
            a diversified
            investment company
            creating
            high-quality,
            income-generating
            assets across
            multiple sectors
            of the Indian
            economy.
          </p>

          <div className="hero-actions">
            <a
              href="/"
              className="btn-primary"
            >
              Explore
              Opportunities
            </a>

            <a
              href="/"
              className="btn-ghost"
            >
              About Bhoomani
              Holdings →
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <div className="hero-image-wrap">
            <svg
              className="geo-building"
              viewBox="0 0 640 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="160"
                y="180"
                width="320"
                height="460"
                fill="rgba(201,168,76,0.04)"
                stroke="rgba(201,168,76,0.18)"
              />

              {/* Floors */}
              <line
                x1="160"
                y1="220"
                x2="480"
                y2="220"
                stroke="rgba(201,168,76,0.1)"
              />

              <line
                x1="160"
                y1="260"
                x2="480"
                y2="260"
                stroke="rgba(201,168,76,0.1)"
              />

              <line
                x1="160"
                y1="300"
                x2="480"
                y2="300"
                stroke="rgba(201,168,76,0.1)"
              />

              <line
                x1="160"
                y1="340"
                x2="480"
                y2="340"
                stroke="rgba(201,168,76,0.1)"
              />

              {/* Windows */}
              <rect
                x="172"
                y="228"
                width="28"
                height="20"
                fill="rgba(201,168,76,0.3)"
              />

              <rect
                x="212"
                y="228"
                width="28"
                height="20"
                fill="rgba(201,168,76,0.2)"
              />

              <rect
                x="252"
                y="228"
                width="28"
                height="20"
                fill="rgba(201,168,76,0.35)"
              />

              <rect
                x="292"
                y="228"
                width="28"
                height="20"
                fill="rgba(201,168,76,0.15)"
              />

              <rect
                x="332"
                y="228"
                width="28"
                height="20"
                fill="rgba(201,168,76,0.3)"
              />

              {/* Crown */}
              <rect
                x="200"
                y="100"
                width="240"
                height="80"
                fill="rgba(201,168,76,0.06)"
                stroke="rgba(201,168,76,0.25)"
              />

              <rect
                x="240"
                y="40"
                width="160"
                height="62"
                fill="rgba(201,168,76,0.08)"
                stroke="rgba(201,168,76,0.3)"
              />
            </svg>

            <div className="hero-overlay-gradient"></div>

            <div className="corner-accent"></div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">
            ₹500+ Cr
          </div>

          <div className="stat-label">
            Assets Under
            Management
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-number">
            2,500+
          </div>

          <div className="stat-label">
            Happy Investors
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-number">
            25+
          </div>

          <div className="stat-label">
            Active Projects
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-number">
            10+
          </div>

          <div className="stat-label">
            Cities Across
            India
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-number">
            100%
          </div>

          <div className="stat-label">
            Transparency &
            Trust
          </div>
        </div>
      </div>

      {/* ECOSYSTEM SECTION */}
      <section className="ecosystem">
        <div className="ecosystem-inner">
          <div className="ecosystem-left">
            <div className="section-eyebrow">
              <div className="section-eyebrow-line"></div>
              <span className="section-eyebrow-text">Our Ecosystem</span>
            </div>
            <h2 className="section-title">
              Diversified <em>Assets</em> Across Sectors
            </h2>
            <p className="ecosystem-desc">
              Bhoomani Holdings manages a diverse portfolio spanning real estate, commercial spaces, agricultural land, and alternative energy investments. Each asset class is carefully curated to deliver sustained value and strong returns.
            </p>
          </div>
          <div className="ecosystem-grid">
            <a href="#" className="asset-card">
              <div className="asset-icon">🏢</div>
              <div className="asset-name">Real Estate</div>
              <div className="asset-desc">
                Premium residential and commercial properties across major metros.
              </div>
              <div className="asset-link">Learn More →</div>
            </a>
            <a href="#" className="asset-card">
              <div className="asset-icon">⛽</div>
              <div className="asset-name">Fuel & Energy</div>
              <div className="asset-desc">
                Strategic investments in renewable and conventional energy.
              </div>
              <div className="asset-link">Learn More →</div>
            </a>
            <a href="#" className="asset-card">
              <div className="asset-icon">🌾</div>
              <div className="asset-name">Farmland</div>
              <div className="asset-desc">
                Agricultural land with modern farming practices and sustainability.
              </div>
              <div className="asset-link">Learn More →</div>
            </a>
            <a href="#" className="asset-card">
              <div className="asset-icon">🏛️</div>
              <div className="asset-name">Commercial</div>
              <div className="asset-desc">
                High-yield commercial spaces in prime business districts.
              </div>
              <div className="asset-link">Learn More →</div>
            </a>
            <a href="#" className="asset-card full-width">
              <div className="asset-icon">🚀</div>
              <div className="asset-name">Future Ventures</div>
              <div className="asset-desc">
                Exploring new-age businesses and emerging oppurtunities that will define tomorrow's economy.
              </div>
              <div className="asset-link">Explore →</div>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="projects-section" id="featured-projects">
        <div className="projects-header">
          <h2 className="section-title projects-title">
            Featured <em>Projects</em>
          </h2>
          <div className="projects-header-actions">
            <a href="/projects" className="view-all">View All Projects →</a>
            {projects.length > 1 && (
              <div className="project-carousel-controls">
                <button type="button" aria-label="Previous projects" onClick={() => moveProjects(-1)}>←</button>
                <button type="button" aria-label="Next projects" onClick={() => moveProjects(1)}>→</button>
              </div>
            )}
          </div>
        </div>
        {projectsLoading ? (
          <p className="projects-carousel-state" role="status">Loading featured projects...</p>
        ) : projectsError ? (
          <p className="projects-carousel-state" role="alert">{projectsError}</p>
        ) : projects.length === 0 ? (
          <p className="projects-carousel-state">No featured projects available.</p>
        ) : (
          <div className="projects-grid" ref={projectsViewportRef}>
            {projects.map((project) => {
              const category = project.category || "Project";
              const image = project.photos?.[0];
              return (
                <article className="project-card" key={project.id}>
                  <div className={`project-img ${categoryClasses[category] || "proj-real-estate"}`}>
                    {image ? (
                      <img className="project-img-photo" src={image} alt={project.name} loading="lazy" />
                    ) : (
                      <ProjectArtwork category={category} />
                    )}
                    <div className="proj-tag">{category}</div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{project.name}</h3>
                    <div className="project-location">📍 {project.city || project.location || "Location not provided"}</div>
                    <div className="project-returns">
                      <div>
                        <div className="ret-label">Expected ROI</div>
                        <div className="ret-value">{project.expectedROI == null ? "-" : `${project.expectedROI}%`}</div>
                      </div>
                      <div>
                        <div className="ret-label">Tenure</div>
                        <div className="ret-value">
                          {project.tenure == null ? "-" : `${project.tenure} ${Number(project.tenure) === 1 ? "Year" : "Yrs"}`}
                        </div>
                      </div>
                    </div>
                    <button className="project-cta" type="button" onClick={() => setIsSignupStepsOpen(true)}>
                      Invest Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isSignupStepsOpen && (
        <div
          className="signup-steps-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSignupStepsOpen(false);
          }}
        >
          <section
            className="signup-steps-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-steps-title"
          >
            <div className="signup-steps-header">
              <div>
                <p className="signup-steps-eyebrow">INVESTOR ONBOARDING</p>
                <h2 id="signup-steps-title">How to get started</h2>
              </div>
              <button
                className="signup-steps-close"
                type="button"
                aria-label="Close signup steps"
                onClick={() => setIsSignupStepsOpen(false)}
              >
                ×
              </button>
            </div>
            <ol className="signup-steps-list">
              <li><span>01</span><div><strong>Basic Details</strong><p>Enter your personal and contact information.</p></div></li>
              <li><span>02</span><div><strong>Address Information</strong><p>Add your residential address.</p></div></li>
              <li><span>03</span><div><strong>KYC Verification</strong><p>Provide your PAN and Aadhaar details and upload documents.</p></div></li>
              <li><span>04</span><div><strong>Nominee and Bank Details</strong><p>Add your nominee and payment information.</p></div></li>
              <li><span>05</span><div><strong>Earning Preference</strong><p>Choose how you would like to receive earnings.</p></div></li>
            </ol>
            <button
              className="signup-steps-cta"
              type="button"
              onClick={() => navigate(ROUTES.BASIC_INFO)}
            >
              Start Basic Details
            </button>
          </section>
        </div>
      )}

      {isInvestHintOpen && (
        <div
          className="signup-steps-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsInvestHintOpen(false);
          }}
        >
          <section
            className="invest-hint-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="invest-hint-title"
          >
            <button
              className="signup-steps-close"
              type="button"
              aria-label="Close message"
              onClick={() => setIsInvestHintOpen(false)}
            >
              ×
            </button>
            <p className="signup-steps-eyebrow">FEATURED PROJECTS</p>
            <h2 id="invest-hint-title">Ready to sign up?</h2>
            <ol className="signup-steps-list invest-hint-steps">
              <li><span>01</span><div><strong>View the projects</strong><p>Click View Projects below to close this message.</p></div></li>
              <li><span>02</span><div><strong>Choose a project</strong><p>Review the featured projects and click Invest Now on the one you want.</p></div></li>
              <li><span>03</span><div><strong>Start signup</strong><p>In the next popup, click Start Basic Details and complete each registration step.</p></div></li>
            </ol>
            <button
              className="signup-steps-cta"
              type="button"
              onClick={() => setIsInvestHintOpen(false)}
            >
              View Projects
            </button>
          </section>
        </div>
      )}

      {/* WHY US SECTION */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-left">
            <div className="section-eyebrow">
              <div className="section-eyebrow-line"></div>
              <span className="section-eyebrow-text">Why Choose Us</span>
            </div>
            <h2 className="section-title">
              Trust, Transparency <em>& Results</em>
            </h2>
            <p className="why-desc">
              Over a decade of excellence in real estate investment. We combine deep industry expertise with investor-centric approaches to deliver consistent, measurable returns.
            </p>
            <div className="why-pillars">
              <div className="pillar">
                <div className="pillar-num">01</div>
                <div className="pillar-content">
                  <div className="pillar-title">Expert Management</div>
                  <div className="pillar-desc">
                    Seasoned professionals with 25+ years of combined experience.
                  </div>
                </div>
              </div>
              <div className="pillar">
                <div className="pillar-num">02</div>
                <div className="pillar-content">
                  <div className="pillar-title">Transparent Operations</div>
                  <div className="pillar-desc">
                    Real-time portfolio tracking and detailed quarterly reports.
                  </div>
                </div>
              </div>
              <div className="pillar">
                <div className="pillar-num">03</div>
                <div className="pillar-content">
                  <div className="pillar-title">Consistent Returns</div>
                  <div className="pillar-desc">
                    Proven track record with 12-20% annual returns to investors.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="why-right">
            <div className="why-numbers-grid">
              <div className="why-number-card">
                <div className="wn-num">11+</div>
                <div className="wn-label">Years of Excellence</div>
              </div>
              <div className="why-number-card">
                <div className="wn-num">₹500Cr+</div>
                <div className="wn-label">Assets Managed</div>
              </div>
              <div className="why-number-card">
                <div className="wn-num">2500+</div>
                <div className="wn-label">Satisfied Investors</div>
              </div>
              <div className="why-number-card">
                <div className="wn-num">25+</div>
                <div className="wn-label">Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <div className="about-strip">
        <div className="about-left-strip">
          <h2 className="about-strip-title">
            Building <em>Tomorrow's</em> Legacy Today
          </h2>
          <p className="about-strip-text">
            Bhoomani Holdings isn't just an investment firm—we're architects of sustainable growth. Through strategic acquisitions, thoughtful development, and investor-first principles, we're creating assets that stand the test of time.
          </p>
          <a href="#" className="btn-dark">Learn Our Story</a>
        </div>
        <div className="about-right-strip">
          <div className="about-visual">
            <div className="play-btn">▶</div>
          </div>
        </div>
      </div>

      {/* PRESS SECTION */}
      <div className="press-section">
        <div className="press-label">As Featured In</div>
        <div className="press-logos">
          <div className="press-logo">Economic Times</div>
          <div className="press-logo">Moneycontrol</div>
          <div className="press-logo">LiveMint</div>
          <div className="press-logo">Business Today</div>
          <div className="press-logo">Entrepreneur India</div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <div className="cta-text">
          <h2 className="cta-title">Ready to Invest?</h2>
          <p className="cta-sub">Start building your wealth with Bhoomani Holdings today</p>
        </div>
        <div className="cta-actions">
          <a href="#" className="btn-dark">Explore Opportunities</a>
          <a href="#" className="btn-outline-dark">Schedule a Call</a>
        </div>
      </div>
      <Footer />  
    </>
  );
}