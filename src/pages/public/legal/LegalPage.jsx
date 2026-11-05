import React from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import styles from "./LegalPage.module.css";

const legalContent = {
  "/privacy-policy": {
    eyebrow: "Privacy & Data Protection", title: "Privacy Policy", intro: "Your trust matters to us. This page explains how Bhoomani Holdings Private Limited may collect, use, store and protect information when you visit our website or use our services.", updated: "17 October 2026",
    sections: [
      ["1. Information We May Collect", "Depending on how you interact with the website, we may collect contact details, account and registration information, identity/KYC documents where required, communications you send us, and basic technical data such as browser type and website usage."],
      ["2. How Information Is Used", "Information may be used to respond to enquiries, create and manage accounts, verify identity, provide project or service updates, maintain security, meet legal and regulatory obligations, and improve our website and customer experience."],
      ["3. Sharing and Disclosure", "We do not intend to sell personal information. Information may be shared with authorised service providers, professional advisers, verification partners or competent authorities when needed to provide services, protect users, or comply with applicable law."],
      ["4. Security and Retention", "We use reasonable administrative and technical safeguards designed to protect information. No online transmission or storage method can be guaranteed completely secure. We retain information only for as long as reasonably necessary for the purposes described or as required by law."],
      ["5. Cookies and Third-Party Links", "The website may use essential cookies or similar technologies for functionality and performance. External websites may have their own privacy practices, which we encourage you to review before sharing information with them."],
      ["6. Your Choices and Contact", "You may contact us to request access, correction or clarification regarding personal information, subject to applicable law and verification requirements. Contact: info@bhoomaniholdings.com."],
    ]
  },
  "/kyc-policy": {
    eyebrow: "Verification & Compliance", title: "KYC Policy", intro: "Know Your Customer (KYC) procedures help Bhoomani Holdings verify identity, maintain accurate records and support compliance with applicable legal and regulatory requirements.", updated: "17 October 2026",
    sections: [
      ["1. Purpose", "KYC checks are intended to help prevent identity misuse, fraud, impersonation, money laundering and other prohibited activity, and to support a safer and more transparent customer experience."],
      ["2. Information and Documents", "Depending on the service and applicable requirements, you may be asked to provide identity and address proof, PAN or other tax details, a photograph, bank-account verification, beneficial ownership information, or additional supporting documents."],
      ["3. Verification Process", "Documents and information may be reviewed manually or through authorised verification providers. We may ask for clearer copies, updated information or additional evidence where the information supplied is incomplete or cannot be verified."],
      ["4. Accuracy and Updates", "Please provide accurate, current and complete information and notify us if relevant details change. Submitting false, misleading, altered or another person's documents may result in rejection, suspension or other action permitted by law."],
      ["5. Data Handling", "KYC information is handled for verification, account administration, risk management and legal compliance, with access limited as reasonably necessary. Records may be retained for periods required by applicable law."],
      ["6. Review or Further Assistance", "Access to certain features or transactions may remain limited until required checks are complete. For questions about verification, contact info@bhoomaniholdings.com. Requirements may vary by service and applicable law."],
    ]
  },
  "/disclaimer": {
    eyebrow: "Important Information", title: "Disclaimer", intro: "The information on this website is provided for general informational purposes about Bhoomani Holdings Private Limited and its business activities. Please read it carefully before relying on website content.", updated: "17 October 2026",
    sections: [
      ["1. General Information", "We aim to keep website content clear and current, but information may be incomplete, subject to change or contain errors. Content is provided on an informational basis and should not be treated as a guarantee or a substitute for reviewing formal documentation."],
      ["2. No Investment Advice or Offer", "Nothing on this website by itself constitutes investment, financial, legal, tax or accounting advice, or an offer, invitation or solicitation to buy a security or participate in an investment. Any opportunity, if made available, is governed by its specific documents and eligibility requirements."],
      ["3. Risks and No Guarantee", "Asset-related projects and business activities may involve market, operational, regulatory, liquidity, environmental and other risks. Past performance or illustrative projections, if shown, do not guarantee future results. Returns, timelines and outcomes are not guaranteed unless expressly stated in a binding written agreement."],
      ["4. Forward-Looking Statements", "Statements about plans, objectives, expectations or future development reflect current intentions and assumptions and may change. Actual outcomes may differ materially due to factors beyond our control."],
      ["5. External Links", "Links to third-party websites are provided for convenience. We do not control or endorse all third-party content and are not responsible for its availability, accuracy or privacy practices."],
      ["6. Seek Independent Advice", "Please review the relevant contractual documents and seek independent professional advice before making legal, tax or financial decisions. Nothing in this disclaimer excludes liability where exclusion is not permitted by applicable law."],
    ]
  },
  "/terms-and-conditions": {
    eyebrow: "Website Use & Responsibilities", title: "Terms & Conditions", intro: "These terms describe the basic conditions for accessing and using the Bhoomani Holdings website. By using the website, you agree to use it lawfully and responsibly. Separate terms may apply to specific products, accounts or projects.", updated: "17 October 2026",
    sections: [
      ["1. Website Use", "You may use this website for lawful, personal or business information purposes. You must not misuse the website, attempt unauthorised access, interfere with its operation, introduce malicious code, or use it in a way that violates applicable law or another person's rights."],
      ["2. Information and Changes", "Website content is provided for general information and may be updated, corrected, suspended or withdrawn without prior notice. We do not guarantee uninterrupted availability or that every item of information will always be complete or current."],
      ["3. Accounts and Submissions", "Where registration or document submission is available, you are responsible for providing accurate information, protecting your credentials and promptly notifying us of suspected unauthorised use. We may request verification or restrict access where reasonably necessary for security or compliance."],
      ["4. Intellectual Property", "Unless otherwise stated, website text, branding, design and other materials are owned by or used with permission by the relevant rights holders. You may not reproduce, distribute or commercially exploit them without prior permission, except where permitted by law."],
      ["5. Third-Party Services", "The website may link to or rely on third-party services. Their terms and privacy policies may apply to your use of those services, and we are not responsible for matters outside our reasonable control."],
      ["6. No Guarantee; Limitation", "Website content is not a promise of any particular business, project or financial outcome. To the extent permitted by law, we are not liable for indirect loss arising from use of, or inability to use, the website. Nothing here limits rights or liabilities that cannot legally be limited."],
      ["7. Governing Law and Contact", "These website terms are subject to applicable laws of India. Any dispute will be handled by the competent courts or authorities as provided by applicable law. For questions, contact info@bhoomaniholdings.com."],
    ]
  }
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "").replace("/terms-of-use", "/terms-and-conditions");
  const page = legalContent[path] || legalContent["/privacy-policy"];
  return <div className={styles.page}>
    <Header />
    <main className={styles.legalPage}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.hero}>
        <div className={styles.eyebrow}><span />{page.eyebrow}</div>
        <h1>{page.title}<em>.</em></h1>
        <p>{page.intro}</p>
        <div className={styles.meta}><span className={styles.metaDot} /> Last updated: {page.updated}</div>
      </div>
      <div className={styles.contentWrap}>
        <aside className={styles.sidebar}>
          <span className={styles.sideLabel}>LEGAL CENTRE</span>
          <h2>Explore policies</h2>
          <Link to="/privacy-policy" className={path === "/privacy-policy" ? styles.active : ""}>Privacy Policy <span>↗</span></Link>
          <Link to="/kyc-policy" className={path === "/kyc-policy" ? styles.active : ""}>KYC Policy <span>↗</span></Link>
          <Link to="/disclaimer" className={path === "/disclaimer" ? styles.active : ""}>Disclaimer <span>↗</span></Link>
          <Link to="/terms-and-conditions" className={path === "/terms-and-conditions" ? styles.active : ""}>Terms & Conditions <span>↗</span></Link>
          <div className={styles.helpCard}><div className={styles.helpIcon}>✦</div><strong>Need clarification?</strong><p>Our team can help with questions about these policies.</p><a href="mailto:info@bhoomaniholdings.com">Contact our team ↗</a></div>
        </aside>
        <article className={styles.article}>
          <div className={styles.articleTop}><span>BH</span><div><strong>Bhoomani Holdings</strong><small>Policy & legal information</small></div></div>
          {page.sections.map(([heading, body], index) => <section className={styles.policySection} key={heading}><div className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</div><div><h2>{heading}</h2><p>{body}</p></div></section>)}
          <div className={styles.note}><span>ⓘ</span><p><strong>Please note:</strong> This page provides general website policy information and is not a substitute for legal advice. Have the final wording reviewed by your legal/compliance adviser before publishing, especially where financial products, investments or regulated services are involved.</p></div>
        </article>
      </div>
      <div className={styles.bottomCta}><div><span>BH / LEGAL</span><h2>Clarity builds trust.</h2><p>We believe clear information is an important part of responsible business.</p></div><Link to="/contact">Contact us <span>↗</span></Link></div>
    </main>
    <Footer />
  </div>;
}
