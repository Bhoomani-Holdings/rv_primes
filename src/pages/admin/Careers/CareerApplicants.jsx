import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCareerApplications, getCareerPosts } from "../../../services/dashboardService";
import { ROUTES } from "../../../routes/routesPath";
import "./careers.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

export default function CareerApplicants() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCareerPosts(), getCareerApplications(careerId)])
      .then(([careers, applications]) => {
        if (cancelled) return;
        setCareer(careers.find((item) => String(item.id) === String(careerId)) || null);
        setApplicants(applications);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load applicants");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [careerId]);

  return (
    <section className="careers-content">
      <div className="career-panel career-list-panel">
        <header className="career-list-heading applicants-heading">
          <div>
            <button className="career-back-button" type="button" onClick={() => navigate(ROUTES.ADMIN_CAREERS)}>
              Back to Openings
            </button>
            <h2>{career ? `${career.title} Applicants` : "Career Applicants"}</h2>
          </div>
          <span>{applicants.length}</span>
        </header>
        {error && <p className="career-message career-error" role="alert">{error}</p>}
        {loading && <p role="status">Loading applicants...</p>}
        {!loading && !error && (
          <div className="applicants-table-wrap">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Full Name</th><th>Email</th><th>Phone</th><th>Experience (years)</th><th>Current CTC</th><th>LinkedIn Profile</th><th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length === 0 ? (
                  <tr><td className="career-empty applicants-empty" colSpan="7">No applicants have applied for this opening yet.</td></tr>
                ) : applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td><strong>{applicant.fullName}</strong></td>
                    <td><a href={`mailto:${applicant.email}`}>{applicant.email}</a></td>
                    <td>{applicant.phone || "—"}</td>
                    <td>{applicant.experience}</td>
                    <td>{applicant.currentCTC}</td>
                    <td>{applicant.linkedin ? <a href={applicant.linkedin} target="_blank" rel="noreferrer">View profile</a> : "—"}</td>
                    <td>
                      {applicant.resume?.originalName ? (
                        <a
                          href={`http://localhost:5000/api/careers/${careerId}/applications/${applicant.id}/resume`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {applicant.resume.originalName}
                        </a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
