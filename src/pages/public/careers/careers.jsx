import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { createCareerApplication, getCareerPosts } from "../../../services/dashboardService";
import "./careers.css";

const emptyApplication = {
  fullName: "",
  email: "",
  phone: "",
  experience: "",
  currentCTC: "",
  linkedin: "",
  coverLetter: "",
  resume: null
};

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [application, setApplication] = useState(emptyApplication);
  const [applicationError, setApplicationError] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCareerPosts()
      .then((data) => {
        if (!cancelled) setCareers(data.filter((career) => career.status !== "Closed"));
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load career openings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openApplication = (career) => {
    setSelectedCareer(career);
    setApplication(emptyApplication);
    setApplicationError("");
    setApplicationSuccess("");
  };

  const closeApplication = () => {
    if (submitting) return;
    setSelectedCareer(null);
    setApplication(emptyApplication);
    setApplicationError("");
    setApplicationSuccess("");
  };

  const updateApplication = (event) => {
    const { name, value, files } = event.target;
    setApplication((current) => ({
      ...current,
      [name]: name === "resume" ? files?.[0] || null : value
    }));
    setApplicationError("");
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!application.resume) {
      setApplicationError("Please attach your resume.");
      return;
    }
    if (application.resume.size > 5 * 1024 * 1024) {
      setApplicationError("Resume file must be 5 MB or smaller.");
      return;
    }

    setSubmitting(true);
    setApplicationError("");
    try {
      const result = await createCareerApplication(selectedCareer.id, application);
      setApplicationSuccess(result.message || "Your application was submitted successfully.");
    } catch (submitError) {
      setApplicationError(submitError.message || "Unable to submit your application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-careers-page">
      <Header />
      <main className="public-careers-main">
        <section className="public-careers-intro">
          <p className="public-careers-eyebrow">CAREERS AT BHOOMANI HOLDINGS</p>
          <h1>Build what comes next.</h1>
          <p>Join our team and help create lasting value through thoughtful investments and business practices.</p>
        </section>

        <section className="public-careers-list" aria-labelledby="openings-title">
          <div className="public-careers-list-heading">
            <div>
              <p className="public-careers-eyebrow">OPPORTUNITIES</p>
              <h2 id="openings-title">Current Openings</h2>
            </div>
            {!loading && !error && <span>{careers.length} {careers.length === 1 ? "position" : "positions"}</span>}
          </div>

          {loading ? (
            <p className="public-careers-state" role="status">Loading career openings...</p>
          ) : error ? (
            <p className="public-careers-state public-careers-error" role="alert">{error}</p>
          ) : careers.length === 0 ? (
            <p className="public-careers-state">There are no open positions at the moment. Please check again soon.</p>
          ) : (
            <div className="public-career-cards">
              {careers.map((career) => (
                <article className="public-career-card" key={career.id}>
                  <div className="public-career-card-heading">
                    <div>
                      <h3>{career.title}</h3>
                      <p>{career.department}</p>
                    </div>
                    <div className="public-career-actions">
                      <span className="public-career-type">{career.employmentType}</span>
                      <button className="public-career-apply" type="button" onClick={() => openApplication(career)}>
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="public-career-meta">
                    <span>{career.location}</span>
                    {career.experience != null && <span>{career.experience}+ years experience</span>}
                    {career.salaryRange && <span>{career.salaryRange}</span>}
                  </div>

                  <p className="public-career-description">{career.description}</p>
                  {career.requirements && (
                    <div className="public-career-requirements">
                      <h4>Requirements</h4>
                      <p>{career.requirements}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      {selectedCareer && (
        <div
          className="career-application-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeApplication();
          }}
        >
          <section className="career-application-dialog" role="dialog" aria-modal="true" aria-labelledby="career-application-title">
            <div className="career-application-heading">
              <div>
                <p className="public-careers-eyebrow">APPLICATION</p>
                <h2 id="career-application-title">Apply for {selectedCareer.title}</h2>
              </div>
              <button className="career-application-close" type="button" onClick={closeApplication} aria-label="Close application form">×</button>
            </div>

            {applicationSuccess ? (
              <div className="career-application-success" role="status">
                <p>{applicationSuccess}</p>
                <button className="public-career-apply" type="button" onClick={closeApplication}>Close</button>
              </div>
            ) : (
              <form className="career-application-form" onSubmit={submitApplication}>
                <label>
                  Full Name
                  <input name="fullName" autoComplete="name" value={application.fullName} onChange={updateApplication} required />
                </label>
                <div className="career-application-row">
                  <label>
                    Email
                    <input name="email" type="email" autoComplete="email" value={application.email} onChange={updateApplication} required />
                  </label>
                  <label>
                    Phone
                    <input name="phone" type="tel" autoComplete="tel" value={application.phone} onChange={updateApplication} required />
                  </label>
                </div>
                <div className="career-application-row">
                  <label>
                    Experience (years)
                    <input name="experience" type="number" min="0" step="0.5" value={application.experience} onChange={updateApplication} required />
                  </label>
                  <label>
                    Current CTC
                    <input name="currentCTC" value={application.currentCTC} onChange={updateApplication} placeholder="e.g. 8 LPA or Fresher" required />
                  </label>
                </div>
                <label>
                  LinkedIn Profile <span className="career-application-optional">(optional)</span>
                  <input name="linkedin" type="url" placeholder="https://linkedin.com/in/your-profile" value={application.linkedin} onChange={updateApplication} />
                </label>
                <label>
                  Resume <span className="career-application-optional">(PDF, DOC, or DOCX; up to 5 MB)</span>
                  <input name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={updateApplication} required />
                </label>
                <label>
                  Cover Letter <span className="career-application-optional">(optional)</span>
                  <textarea name="coverLetter" rows="4" value={application.coverLetter} onChange={updateApplication} />
                </label>
                {applicationError && <p className="career-application-error" role="alert">{applicationError}</p>}
                <div className="career-application-actions">
                  <button className="career-application-cancel" type="button" onClick={closeApplication} disabled={submitting}>Cancel</button>
                  <button className="public-career-apply" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
      <Footer />
    </div>
  );
}
