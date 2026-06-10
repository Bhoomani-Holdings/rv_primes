import React from "react";
import styles from "./AboutUs.module.css";
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const timeline = [
  {
    year: "2015",
    title: "Foundation",
    desc: "Bhoomani Holdings incorporated in Hyderabad with a vision to democratize premium real estate investment for everyday investors.",
  },
  {
    year: "2017",
    title: "RV Prime Assets Launch",
    desc: "Launched our flagship real estate investment platform, onboarding 200+ investors within the first year of operations.",
  },
  {
    year: "2019",
    title: "Fuel Station Vertical",
    desc: "Entered the high-yield fuel station investment category, partnering with operators across AP and Telangana.",
  },
  {
    year: "2021",
    title: "₹100 Cr Milestone",
    desc: "Crossed ₹100 Crore in assets under management and expanded into farmland and commercial property categories.",
  },
  {
    year: "2023",
    title: "Pan-India Expansion",
    desc: "Expanded presence to 10+ cities, launched Future Ventures division, and surpassed 2,000 active investors.",
  },
];

const assetStats = [
  ["₹500+ Cr", "Assets Under Management"],
  ["2,500+", "Happy Investors"],
  ["25+", "Active Projects"],
  ["10+", "Cities Across India"],
  ["16–24%", "Annual Returns"],
  ["100%", "Transparency & Trust"],
];

const leaders = [
  {
    initials: "RK",
    name: "Rajesh Kumar Sharma",
    role: "Founder & Managing Director",
    bio: "A visionary entrepreneur with 20+ years in real estate and infrastructure. Rajesh founded Bhoomani Holdings with the mission of making premium investments accessible to every Indian investor.",
    accent: "gold",
    socials: ["in", "tw"],
  },
  {
    initials: "PV",
    name: "Priya Venkatesh",
    role: "Chief Financial Officer",
    bio: "A chartered accountant with deep expertise in fund management and financial structuring. Priya ensures every investment is backed by rigorous, transparent governance.",
    accent: "green",
    socials: ["in", "tw"],
  },
  {
    initials: "AM",
    name: "Arjun Mehta",
    role: "Chief Operations Officer",
    bio: "With 15+ years in operations and project management, Arjun drives execution excellence across all active projects, ensuring timely delivery and quality outcomes for every investor.",
    accent: "purple",
    socials: ["in", "tw"],
  },
];

const values = [
  {
    title: "Transparency",
    desc: "Clear processes, regular reporting, and real-time updates. No hidden fees, no fine print surprises — ever.",
    icon: (
      <div className={styles.valueIcon}>
        <div className={styles.valueIconCircle}>
          <div className={styles.valueIconDot} />
        </div>
      </div>
    ),
  },
  {
    title: "Integrity",
    desc: "We do what we say, always. Our track record of honoring commitments is our most valuable asset.",
    icon: <div className={styles.valueDiamond} />,
  },
  {
    title: "Discipline",
    desc: "Rigorous due diligence, conservative underwriting, and patient capital allocation.",
    icon: <div className={styles.valueRing} />,
  },
  {
    title: "Investor First",
    desc: "We grow when our investors grow. Every strategy, every project, every decision starts with one question.",
    icon: <div className={styles.valueBadge} />,
  },
  {
    title: "Innovation",
    desc: "We constantly explore new asset classes, technologies, and structures to give our investors access to the best opportunities.",
    icon: <div className={styles.valueArrow} />,
  },
  {
    title: "Community",
    desc: "Our investments create jobs, develop infrastructure, and strengthen communities — building India alongside building wealth.",
    icon: <div className={styles.valueShield} />,
  },
];

const achievements = [
  ["₹", "₹500+ Crore AUM", "One of India's fastest-growing alternative investment platforms by assets under management."],
  ["★", "Forbes Featured Company", "Recognized by Forbes India, Economic Times, and Mint for investment excellence and investor trust."],
  ["↑", "16–24% Consistent Returns", "Delivered above-market returns to investors across all five asset categories since inception."],
  ["target", "100% Repayment Track Record", "Never missed a single investor repayment in 10 years of operations across 25+ projects."],
  ["⬡", "Startup India Recognized", "Officially recognized by Startup India for innovation in financial services and investment access."],
];

const featured = ["Forbes", "The Economic Times", "BW Businessworld", "Startup India", "Zee Business", "Mint"];

