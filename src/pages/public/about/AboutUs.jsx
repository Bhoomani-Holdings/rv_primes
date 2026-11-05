import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import styles from "./AboutUs.module.css";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { missionPoints, sectors, approach, principles, techPoints } from "./aboutData";
import heroPic from "../../../assets/aboutus/d-hero.svg";
import landscape from "../../../assets/aboutus/d-landscape.svg";
import imgSolar from "../../../assets/aboutus/d-solar.svg";
import imgAgri from "../../../assets/aboutus/d-agri.svg";
import imgRealEstate from "../../../assets/aboutus/d-realestate.svg";
import imgTech from "../../../assets/aboutus/d-tech.svg";
import imgEducation from "../../../assets/aboutus/d-education.svg";
import imgHospitality from "../../../assets/aboutus/d-hospitality.svg";
import tPlant from "../../../assets/aboutus/t-plantation.svg";
import tSolar from "../../../assets/aboutus/t-solar.svg";

const sectorImages = [imgSolar, imgAgri, imgRealEstate, imgTech, imgEducation, imgHospitality];
const pillars = ["Assets", "Expertise", "Operations", "Technology", "Capital"];
const values = ["Accessibility", "Transparency", "Responsibility", "Long-Term Thinking", "Collective Growth"];

/* fade / slide in when scrolled into view */
function Reveal({ delay = 0, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add(styles.visible);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${styles.reveal} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Tag({ children, className = "" }) {
  return (
    <div className={`${styles.tag} ${className}`}>
      <span className={styles.tagText}>{children}</span>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.about}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroDots}></div>
          <div className={styles.heroText}>
            <Tag className={styles.heroTag}>About Bhoomani Holdings</Tag>
            <h1 className={styles.heroTitle}>
              Building Access <em>To Real Assets.</em>
            </h1>
            <p className={styles.heroTagline}>Creating opportunities for long-term growth.</p>
            <p className={styles.lead}>
              <strong>Bhoomani Holdings Private Limited</strong> is an India-based holding company
              building a multi-sector real-asset platform focused on creating accessible
              opportunities across agriculture, renewable energy, real estate, hospitality,
              technology, education and other asset-focused sectors.
            </p>
            <p className={styles.lead}>
              We believe participation in real assets should not always be limited by high entry
              barriers. Our vision is to explore and structure opportunities that allow individuals
              to participate in selected asset-backed projects through clearly defined models,
              documented terms and responsible decision-making.
            </p>
            <p className={styles.lead}>
              Our approach is built around{" "}
              <strong>accessibility, transparency, responsible structuring and long-term value creation.</strong>
            </p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroPic} style={{ backgroundImage: `url(${heroPic})` }}></div>
            </div>
            <span className={`${styles.float} ${styles.f1}`}>Renewable Energy</span>
            <span className={`${styles.float} ${styles.f2}`}>Agriculture</span>
            <span className={`${styles.float} ${styles.f3}`}>Real Estate</span>
            <div className={styles.seal}>
              <i></i>
              <span>Real<br />Assets</span>
            </div>
          </div>
        </section>

        {/* VALUES BAND */}
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandTrack}>
            {[...values, ...values, ...values, ...values].map((v, i) => (
              <span key={i}>{v}<b></b></span>
            ))}
          </div>
        </div>

        {/* WHO WE ARE */}
        <section className={`${styles.section} ${styles.who} ${styles.tTeal}`}>
          <Reveal className={styles.whoPics}>
            <div className={styles.arch} style={{ backgroundImage: `url(${imgSolar})` }}></div>
            <div className={styles.circle} style={{ backgroundImage: `url(${imgAgri})` }}></div>
            <div className={styles.pill}><strong>Multi-Sector</strong><small>Real-Asset Platform</small></div>
          </Reveal>
          <Reveal delay={120}>
            <Tag>Who We Are</Tag>
            <h2 className={styles.title}>A Diversified Platform <em>Built Around Real Assets</em></h2>
            <p className={styles.body}>
              Bhoomani Holdings Private Limited is being developed as a diversified platform that
              brings together opportunities across multiple sectors. Rather than focusing on a
              single industry, we are building a broader ecosystem around tangible assets, operating
              projects and strategic opportunities.
            </p>
            <p className={styles.body}>
              Our current focus includes renewable energy and agriculture, while our roadmap extends
              into real estate, education, technology, hospitality and other emerging sectors. We
              work with project stakeholders and strategic partners where appropriate to explore
              opportunities and develop participation models aligned with the underlying asset and
              project structure.
            </p>
          </Reveal>
        </section>

        {/* VISION */}
        <section className={`${styles.vision} ${styles.tSky}`} style={{ backgroundImage: `url(${landscape})` }}>
          <Reveal className={styles.visionCard}>
            <Tag>Our Vision</Tag>
            <h2 className={styles.title}>Making Real-Asset Participation <em>More Accessible</em></h2>
            <p className={styles.body}>
              Our long-term vision is to build a platform where more people can explore
              participation in carefully selected real-asset opportunities with greater clarity and
              understanding. We want to move beyond the traditional perception that meaningful asset
              participation always requires substantial capital.
            </p>
            <p className={styles.body}>
              Through lower entry points, structured opportunities and transparent information, we
              aim to create a pathway for individuals to explore real-asset participation while
              understanding the associated terms, risks and responsibilities.
            </p>
          </Reveal>
        </section>

        {/* MISSION – side image + cards */}
        <section className={`${styles.section} ${styles.mission} ${styles.tCoral}`}>
          <div className={styles.split}>
            <Reveal className={styles.sideArt}>
              <div className={styles.sidePic} style={{ backgroundImage: `url(${tPlant})` }}></div>
              <span className={styles.sideBadge}>Agriculture &amp; Renewable Energy</span>
            </Reveal>
            <div>
              <Reveal>
                <Tag>Our Mission</Tag>
                <h2 className={styles.title}>What We're <em>Working Toward</em></h2>
              </Reveal>
              <div className={styles.missionGrid}>
                {missionPoints.map((p, i) => (
                  <Reveal key={p} delay={(i % 2) * 80} className={styles.mCard}>
                    <span className={styles.mNum}>{i + 1}</span>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS – bento grid */}
        <section className={`${styles.section} ${styles.sectors} ${styles.tViolet}`}>
          <Reveal>
            <Tag>What We Focus On</Tag>
            <h2 className={styles.title}>Sectors <em>We're Building Across</em></h2>
          </Reveal>
          <div className={styles.bento}>
            {sectors.map((s, i) => (
              <Reveal key={s.name} delay={(i % 3) * 100} className={`${styles.bCard} ${styles["b" + (i + 1)]}`}>
                <div className={styles.bImg} style={{ backgroundImage: `url(${sectorImages[i]})` }}></div>
                <div className={styles.bText}>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* APPROACH – zig-zag timeline */}
        <section className={`${styles.section} ${styles.approach} ${styles.tBlue}`}>
          <Reveal>
            <Tag>Our Approach</Tag>
            <h2 className={styles.title}>From Opportunity <em>to Participation</em></h2>
          </Reveal>
          <div className={styles.zig}>
            {approach.map((a, i) => (
              <Reveal key={a.num} className={styles.zStep}>
                <span className={styles.zNode}>{a.num}</span>
                <div className={styles.zCard}>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRINCIPLES – cards + side image */}
        <section className={`${styles.section} ${styles.principles} ${styles.tRose}`}>
          <div className={`${styles.split} ${styles.splitRev}`}>
            <div>
              <Reveal>
                <Tag>Our Core Principles</Tag>
                <h2 className={styles.title}>The Values That <em>Guide Us</em></h2>
              </Reveal>
              <div className={styles.pGrid}>
                {principles.map((p, i) => (
                  <Reveal key={p.title} delay={(i % 2) * 90} className={styles.pCard}>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal className={styles.sideArt}>
              <div className={styles.sidePic} style={{ backgroundImage: `url(${tSolar})` }}></div>
              <span className={styles.sideBadge}>Built for the long term</span>
            </Reveal>
          </div>
        </section>

        {/* STRATEGIC RELATIONSHIPS */}
        <section className={`${styles.section} ${styles.strategic}`}>
          <Reveal className={styles.strategicText}>
            <h2 className={styles.title}>Building Through <em>Strategic Relationships</em></h2>
            <p className={styles.body}>
              Our approach involves working with project stakeholders, operating partners and
              strategic collaborators where appropriate. These relationships can help bring together
              Assets, Expertise, Operations, Technology and Capital Participation — creating a
              stronger ecosystem around each opportunity while maintaining clarity around the
              underlying project structure and responsibilities of each stakeholder.
            </p>
          </Reveal>
          <div className={styles.pillars}>
            {pillars.map((p, i) => (
              <Reveal key={p} delay={i * 90} className={`${styles.pillar} ${styles["pl" + (i + 1)]}`}>
                <span>{p}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className={`${styles.section} ${styles.tech} ${styles.tCyan}`} style={{ backgroundImage: `url(${imgTech})` }}>
          <div className={styles.techShade}></div>
          <div className={styles.techInner}>
            <Reveal>
              <Tag>Technology at the Core</Tag>
              <h2 className={`${styles.title} ${styles.onDark}`}>Technology Is Part of <em>How We Build</em></h2>
              <p className={`${styles.body} ${styles.onDark}`}>
                Technology is not separate from our vision — it is an important part of how we intend
                to build the business. We are working toward digital platforms that can make it easier to:
              </p>
            </Reveal>
            <div className={styles.techGrid}>
              {techPoints.map((p, i) => (
                <Reveal key={p} delay={(i % 4) * 70} className={styles.techChip}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LOOKING AHEAD */}
        <section className={`${styles.section} ${styles.ahead} ${styles.tGreen}`}>
          <div className={styles.aheadPic} style={{ backgroundImage: `url(${landscape})` }}></div>
          <Reveal className={styles.aheadInner}>
            <Tag>Looking Ahead</Tag>
            <h2 className={`${styles.title} ${styles.onDark}`}>Built With a <em>Long-Term Perspective</em></h2>
            <div className={styles.cols}>
              <p className={styles.glass}>
                Bhoomani Holdings is being built with a long-term perspective. Today, our focus is on
                developing opportunities around renewable energy and agriculture while laying the
                foundation for expansion into additional asset-focused sectors. Tomorrow, we envision
                a broader platform connecting people with opportunities across multiple real-asset categories.
              </p>
              <p className={styles.glass}>
                Our journey is not simply about expanding into more sectors. It is about building a
                trusted, technology-enabled ecosystem for exploring real assets and long-term opportunities.
              </p>
            </div>
          </Reveal>
        </section>

        {/* COMMITMENT */}
        <section className={`${styles.commit}`}>
          <Reveal>
            <h2>Every opportunity has its own structure, terms, eligibility requirements and risks.</h2>
            <p>
              We are committed to presenting opportunities responsibly and encouraging interested
              participants to carefully review the relevant project documentation before making any
              decision. We believe informed participation is better than uninformed expectation.
            </p>
          </Reveal>
        </section>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>Bhoomani Holdings</h2>
            <p className={styles.ctaSub}>Collective Growth. Secure Future.</p>
            <p className={styles.ctaLine}>Explore opportunities. Understand the structure. Make informed decisions.</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link to={ROUTES.PROJECTS} className={styles.btnDark}>Explore Opportunities</Link>
            <Link to={ROUTES.CONTACT} className={styles.btnLight}>Contact Us</Link>
          </div>
        </div>

        <p className={styles.legal}>
          All opportunities are subject to applicable project documents, agreements, eligibility
          requirements, legal and regulatory conditions, and other applicable terms. Any reference to
          potential income, appreciation or returns is subject to the specific project structure and
          documentation and should not be interpreted as a guarantee unless expressly documented.
        </p>
      </div>
      <Footer />
    </div>
  );
}
