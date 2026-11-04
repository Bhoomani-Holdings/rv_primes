import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';
import { ROUTES } from '../../../routes/routesPath';
import '../publicinfo/PublicInfoPage.css';
import './Sitemap.css';

const groups = [
  ['Company', [['Home', ROUTES.HOME], ['About Us', ROUTES.ABOUT_US], ['Our Business', ROUTES.OUR_BUSINESS], ['Our Team', ROUTES.OUR_TEAM], ['News & Updates', ROUTES.NEWS_AND_UPDATES], ['Careers', ROUTES.CAREERS], ['Contact', ROUTES.CONTACT]]],
  ['Investors', [['Investor Opportunities', ROUTES.INVESTOR_OPPORTUNITIES], ['How It Works', ROUTES.HOW_IT_WORKS], ['Investor Login', ROUTES.LOGIN], ['Refund Policy', ROUTES.REFUND_POLICY], ['FAQs', ROUTES.FAQS], ['Documents', ROUTES.DOCUMENTS]]],
  ['Legal', [['Privacy Policy', ROUTES.PRIVACY_POLICY], ['KYC Policy', ROUTES.KYC_POLICY], ['Disclaimer', ROUTES.DISCLAIMER], ['Terms and Conditions', ROUTES.TERMS_AND_CONDITIONS], ['Terms of Use', ROUTES.TERMS_OF_USE]]],
];

export default function Sitemap(){
 return <div className="public-info-page"><Header/><main>
  <section className="info-hero"><div className="info-hero-inner"><span className="info-eyebrow">Navigation</span><h1>Sitemap<em>.</em></h1><p className="info-accent">Every page, in one place.</p><p className="info-intro">Find your way around the Bhoomani Holdings website.</p><div className="info-hero-line"/></div></section>
  <section className="info-content">
   <div className="info-cards sitemap-cards">{groups.map(([title,links],i)=><article className="info-card" key={title}><span>0{i+1}</span><h3>{title}</h3><ul className="sitemap-links">{links.map(([label,to])=><li key={to}><Link to={to}>{label}</Link></li>)}</ul></article>)}</div>
  </section>
 </main><Footer/></div>
}