function HeroArt() {
  return (
    <div className={styles.heroArt}>
      <div className={styles.hexagon}>
        <div className={styles.hexagonInner}>
          <div className={styles.hexagonCore}>BH</div>
        </div>
      </div>

      <div className={`${styles.line} ${styles.line1}`} />
      <div className={`${styles.line} ${styles.line2}`} />
      <div className={`${styles.line} ${styles.line3}`} />
      <div className={`${styles.line} ${styles.line4}`} />

      <div className={`${styles.node} ${styles.node1}`} />
      <div className={`${styles.node} ${styles.node2}`} />
      <div className={`${styles.node} ${styles.node3}`} />
      <div className={`${styles.node} ${styles.node4}`} />

      <div className={styles.buildings}>
        <div className={styles.building}></div>
        <div className={`${styles.building} ${styles.tall}`}></div>
        <div className={styles.building}></div>
      </div>
    </div>
  );
}

export default function AboutUs() {
  return (<><Header />
    <div className={styles.aboutus}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLine}></div>
          <p className={styles.heroTag}>About Bhoomani Holdings</p>

          <h1 className={styles.heroTitle}>Our Story</h1>
          <h1 className={`${styles.heroSubtitle} ${styles.gold}`}>of Building</h1>
          <h1 className={styles.heroTitle}>Legacies.</h1>
          <p className={styles.heroDesc}>
            Bhoomani Holdings Private Limited was founded with a singular conviction — that disciplined,
            transparent investing in real assets creates enduring value for investors and communities alike.
          </p>
          <div className={styles.divider}></div>
          <div className={styles.heroStats}>
            <div>
              <h3>10+</h3>
              <span>YEARS OF EXCELLENCE</span>
            </div>
            <div>
              <h3>₹500 Cr</h3>
              <span>ASSETS MANAGED</span>
            </div>
            <div>
              <h3>2,500+</h3>
              <span>INVESTORS SERVED</span>
            </div>
          </div>
        </div>

        <HeroArt />
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.timelineLeft}>
          <div className={styles.heroLine}></div>
          <p className={styles.heroTag}>OUR STORY</p>

          <h2 className={styles.storyTitle}>
            <span className={styles.storyLine1}>A Decade of</span>
            <span className={`${styles.storyLine2} ${styles.gold}`}>Building Trust,</span>
            <span className={styles.storyLine3}>Creating Wealth.</span>
          </h2>

          <p className={styles.storyDesc}>
            Bhoomani Holdings Private Limited was born from a simple belief that every investor deserves access to high-quality,
            income-generating assets — not just the privileged few. Founded in 2015, we set out to democratize premium real estate,
            infrastructure, and agricultural investments across India.
          </p>

          <div className={styles.quote}>
            <p>“We don't just manage capital — we build relationships rooted in trust, transparency, and shared prosperity.”</p>
            <cite>— FOUNDER & MANAGING DIRECTOR, BHOOMANI HOLDINGS</cite>
          </div>

          <p className={styles.storyDesc}>
            Today, Bhoomani Holdings manages over ₹500 Crore in assets across five distinct investment categories — real estate,
            fuel stations, farmland, commercial properties, and future ventures — spanning 10+ cities across India.
          </p>
        </div>

        <div className={styles.timelineRight}>
          <div className={styles.timelineLine}></div>
          {timeline.map((item) => (
            <div key={item.year} className={styles.timelineItem}>
              <div className={styles.timelineMarker}>
                <span className={styles.markerNode}></span>
                <span className={styles.markerYear}>{item.year}</span>
              </div>

              <div className={styles.timelineContent}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.missionVision}>
        <div className={styles.missionBox}>
          <div className={styles.missionIcon} aria-hidden>
            <div className={styles.iconCircle}></div>
          </div>

          <p className={styles.missionTag}>OUR MISSION</p>
          <h2 className={styles.missionHeading}>
            To deliver <span className={styles.gold}>sustainable</span> value to every investor through disciplined investing.
          </h2>
          <p className={styles.missionDesc}>
            We create and manage a diversified portfolio of high-quality assets that generate consistent returns while safeguarding capital. Our mission is built on four pillars: transparency, discipline, diversification, and investor-first thinking — always.
          </p>
        </div>

        <div className={styles.missionBox}>
          <div className={styles.missionIcon} aria-hidden>
            <div className={styles.iconDiamond}></div>
          </div>

          <p className={styles.missionTag}>OUR VISION</p>
          <h2 className={styles.missionHeading}>
            To be India's most <span className={styles.gold}>trusted</span> alternative investment platform by 2030.
          </h2>
          <p className={styles.missionDesc}>
            We envision a future where every Indian investor has access to premium, diversified asset classes that were previously available only to institutions and ultra-high-net-worth individuals. Bhoomani Holdings will be the bridge that makes this future possible.
          </p>
        </div>
      </section>

      <section className={styles.statsStrip}>
        <div className={styles.statsContainer}>
          {assetStats.map(([value, label]) => (
            <div key={label} className={styles.statItem}>
              <h3>{value}</h3>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.leadership}>
        <div className={styles.leadershipIntro}>
          <div className={styles.leadershipHeadline}>
            <div className={styles.heroLine}></div>
            <p className={styles.heroTag}>LEADERSHIP TEAM</p>

            <h2 className={styles.leadershipTitle}>
              The People
              <span> Behind the Vision.</span>
            </h2>
          </div>

          <div className={styles.leadershipTextWrapper}>
            <p className={styles.leadershipText}>
              Our leadership team brings together decades of combined expertise in real estate, finance, operations, and technology. Each leader is personally committed to the success of every investor who trusts us with their capital.
            </p>
          </div>
        </div>

        <div className={styles.leadersGrid}>
          {leaders.map((leader) => (
            <div key={leader.name} className={styles.leaderCard}>
              <div className={`${styles.leaderBanner} ${styles[`${leader.accent}Banner`]}`}>
                <span>{leader.initials}</span>
              </div>

              <div className={styles.leaderInfo}>
                <h3>{leader.name}</h3>
                <p className={styles.role}>{leader.role}</p>
                <p className={styles.leaderBio}>{leader.bio}</p>

                <div className={styles.leaderActions}>
                  {leader.socials.map((social) => (
                    <button key={social} className={styles.socialButton} aria-label={social}>
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.valuesIntro}>
          <div className={styles.heroLine}></div>
          <p className={styles.heroTag}>OUR CORE VALUES</p>
          <h2 className={styles.valuesTitle}>
            Principles We Never
            <span> Compromise.</span>
          </h2>
          <p className={styles.valuesIntroText}>
            Every decision at Bhoomani Holdings — from which project we greenlight to how we communicate with investors — is guided by these six uncompromising values.
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={value.title} className={styles.valueCard} data-number={String(index + 1).padStart(2, "0")}> 
              {value.icon}
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.achievementsSection}>
        <div className={styles.achievementsIntro}>
          <div className={styles.achievementsHeadingWrapper}>
            <div className={styles.heroLine}></div>
            <p className={styles.heroTag}>OUR ACHIEVEMENTS</p>
          </div>
          <h2 className={styles.achievementsTitle}>
            Milestones That <span className={styles.gold}>Define</span> Our Journey.
          </h2>
          <p className={styles.achievementsDesc}>
            Every number we've achieved is backed by hundreds of real investor stories — professionals, families, and entrepreneurs who trusted us with their savings and received consistent, transparent returns in exchange.
          </p>
          <p className={styles.achievementsDesc}>
            Our growth has not been accidental. It has been the result of an unwavering commitment to quality, a conservative investment philosophy, and a leadership team that treats every rupee invested as if it were their own.
          </p>
          <div className={styles.achievementsActions}>
            <button className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              EXPLORE INVESTMENT OPPORTUNITIES
            </button>
            <a className={styles.meetTeamLink} href="#">Meet Our Team →</a>
          </div>
        </div>

        <div className={styles.achievementsGrid}>
          {achievements.map(([icon, title, desc]) => (
            <div key={title} className={styles.achievementItem}>
              <div className={styles.achievementIcon}>
                {icon === "target" ? <div className={styles.targetIcon} /> : icon}
              </div>
              <div>
                <h3 className={styles.achievementTitle}>{title}</h3>
                <p className={styles.achievementDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuredSection}>
        <span className={styles.featuredLabel}>As Featured In</span>
        <div className={styles.featuredList}>
          {featured.map((name) => (
            <span key={name} className={styles.featuredItem}>{name}</span>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaIntro}>
          <h2 className={styles.ctaHeading}>
            Ready to Start<br />
            Your Investment Journey?
          </h2>
          <p className={styles.ctaText}>
            Join 2,500+ investors who trust Bhoomani Holdings for smart, secure, and transparent investments.
          </p>
        </div>

        <div className={styles.ctaActions}>
          <button className={`${styles.ctaButton} ${styles.ctaExplorer}`}>
            EXPLORE OPPORTUNITIES
          </button>
          <button className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
            CONTACT US
          </button>
        </div>
      </section>
    </div>
    <Footer />
  </>);
}
