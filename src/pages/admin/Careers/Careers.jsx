import { useEffect, useState } from "react";
import { createCareerPost, getCareerPosts } from "../../../services/dashboardService";
import "./careers.css";

const emptyCareer = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  experience: "",
  salaryRange: "",
  description: "",
  requirements: ""
};

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState(emptyCareer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    getCareerPosts()
      .then((data) => {
        if (!cancelled) setCareers(data);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load career posts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const career = await createCareerPost(form);
      setCareers((current) => [career, ...current]);
      setForm(emptyCareer);
      setSuccess("Career opening added.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save career post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="careers-content">
      <div className="career-panel">
        <header className="career-heading">
          <h1>Careers</h1>
          <p>Add and manage job openings.</p>
        </header>

        <form className="career-form" onSubmit={handleSubmit}>
          <label>
            Job Title
            <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Investment Analyst" required />
          </label>
          <div className="career-form-row">
            <label>
              Department
              <input name="department" value={form.department} onChange={updateField} placeholder="e.g. Investments" required />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={updateField} placeholder="e.g. Hyderabad" required />
            </label>
          </div>
          <div className="career-form-row">
            <label>
              Employment Type
              <select name="employmentType" value={form.employmentType} onChange={updateField}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>
            <label>
              Experience (years)
              <input name="experience" type="number" min="0" step="0.5" value={form.experience} onChange={updateField} placeholder="Optional" />
            </label>
          </div>
          <label>
            Salary Range
            <input name="salaryRange" value={form.salaryRange} onChange={updateField} placeholder="e.g. ₹6–8 LPA (optional)" />
          </label>
          <label>
            Job Description
            <textarea name="description" rows="4" value={form.description} onChange={updateField} required />
          </label>
          <label>
            Requirements
            <textarea name="requirements" rows="4" value={form.requirements} onChange={updateField} placeholder="Skills, qualifications, or experience" />
          </label>
          {error && <p className="career-message career-error" role="alert">{error}</p>}
          {success && <p className="career-message career-success" role="status">{success}</p>}
          <button className="career-submit" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Career"}
          </button>
        </form>
      </div>

      <div className="career-panel career-list-panel">
        <div className="career-list-heading">
          <h2>Career Openings</h2>
          <span>{careers.length}</span>
        </div>
        {loading ? (
          <p role="status">Loading career openings...</p>
        ) : careers.length === 0 ? (
          <p className="career-empty">No career openings added yet.</p>
        ) : (
          <div className="career-list">
            {careers.map((career) => (
              <article className="career-item" key={career.id}>
                <div className="career-item-heading">
                  <div>
                    <h3>{career.title}</h3>
                    <p>{career.department} · {career.location}</p>
                  </div>
                  <span className="career-status">{career.status || "Open"}</span>
                </div>
                <div className="career-meta">
                  <span>{career.employmentType}</span>
                  {career.experience != null && <span>{career.experience}+ years experience</span>}
                  {career.salaryRange && <span>{career.salaryRange}</span>}
                </div>
                <p className="career-description">{career.description}</p>
                {career.requirements && <p className="career-requirements"><strong>Requirements:</strong> {career.requirements}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
