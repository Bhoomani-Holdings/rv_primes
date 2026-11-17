import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowDownCircle,
  FiArrowUpRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiPieChart,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';
import { getProjects } from '../../../services/dashboardService';
import { ROUTES } from '../../../routes/routesPath';
import './investordashboard.css';

const getProjectLocation = (project) => {
  const city = typeof project.city === 'string' ? project.city.trim() : '';
  const location = typeof project.location === 'string' ? project.location.trim() : '';
  const address = typeof project.address === 'string' ? project.address.trim() : '';
  return city || location || address;
};

const getProjectImage = (project) => {
  if (!Array.isArray(project.photos)) return '';
  return project.photos.find((photo) => typeof photo === 'string' && photo.trim()) || '';
};

function MetricCard({ label, value, note, icon: Icon, tone }) {
  return (
    <article className={`investor-dashboard__metric investor-dashboard__tone-${tone}`}>
      <div className="investor-dashboard__metric-heading">
        <span>{label}</span>
        <Icon aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function QuickAction({ to, title, description, icon: Icon, tone }) {
  return (
    <Link className={`investor-dashboard__action investor-dashboard__tone-${tone}`} to={to}>
      <span className="investor-dashboard__action-icon"><Icon aria-hidden="true" /></span>
      <span className="investor-dashboard__action-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <FiArrowUpRight className="investor-dashboard__action-arrow" aria-hidden="true" />
    </Link>
  );
}

function EmptyPanel({ icon: Icon, children }) {
  return (
    <div className="investor-dashboard__empty-panel">
      <span><Icon aria-hidden="true" /></span>
      <p>{children}</p>
    </div>
  );
}

function ProjectCard({ project }) {
  const location = getProjectLocation(project);
  const image = getProjectImage(project);
  const details = [
    project.projectType && { label: 'Project type', value: project.projectType },
    project.expectedROI !== undefined && project.expectedROI !== null && {
      label: 'Expected ROI',
      value: `${project.expectedROI}%`,
    },
    project.tenure !== undefined && project.tenure !== null && project.tenure !== '' && {
      label: 'Tenure',
      value: `${project.tenure} ${Number(project.tenure) === 1 ? 'Year' : 'Yrs'}`,
    },
  ].filter(Boolean);

  return (
    <article className="investor-dashboard__project-card">
      <div className="investor-dashboard__project-image">
        {image ? (
          <img src={image} alt={project.name ? `${project.name} project` : 'Project'} loading="lazy" />
        ) : (
          <div className="investor-dashboard__project-art" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
        {project.category && <span className="investor-dashboard__project-brand">{project.category}</span>}
      </div>
      <div className="investor-dashboard__project-body">
        <div className="investor-dashboard__project-meta">
          {project.status && <span className="investor-dashboard__project-status">{project.status}</span>}
          {(project.id || project._id) && (
            <span className="investor-dashboard__project-id">ID: {project.id || project._id}</span>
          )}
        </div>
        <h3>{project.name || 'Untitled project'}</h3>
        {location && (
          <p className="investor-dashboard__project-location">
            <FiMapPin aria-hidden="true" />
            {location}
          </p>
        )}
        {project.description && (
          <p className="investor-dashboard__project-description">{project.description}</p>
        )}
        {details.length > 0 && (
          <dl className="investor-dashboard__project-details">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

export default function InvestorDashboard({ projectOnly = false }) {
  const [investor, setInvestor] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    try {
      setInvestor(JSON.parse(sessionStorage.getItem('investorSession') || 'null'));
    } catch (error) {
      console.error('Unable to read investor session:', error);
      setInvestor(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingProjects(true);
    setProjectsError('');

    getProjects()
      .then((response) => {
        if (!Array.isArray(response)) {
          throw new Error('The server returned an invalid projects response.');
        }
        if (!cancelled) setProjects(response);
      })
      .catch((error) => {
        if (!cancelled) setProjectsError(error.message || 'Unable to load projects.');
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const fullName = typeof investor?.fullName === 'string' ? investor.fullName.trim() : '';
  const firstName = fullName ? fullName.split(/\s+/)[0] : '';
  const investorId = investor?.investorId || investor?.id;
  const kycStatus = typeof investor?.kycStatus === 'string' ? investor.kycStatus.trim() : '';
  const metrics = [
    { label: 'Total Investment', note: 'Investor data unavailable', icon: FiDollarSign, tone: 'blue' },
    { label: 'Portfolio Value', note: 'Investor data unavailable', icon: FiBriefcase, tone: 'purple' },
    { label: 'Appreciation', note: 'Investor data unavailable', icon: FiTrendingUp, tone: 'green' },
    { label: 'Earnings Received', note: 'Investor data unavailable', icon: FiActivity, tone: 'green' },
    { label: 'Pending Earnings', note: 'Investor data unavailable', icon: FiCalendar, tone: 'orange' },
    { label: 'Wallet Balance', note: 'Investor data unavailable', icon: FiCreditCard, tone: 'blue' },
    { label: 'Total Withdrawn', note: 'Investor data unavailable', icon: FiArrowDownCircle, tone: 'purple' },
    {
      label: 'Projects Listed',
      value: loadingProjects ? '…' : projects.length,
      note: 'All platform projects',
      icon: FiPieChart,
      tone: 'orange',
    },
  ];
  const sortedProjects = [...projects].sort((first, second) => Number(second.id) - Number(first.id));
  const displayedProjects = projectOnly ? sortedProjects : sortedProjects.slice(0, 3);

  const projectSection = (
    <>
      <div className="investor-dashboard__section-heading">
        <div>
          <p className="investor-dashboard__eyebrow">Explore opportunities</p>
          <h2>Project updates</h2>
          <p>Browse featured projects currently listed on the platform.</p>
        </div>
        {!projectOnly && (
          <Link className="investor-dashboard__text-action" to={ROUTES.INVESTOR_PROJECTS}>
            View all projects
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>

      {loadingProjects ? (
        <div className="investor-dashboard__message" role="status">Loading projects…</div>
      ) : projectsError ? (
        <div className="investor-dashboard__message investor-dashboard__message--error" role="alert">
          <p>{projectsError}</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            <FiRefreshCw aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="investor-dashboard__message">There are no projects to display.</div>
      ) : (
        <div className="investor-dashboard__project-grid">
          {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id || project._id || `${project.name}-${index}`} project={project} />
          ))}
        </div>
      )}
    </>
  );

  if (projectOnly) {
    return (
      <main className="investor-dashboard investor-dashboard--projects-only">
        <div className="investor-dashboard__page-stack">
          <section className="investor-dashboard__project-section" id="project-investments">
            {projectSection}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="investor-dashboard">
      <div className="investor-dashboard__page-stack">
        <section className="investor-dashboard__hero">
          <div className="investor-dashboard__hero-copy">
            <p className="investor-dashboard__eyebrow">Investor portal</p>
            <h1>{firstName ? `Welcome back, ${firstName}` : 'Investor dashboard'}</h1>
            <p>
              Your investor overview and the projects currently listed on the platform.
            </p>
            <div className="investor-dashboard__hero-meta">
              {kycStatus && (
                <span>
                  <FiCheckCircle aria-hidden="true" />
                  KYC status: {kycStatus}
                </span>
              )}
              {investorId !== undefined && investorId !== null && investorId !== '' && (
                <span>Investor ID: {investorId}</span>
              )}
            </div>
          </div>
          <div className="investor-dashboard__hero-art" aria-hidden="true">
            <span className="investor-dashboard__hero-sun" />
            <span className="investor-dashboard__hero-building investor-dashboard__hero-building--back" />
            <span className="investor-dashboard__hero-building investor-dashboard__hero-building--front" />
            <span className="investor-dashboard__hero-ground" />
          </div>
        </section>

        <section className="investor-dashboard__stats" aria-label="Investor summary">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              {...metric}
              value={metric.value ?? '—'}
            />
          ))}
        </section>

        <section className="investor-dashboard__quick-actions" aria-label="Quick links">
          <QuickAction
            to={ROUTES.WALLET}
            title="Wallet"
            description="Review your wallet page"
            icon={FiCreditCard}
            tone="blue"
          />
          <QuickAction
            to={ROUTES.EARNINGS}
            title="Earnings"
            description="Open earnings"
            icon={FiDollarSign}
            tone="purple"
          />
          <QuickAction
            to={ROUTES.INVESTOR_PROJECTS}
            title="Projects"
            description="Explore listed projects"
            icon={FiBriefcase}
            tone="green"
          />
          <QuickAction
            to={ROUTES.INVESTOR_PROFILE}
            title="Profile"
            description="Review profile information"
            icon={FiFileText}
            tone="orange"
          />
        </section>

        <div className="investor-dashboard__chart-row">
          <section className="investor-dashboard__panel">
            <div className="investor-dashboard__panel-heading">
              <h2>Investment Overview</h2>
            </div>
            <EmptyPanel icon={FiTrendingUp}>
              Investment history is not available.
            </EmptyPanel>
          </section>
          <section className="investor-dashboard__panel">
            <div className="investor-dashboard__panel-heading">
              <h2>Portfolio Distribution</h2>
            </div>
            <EmptyPanel icon={FiPieChart}>
              Personal holdings data is not available.
            </EmptyPanel>
          </section>
        </div>

        <div className="investor-dashboard__activity-row">
          <section className="investor-dashboard__panel">
            <div className="investor-dashboard__panel-heading">
              <h2>Earnings Trend</h2>
            </div>
            <EmptyPanel icon={FiActivity}>
              Earnings history is not available.
            </EmptyPanel>
          </section>
          <section className="investor-dashboard__panel">
            <div className="investor-dashboard__panel-heading">
              <h2>Latest Earnings</h2>
              <Link to={ROUTES.EARNINGS}>View all</Link>
            </div>
            <EmptyPanel icon={FiDollarSign}>
              Investor earnings records are not available.
            </EmptyPanel>
          </section>
          <section className="investor-dashboard__panel">
            <div className="investor-dashboard__panel-heading">
              <h2>Recent Transactions</h2>
              <Link to={ROUTES.WALLET}>View all</Link>
            </div>
            <EmptyPanel icon={FiRefreshCw}>
              Investor transaction records are not available.
            </EmptyPanel>
          </section>
        </div>

        <section className="investor-dashboard__panel investor-dashboard__investments">
          <div className="investor-dashboard__panel-heading">
            <h2>Recent Investments</h2>
            <Link to={ROUTES.INVESTOR_INVESTMENTS}>View all</Link>
          </div>
          <div className="investor-dashboard__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Unit</th>
                  <th>Type</th>
                  <th>Purchase date</th>
                  <th>Units</th>
                  <th>Invested</th>
                  <th>Current value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8">Investor-specific investment records are not available.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="investor-dashboard__project-section" id="project-investments">
          {projectSection}
        </section>
      </div>
    </main>
  );
}
