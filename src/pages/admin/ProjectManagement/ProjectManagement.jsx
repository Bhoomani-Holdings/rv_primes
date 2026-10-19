import { useState } from "react";
import { updateProject } from "../../../services/dashboardService";
import "./projectManagement.css";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN", {
  maximumFractionDigits: 2
})}`;

function ProjectRow({ project, mode, onEdit }) {
  const openEditor = () => onEdit(project);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEditor();
    }
  };

  return (
    <tr
      className="project-management-row"
      tabIndex="0"
      aria-label={`Edit ${project.name}`}
      onDoubleClick={openEditor}
      onKeyDown={handleKeyDown}
    >
      <td>{project.name}</td>
      <td>{project.location || project.city || "-"}</td>
      {mode === "units" ? (
        <>
          <td>{project.totalUnits}</td>
          <td>{project.soldUnits}</td>
          <td>{project.availableUnits}</td>
        </>
      ) : (
        <>
          <td>{formatINR(project.initialValue)}</td>
          <td>{formatINR(project.currentValue)}</td>
          <td>{formatINR(project.pricePerUnit)}</td>
        </>
      )}
      <td>
        <span className={project.status === "Active" ? "status-active" : "status-inactive"}>
          {project.status || "Active"}
        </span>
      </td>
    </tr>
  );
}

function ProjectEditorModal({ project, mode, onClose, onProjectUpdated }) {
  const [draft, setDraft] = useState(mode === "units"
    ? {
      totalUnits: String(project.totalUnits),
      soldUnits: String(project.soldUnits)
    }
    : {
      initialValue: String(project.initialValue ?? ""),
      currentValue: String(project.currentValue ?? "")
    });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const save = async (event) => {
    event.preventDefault();
    const totalUnits = Number(draft.totalUnits);
    const soldUnits = Number(draft.soldUnits);
    const invalidUnits = mode === "units" && (
      !Number.isInteger(totalUnits) || totalUnits < 1 ||
      !Number.isInteger(soldUnits) || soldUnits < 0 || soldUnits > totalUnits
    );
    const invalidPrices = mode === "pricing" &&
      Object.values(draft).some((value) => value === "" || !Number.isFinite(Number(value)) || Number(value) < 0);
    if (invalidUnits || invalidPrices) {
      setError(mode === "units"
        ? "Enter whole-number unit counts. Sold Units cannot exceed Total Units."
        : "Enter valid non-negative prices for both fields.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updates = mode === "units"
        ? { totalUnits, soldUnits }
        : {
          initialValue: Number(draft.initialValue),
          currentValue: Number(draft.currentValue)
        };
      const result = await updateProject(project.id, updates);
      onProjectUpdated(result);
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to update project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="project-edit-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section
        className="project-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-edit-title"
      >
        <div className="project-edit-header">
          <h2 id="project-edit-title">Edit {mode === "units" ? "Units" : "Pricing"}</h2>
          <button type="button" aria-label="Close editor" disabled={saving} onClick={onClose}>×</button>
        </div>
        <p className="project-edit-name">{project.name}</p>
        <form onSubmit={save}>
          {mode === "units" ? (
            <>
              <label>
                Total Units
                <input
                  name="totalUnits"
                  type="number"
                  min="1"
                  step="1"
                  value={draft.totalUnits}
                  onChange={updateField}
                  required
                />
              </label>
              <label>
                Sold Units
                <input
                  name="soldUnits"
                  type="number"
                  min="0"
                  max={draft.totalUnits || undefined}
                  step="1"
                  value={draft.soldUnits}
                  onChange={updateField}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Initial Value
                <input
                  name="initialValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.initialValue}
                  onChange={updateField}
                  required
                />
              </label>
              <label>
                Current Value
                <input
                  name="currentValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.currentValue}
                  onChange={updateField}
                  required
                />
              </label>
            </>
          )}
          {error && <p className="management-row-error" role="alert">{error}</p>}
          <div className="project-edit-actions">
            <button type="button" className="project-edit-cancel" disabled={saving} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProjectManagementPage({ projects, mode, onProjectUpdated }) {
  const isUnits = mode === "units";
  const [editingProject, setEditingProject] = useState(null);

  return (
    <section className="projects-content project-management-content">
      <div className="dashboard-card project-card project-management-card">
        <div className="card-header">
          <h3>{isUnits ? "Units" : "Pricing Management"}</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Location</th>
                {isUnits ? (
                  <>
                    <th>Total Units</th>
                    <th>Sold Units</th>
                    <th>Available Units</th>
                  </>
                ) : (
                  <>
                    <th>Initial Estimated Price</th>
                    <th>Current Price</th>
                    <th>Price / Unit</th>
                  </>
                )}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  mode={mode}
                  onEdit={setEditingProject}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingProject && (
        <ProjectEditorModal
          project={editingProject}
          mode={mode}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={onProjectUpdated}
        />
      )}
    </section>
  );
}

export default ProjectManagementPage;