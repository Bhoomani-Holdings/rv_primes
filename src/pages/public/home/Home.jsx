import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/routesPath';
import { getProjects } from '../../../services/dashboardService';
import './Home.css';
import realEstateImg from '../../../assets/ecosystem/real-estate.jpg';
import fuelEnergyImg from '../../../assets/ecosystem/fuel-energy.jpg';
import farmlandImg from '../../../assets/ecosystem/farmland.jpg';
import solarEnergyImg from '../../../assets/ecosystem/solar-energy.jpg';
import commercialImg from '../../../assets/ecosystem/commercial.jpg';
import futureVenturesImg from '../../../assets/ecosystem/future-ventures.jpg';
import futureVenturesVideo from '../../../assets/ecosystem/future-ventures-horizontal.mp4';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const ecosystemAssets = [
  {
    icon: '🏢',
    name: 'Real Estate',
    desc: 'Premium residential and commercial properties across major metros.',
    cta: 'Learn More →',
    image: realEstateImg,
    video: futureVenturesVideo,
    alt: 'Residential high-rise towers',
  },
  {
    icon: '⛽',
    name: 'Fuel & Energy',
    desc: 'Strategic investments in renewable and conventional energy.',
    cta: 'Learn More →',
    image: fuelEnergyImg,
    video: futureVenturesVideo,
    alt: 'Modern fuel and EV fast-charging station',
  },
  {
    icon: '🌾',
    name: 'Farmland',
    desc: 'Agricultural land with modern farming practices and sustainability.',
    cta: 'Learn More →',
    image: farmlandImg,
    video: futureVenturesVideo,
    alt: 'Aerial view of modern farmland with greenhouses and wind turbines',
  },
  {
    icon: '🏛️',
    name: 'Commercial',
    desc: 'High-yield commercial spaces in prime business districts.',
    cta: 'Learn More →',
    image: commercialImg,
    video: futureVenturesVideo,
    alt: 'Commercial towers in a city business district',
  },
  {
    icon: '🚀',
    name: 'Future Ventures',
    desc: "Exploring new-age businesses and emerging opportunities that will define tomorrow's economy.",
    cta: 'Explore →',
    image: futureVenturesImg,
    video: futureVenturesVideo,
    alt: 'Future Ventures: a plant growing inside a glass dome above a city skyline',
    fullWidth: true,
  },
];

const projectCategoryClasses = {
  'Real Estate': 'proj-real-estate',
  Energy: 'proj-fuel',
  Farmland: 'proj-farmland',
  Commercial: 'proj-commercial',
};

