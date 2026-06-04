import React from 'react';
import './Home.css';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

export default function Home() {
 

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
      <section className="projects-section">
        <div className="projects-header">
          <h2 className="section-title projects-title">
            Featured <em>Projects</em>
          </h2>
          <a href="#" className="view-all">View All Projects →</a>
        </div>
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-img proj-real-estate">
              <svg
                className="project-img-visual"
                viewBox="0 0 300 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="40" y="50" width="220" height="140" fill="rgba(248, 232, 183, 0.1)" stroke="rgba(248, 232, 183, 0.2)" />
                <line x1="40" y1="80" x2="260" y2="80" stroke="rgba(248, 232, 183, 0.1)" />
                <line x1="40" y1="110" x2="260" y2="110" stroke="rgba(248, 232, 183, 0.1)" />
                <line x1="40" y1="140" x2="260" y2="140" stroke="rgba(248, 232, 183, 0.1)" />
              </svg>
            </div>
            <div className="project-body">
              <div className="proj-tag">Real Estate</div>
              <h3 className="project-name">Metro Residency</h3>
              <div className="project-location">📍 Mumbai</div>
              <div className="project-returns">
                <div>
                  <div className="ret-label">Expected ROI</div>
                  <div className="ret-value">18%</div>
                </div>
                <div>
                  <div className="ret-label">Tenure</div>
                  <div className="ret-value">5 Yrs</div>
                </div>
              </div>
              <button className="project-cta">Invest Now</button>
            </div>
          </div>

          <div className="project-card">
            <div className="project-img proj-fuel">
              <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="110" r="80" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
              </svg>
            </div>
            <div className="project-body">
              <div className="proj-tag">Energy</div>
              <h3 className="project-name">Solar Farm</h3>
              <div className="project-location">📍 Gujarat</div>
              <div className="project-returns">
                <div>
                  <div className="ret-label">Expected ROI</div>
                  <div className="ret-value">15%</div>
                </div>
                <div>
                  <div className="ret-label">Tenure</div>
                  <div className="ret-value">7 Yrs</div>
                </div>
              </div>
              <button className="project-cta">Invest Now</button>
            </div>
          </div>

          <div className="project-card">
            <div className="project-img proj-farmland">
              <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 120 Q 150 50 250 120 L 250 180 L 50 180 Z" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
              </svg>
            </div>
            <div className="project-body">
              <div className="proj-tag">Farmland</div>
              <h3 className="project-name">Premium Agriland</h3>
              <div className="project-location">📍 Karnataka</div>
              <div className="project-returns">
                <div>
                  <div className="ret-label">Expected ROI</div>
                  <div className="ret-value">12%</div>
                </div>
                <div>
                  <div className="ret-label">Tenure</div>
                  <div className="ret-value">10 Yrs</div>
                </div>
              </div>
              <button className="project-cta">Invest Now</button>
            </div>
          </div>

          <div className="project-card">
            <div className="project-img proj-commercial">
              <svg className="project-img-visual" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="60" y="60" width="80" height="100" fill="rgba(248, 232, 183, 0.08)" stroke="rgba(248, 232, 183, 0.15)" />
                <rect x="160" y="60" width="80" height="100" fill="rgba(248, 232, 183, 0.12)" stroke="rgba(248, 232, 183, 0.15)" />
              </svg>
            </div>
            <div className="project-body">
              <div className="proj-tag">Commercial</div>
              <h3 className="project-name">Tech Hub Plaza</h3>
              <div className="project-location">📍 Bangalore</div>
              <div className="project-returns">
                <div>
                  <div className="ret-label">Expected ROI</div>
                  <div className="ret-value">20%</div>
                </div>
                <div>
                  <div className="ret-label">Tenure</div>
                  <div className="ret-value">5 Yrs</div>
                </div>
              </div>
              <button className="project-cta">Invest Now</button>
            </div>
          </div>
        </div>
      </section>

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