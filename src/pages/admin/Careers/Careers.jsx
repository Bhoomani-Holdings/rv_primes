import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { closeCareerPost, createCareerPost, getCareerPosts, updateCareerPost } from "../../../services/dashboardService";
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
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState(emptyCareer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [closingCareerId, setClosingCareerId] = useState(null);
  const [careerToClose, setCareerToClose] = useState(null);
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

  const openForm = () => {
    setError("");
    setSuccess("");
    setEditingCareer(null);
    setForm(emptyCareer);
    setShowForm(true);
  };

  const openEditForm = (career) => {
    setError("");
    setSuccess("");
    setEditingCareer(career);
    setForm({
      title: career.title || "",
      department: career.department || "",
      location: career.location || "",
      employmentType: career.employmentType || "Full-time",
      experience: career.experience ?? "",
      salaryRange: career.salaryRange || "",
      description: career.description || "",
      requirements: career.requirements || ""
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setError("");
    setEditingCareer(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const career = editingCareer
        ? await updateCareerPost(editingCareer.id, form)
        : await createCareerPost(form);
      setCareers((current) => editingCareer
        ? current.map((item) => String(item.id) === String(career.id) ? career : item)
        : [career, ...current]);
      setForm(emptyCareer);
      setSuccess(editingCareer ? "Career opening updated." : "Career opening added.");
      setEditingCareer(null);
      setShowForm(false);
    } catch (saveError) {
      setError(saveError.message || "Unable to save career post");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseCareer = async (career) => {
    setClosingCareerId(career.id);
    setError("");
    setSuccess("");
    try {
      const updatedCareer = await closeCareerPost(career.id);
      setCareers((current) => current.map((item) =>
        String(item.id) === String(updatedCareer.id) ? updatedCareer : item
      ));
      setSuccess(`${career.title} is now closed and hidden from the public Careers page.`);
      setCareerToClose(null);
    } catch (closeError) {
      setError(closeError.message || "Unable to close career position");
      setCareerToClose(null);
    } finally {
      setClosingCareerId(null);
    }
  };

  const confirmCloseCareer = () => {
    if (!careerToClose) return;
    handleCloseCareer(careerToClose);
  };

  return (
    <section className="careers-content">
      {showForm ? (
        <div className="career-panel">
          <header className="career-heading career-heading-centered">
            <button className="career-back-button" type="button" onClick={closeForm}>
              Back to Openings
            </button>
            <div className="career-form-title">
              <h1>{editingCareer ? "Edit Career" : "Careers"}</h1>
              <p>{editingCareer ? "Update the job opening details." : "Add and manage job openings."}</p>
            </div>
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
            <div className="career-form-actions">
              <button className="career-submit" type="submit" disabled={saving}>
                {saving ? (editingCareer ? "Updating..." : "Adding...") : (editingCareer ? "Update Career" : "Add Career")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="career-panel career-list-panel">
          <div className="career-list-heading">
            <h2>Career Openings</h2>
            <div className="career-list-actions">
              <span>{careers.length}</span>
              <button className="career-add-button" type="button" onClick={openForm}>
                + Add Career
              </button>
            </div>
          </div>
          {success && <p className="career-message career-success" role="status">{success}</p>}
          {error && <p className="career-message career-error" role="alert">{error}</p>}
          {loading ? (
            <p role="status">Loading career openings...</p>
          ) : careers.length === 0 ? (
            <p className="career-empty">No career openings added yet.</p>
          ) : (
            <div className="career-list">
              {careers.map((career) => (
                <article
                  className="career-item career-item-editable"
                  key={career.id}
                  tabIndex={0}
                  aria-label={`Edit ${career.title}; double-click or press Enter`}
                  onDoubleClick={(event) => {
                    if (!event.target.closest("button")) openEditForm(career);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.target.closest("button")) openEditForm(career);
                  }}
                >
                  <div className="career-item-heading">
                    <div>
                      <h3>{career.title}</h3>
                      <p>{career.department} · {career.location}</p>
                    </div>
                    <span className={`career-status ${career.status === "Closed" ? "is-closed" : ""}`}>
                      {career.status || "Open"}
                    </span>
                  </div>
                  <div className="career-meta">
                    <span>{career.employmentType}</span>
                    {career.experience != null && <span>{career.experience}+ years experience</span>}
                    {career.salaryRange && <span>{career.salaryRange}</span>}
                  </div>
                  <p className="career-description">{career.description}</p>
                  {career.requirements && <p className="career-requirements"><strong>Requirements:</strong> {career.requirements}</p>}
                  <div className="career-item-actions">
                    <button
                      className="career-applicants-button"
                      type="button"
                      onClick={() => navigate(`${ROUTES.ADMIN_CAREERS}/${career.id}/applicants`)}
                      onDoubleClick={(event) => event.stopPropagation()}
                    >
                      Show Applicants
                    </button>
                  {career.status !== "Closed" && (
                      <button
                        className="career-close-button"
                        type="button"
                        onClick={() => setCareerToClose(career)}
                        onDoubleClick={(event) => event.stopPropagation()}
                      >
                        Close Position
                      </button>
                  )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      {careerToClose && (
        <div
          className="career-confirm-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !closingCareerId) setCareerToClose(null);
          }}
        >
          <section
            className="career-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="career-close-confirm-title"
            aria-describedby="career-close-confirm-message"
          >
            <h2 id="career-close-confirm-title">Close Position</h2>
            <p id="career-close-confirm-message">Are you sure you want to close the position?</p>
            <div className="career-confirm-actions">
              <button
                type="button"
                className="career-confirm-no"
                disabled={Boolean(closingCareerId)}
                onClick={() => setCareerToClose(null)}
              >
                No
              </button>
              <button
                type="button"
                className="career-confirm-yes"
                disabled={closingCareerId === careerToClose.id}
                onClick={confirmCloseCareer}
              >
                {closingCareerId === careerToClose.id ? "Closing..." : "Yes"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