function ProjectArtwork({ category }) {
  if (category === 'Energy') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <circle cx="150" cy="110" r="80" fill="rgba(248,232,183,.08)" stroke="rgba(248,232,183,.3)" />
      </svg>
    );
  }

  if (category === 'Farmland') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <path d="M50 120Q150 50 250 120v60H50z" fill="rgba(248,232,183,.08)" stroke="rgba(248,232,183,.3)" />
      </svg>
    );
  }

  if (category === 'Commercial') {
    return (
      <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <rect x="60" y="60" width="80" height="100" fill="rgba(248,232,183,.08)" stroke="rgba(248,232,183,.3)" />
        <rect x="160" y="60" width="80" height="100" fill="rgba(248,232,183,.12)" stroke="rgba(248,232,183,.3)" />
      </svg>
    );
  }

  return (
    <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" aria-hidden="true">
      <rect x="40" y="50" width="220" height="140" fill="rgba(248,232,183,.1)" stroke="rgba(248,232,183,.3)" />
      <line x1="40" y1="90" x2="260" y2="90" stroke="rgba(248,232,183,.25)" />
      <line x1="40" y1="130" x2="260" y2="130" stroke="rgba(248,232,183,.25)" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRefs = useRef({});
  const projectsViewportRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');
  const [isSignupStepsOpen, setIsSignupStepsOpen] = useState(false);
  const [signupPopupMode, setSignupPopupMode] = useState('onboarding');

  useEffect(() => {
    if (!location.state?.showInvestHint) return;
    setSignupPopupMode('guide');
    setIsSignupStepsOpen(true);
    navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true, state: null });
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setProjectsError('Unable to load featured projects.');
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

    const styles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    viewport.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: 'smooth',
    });
  };

  const playCardVideo = (name) => {
    const videos = videoRefs.current[name] || [];
    videos.forEach((video) => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  };

  const resetCardVideo = (name) => {
    const videos = videoRefs.current[name] || [];
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  };

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
              Since 2026
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
            <div className="hero-collage">
              <div className="hc-main">
                <img src={realEstateImg} alt="Real estate projects" />
                <span className="hc-tag">Real Estate</span>
              </div>
              <div className="hc-card hc-card-1">
                <img src={farmlandImg} alt="Farmland projects" />
                <span className="hc-tag">Farmland</span>
              </div>
              <div className="hc-card hc-card-2">
                <img src={commercialImg} alt="Commercial projects" />
                <span className="hc-tag">Commercial</span>
              </div>
              <div className="hc-card hc-card-3">
                <img src={solarEnergyImg} alt="Solar energy projects" />
                <span className="hc-tag">Solar Energy</span>
              </div>
              <div className="hc-badge">
                <strong>Multi-Sector</strong>
                <span>Income-generating assets</span>
              </div>
            </div>

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
            {ecosystemAssets.map((asset) => (
              <a
                href="#"
                key={asset.name}
                className={`asset-card${asset.fullWidth ? ' full-width' : ''}`}
                onPointerEnter={() => asset.video && playCardVideo(asset.name)}
                onPointerLeave={() => asset.video && resetCardVideo(asset.name)}
                onFocus={() => asset.video && playCardVideo(asset.name)}
                onBlur={() => asset.video && resetCardVideo(asset.name)}
              >
                <img
                  className="asset-bg"
                  src={asset.image}
                  alt={asset.alt}
                  loading="lazy"
                  decoding="async"
                />
                {asset.video && (
                  <div className="asset-video-shell" aria-hidden="true">
                    <video
                      ref={(video) => {
                        if (video) {
                          videoRefs.current[asset.name] = [
                            ...(videoRefs.current[asset.name] || []).filter((item) => item !== video),
                            video,
                          ];
                        }
                      }}
                      className="asset-video asset-video-backdrop"
                      src={asset.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <video
                      ref={(video) => {
                        if (video) {
                          videoRefs.current[asset.name] = [
                            ...(videoRefs.current[asset.name] || []).filter((item) => item !== video),
                            video,
                          ];
                        }
                      }}
                      className="asset-video asset-video-foreground"
                      src={asset.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <span className="asset-video-label">Hover preview</span>
                  </div>
                )}
                <div className="asset-content">
                  <div className="asset-icon">{asset.icon}</div>
                  <div className="asset-name">{asset.name}</div>
                  <div className="asset-desc">{asset.desc}</div>
                  <div className="asset-link">{asset.cta}</div>
                </div>
              </a>
            ))}
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
            <Link to={ROUTES.PROJECTS} className="view-all">View All Projects →</Link>
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
            {[...projects].sort((first, second) => Number(second.id) - Number(first.id)).map((project) => {
              const category = project.category || 'Project';
              const image = project.photos?.[0];
              return (
                <article className="project-card" key={project.id}>
                  <div className={`project-img ${projectCategoryClasses[category] || 'proj-real-estate'}`}>
                    {image ? (
                      <img className="project-img-photo" src={image} alt={project.name || 'Project'} loading="lazy" />
                    ) : (
                      <ProjectArtwork category={category} />
                    )}
                    <div className="proj-tag">{category}</div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{project.name || 'Untitled project'}</h3>
                    <div className="project-location">📍 {project.city || project.location || 'Location not provided'}</div>
                    <div className="project-returns">
                      <div>
                        <div className="ret-label">Expected ROI</div>
                        <div className="ret-value">{project.expectedROI == null ? '-' : `${project.expectedROI}%`}</div>
                      </div>
                      <div>
                        <div className="ret-label">Tenure</div>
                        <div className="ret-value">
                          {project.tenure == null ? '-' : `${project.tenure} ${Number(project.tenure) === 1 ? 'Year' : 'Yrs'}`}
                        </div>
                      </div>
                    </div>
                    <button className="project-cta" type="button" onClick={() => navigate(ROUTES.BASIC_INFO)}>
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
        <div className="signup-steps-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsSignupStepsOpen(false);
        }}>
          <section className={`signup-steps-dialog${signupPopupMode === 'guide' ? ' is-guide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="signup-steps-title">
            <div className="signup-steps-header">
              <div>
                <p className="signup-steps-eyebrow">{signupPopupMode === 'guide' ? 'INVESTOR SIGN UP' : 'INVESTOR ONBOARDING'}</p>
                <h2 id="signup-steps-title">{signupPopupMode === 'guide' ? 'Start with a featured project' : 'How to get started'}</h2>
              </div>
              <button className="signup-steps-close" type="button" aria-label="Close signup steps" onClick={() => setIsSignupStepsOpen(false)}>
                ×
              </button>
            </div>
            {signupPopupMode === 'guide' ? (
              <>
                <p className="signup-steps-intro">To sign up as an investor, choose a project in <strong>Featured Projects</strong>, then click its <strong>Invest Now</strong> button.</p>
                <ol className="signup-steps-list">
                  <li><span>01</span><div><strong>Choose a project</strong><p>Browse the featured projects and select one you are interested in.</p></div></li>
                  <li><span>02</span><div><strong>Click Invest Now</strong><p>Use the button on that project's card to begin investor signup.</p></div></li>
                  <li><span>03</span><div><strong>Complete registration</strong><p>Follow the steps to enter your details and submit your investor application.</p></div></li>
                </ol>
                <button className="signup-steps-cta" type="button" onClick={() => { setIsSignupStepsOpen(false); document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  View Featured Projects
                </button>
              </>
            ) : (
              <>
                <p className="signup-steps-intro">Complete these steps to create your investor account:</p>
                <ol className="signup-steps-list">
                  <li><span>01</span><div><strong>Basic Details</strong><p>Enter your personal and contact information.</p></div></li>
                  <li><span>02</span><div><strong>Address Information</strong><p>Add your residential address.</p></div></li>
                  <li><span>03</span><div><strong>KYC Verification</strong><p>Provide your PAN and Aadhaar details and upload documents.</p></div></li>
                  <li><span>04</span><div><strong>Nominee and Bank Details</strong><p>Add your nominee and payment information.</p></div></li>
                  <li><span>05</span><div><strong>Earning Preference</strong><p>Choose how you would like to receive earnings.</p></div></li>
                </ol>
                <button className="signup-steps-cta" type="button" onClick={() => navigate(ROUTES.BASIC_INFO)}>
                  Start Basic Details
                </button>
              </>
            )}
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
