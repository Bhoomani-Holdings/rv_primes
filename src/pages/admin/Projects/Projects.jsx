import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectOverview from "../../../components/ProjectOverview/ProjectOverview";
import { createProject, getProjects, updateProject } from "../../../services/dashboardService";
import { ROUTES } from "../../../routes/routesPath";
import "./projects.css";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  projectType: "",
  totalUnits: "",
  soldUnits: "0",
  initialValue: "",
  currentValue: "",
  expectedROI: "",
  tenure: "",
  totalLandArea: "",
  landAreaUnit: "Sq. Ft.",
  status: "Active",
  latitude: "",
  longitude: "",
  address: "",
  street: "",
  city: "",
  pincode: ""
};

const formatINR = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
}).format(value);

const getMediaKey = (file) => `${file.name}:${file.size}:${file.lastModified}`;

function ProjectsPage({ mode = "list", onProjectCreated, onProjectUpdated }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEditor = mode !== "list";
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(mode !== "create");
  const [projectsError, setProjectsError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mediaError, setMediaError] = useState("");
  const previewUrls = useRef(new Set());

  useEffect(() => {
    if (mode === "create") {
      setProjectsLoading(false);
      return undefined;
    }

    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setProjectsError("Unable to load projects");
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "create") {
      setForm(emptyForm);
      setError("");
      return;
    }
    if (mode !== "edit" || projectsLoading) return;
    const project = projects.find((item) => String(item.id) === String(projectId));
    if (!project) {
      setProjectsError("Project not found");
      return;
    }

    setForm({
      ...emptyForm,
      ...project,
      totalUnits: String(project.totalUnits ?? ""),
      soldUnits: String(project.soldUnits ?? "0"),
      initialValue: String(project.initialValue ?? ""),
      currentValue: String(project.currentValue ?? ""),
      expectedROI: project.expectedROI == null ? "" : String(project.expectedROI),
      tenure: project.tenure == null ? "" : String(project.tenure),
      totalLandArea: String(project.totalLandArea ?? ""),
      latitude: project.latitude == null ? "" : String(project.latitude),
      longitude: project.longitude == null ? "" : String(project.longitude),
      city: project.city || project.location || ""
    });
  }, [mode, projectId, projects, projectsLoading]);

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const totalUnits = Number(form.totalUnits);
  const soldUnits = Number(form.soldUnits);
  const initialValue = Number(form.initialValue);
  const currentValue = Number(form.currentValue);
  const expectedROI = form.expectedROI === "" ? null : Number(form.expectedROI);
  const tenure = form.tenure === "" ? null : Number(form.tenure);
  const totalLandArea = Number(form.totalLandArea);
  const pricePerUnit = totalUnits > 0 && currentValue >= 0 ? currentValue / totalUnits : null;
  const unitsPerArea = totalLandArea > 0 && totalUnits > 0 ? totalUnits / totalLandArea : null;

  const addMedia = (event, mediaType) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    const isPhoto = mediaType === "photo";
    const acceptedExtensions = isPhoto ? ["jpg", "jpeg", "png", "webp"] : ["mp4", "webm", "mov"];
    const maxSize = isPhoto ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    const maxSizeMessage = isPhoto ? "Image size must be less than 5 MB." : "Video size must be less than 50 MB.";
    const currentMedia = isPhoto ? photos : videos;
    const selectedKeys = new Set(currentMedia.map(({ file }) => getMediaKey(file)));
    const nextMedia = [];
    let nextError = "";

    selectedFiles.forEach((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptedExtensions.includes(extension)) {
        nextError = isPhoto
          ? "Unsupported image format. Use JPG, JPEG, PNG, or WEBP."
          : "Unsupported video format. Use MP4, WEBM, or MOV.";
        return;
      }
      if (file.size > maxSize) {
        nextError = maxSizeMessage;
        return;
      }

      const key = getMediaKey(file);
      if (selectedKeys.has(key)) return;

      selectedKeys.add(key);
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      nextMedia.push({ file, key, previewUrl });
    });

    if (isPhoto) setPhotos((current) => [...current, ...nextMedia]);
    else setVideos((current) => [...current, ...nextMedia]);
    setMediaError(nextError);
  };

  const removeMedia = (mediaType, key) => {
    const updateMedia = mediaType === "photo" ? setPhotos : setVideos;
    updateMedia((current) => {
      const removed = current.find((item) => item.key === key);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrls.current.delete(removed.previewUrl);
      }
      return current.filter((item) => item.key !== key);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const project = {
        ...form,
        totalUnits,
        soldUnits,
        availableUnits: totalUnits - soldUnits,
        initialValue,
        currentValue,
        expectedROI,
        tenure,
        pricePerUnit,
        totalLandArea,
        unitsPerArea,
        latitude: form.latitude === "" ? null : Number(form.latitude),
        longitude: form.longitude === "" ? null : Number(form.longitude)
      };
      if (mode === "edit") {
        const result = await updateProject(projectId, project);
        onProjectUpdated(result);
      } else {
        const result = await createProject({
          project,
          photos: photos.map(({ file }) => file),
          videos: videos.map(({ file }) => file)
        });
        onProjectCreated(result);
        setProjects((current) => [...current, result.project]);
      }
      setForm(emptyForm);
      [...photos, ...videos].forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
        previewUrls.current.delete(previewUrl);
      });
      setPhotos([]);
      setVideos([]);
      setMediaError("");
      navigate(ROUTES.ADMIN_PROJECTS);
    } catch (submitError) {
      setError(submitError.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="projects-content">
      {!isEditor && (projectsLoading ? (
        <p role="status">Loading projects...</p>
      ) : projectsError ? (
        <p className="project-form-error" role="alert">{projectsError}</p>
      ) : (
        <ProjectOverview
          projects={projects}
          title="Projects"
          onProjectOpen={(project) => navigate(`${ROUTES.ADMIN_PROJECTS}/${project.id}`)}
          headerAction={(
            <button className="add-project-button" onClick={() => navigate(`${ROUTES.ADMIN_PROJECTS}/new`)}>
              <span aria-hidden="true">+</span> Add Project
            </button>
          )}
        />
      ))}

      {isEditor && (projectsLoading ? (
        <p role="status">Loading project...</p>
      ) : projectsError ? (
        <p className="project-form-error" role="alert">{projectsError}</p>
      ) : (
        <section className="project-editor-page">
            <header className="project-editor-header">
              <div>
                <button className="project-back-button" type="button" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}>
                  Back to Projects
                </button>
                <h2>{mode === "edit" ? "Edit Project" : "Add Project"}</h2>
              </div>
              <button
                className="project-cancel-button"
                type="button"
                disabled={saving}
                onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}
              >
                Cancel
              </button>
            </header>
            <form className="project-editor-form" onSubmit={handleSubmit}>
              {mode === "create" && <fieldset className="project-media-section">
                <legend>Project Photos &amp; Videos</legend>
                <label>
                  Photos
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    onChange={(event) => addMedia(event, "photo")}
                  />
                </label>
                {photos.length > 0 && (
                  <div className="project-media-grid">
                    {photos.map(({ file, key, previewUrl }) => (
                      <figure className="project-media-item" key={key}>
                        <img src={previewUrl} alt={`Preview of ${file.name}`} />
                        <figcaption>{file.name}</figcaption>
                        <button
                          type="button"
                          className="project-media-remove"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeMedia("photo", key)}
                        >
                          Remove
                        </button>
                      </figure>
                    ))}
                  </div>
                )}
                <label>
                  Videos
                  <input
                    type="file"
                    accept=".mp4,.webm,.mov"
                    multiple
                    onChange={(event) => addMedia(event, "video")}
                  />
                </label>
                {videos.length > 0 && (
                  <div className="project-media-grid project-video-grid">
                    {videos.map(({ file, key, previewUrl }) => (
                      <figure className="project-media-item" key={key}>
                        <video src={previewUrl} controls aria-label={`Preview of ${file.name}`} />
                        <figcaption>{file.name}</figcaption>
                        <button
                          type="button"
                          className="project-media-remove"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeMedia("video", key)}
                        >
                          Remove
                        </button>
                      </figure>
                    ))}
                  </div>
                )}
                {mediaError && <p className="project-form-error" role="alert">{mediaError}</p>}
              </fieldset>}
              {mode === "edit" && (form.photos?.length > 0 || form.videos?.length > 0) && (
                <div className="project-existing-media">
                  <strong>Current media</strong>
                  {[...(form.photos || []), ...(form.videos || [])].map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">{url.split("/").pop()}</a>
                  ))}
                  <span>Media files are unchanged when editing project details.</span>
                </div>
              )}
              <div className="project-form-row">
                <label>
                  Project Name
                  <input name="name" value={form.name} onChange={updateField} required />
                </label>
                <label>
                  Category
                  <select name="category" value={form.category} onChange={updateField} required>
                    <option value="" disabled>Select category</option>
                    <option>Real Estate</option>
                    <option>Energy</option>
                    <option>Farmland</option>
                    <option>Commercial</option>
                  </select>
                </label>
              </div>
              <div className="project-form-row">
                <label>
                  Project Type
                  <select name="projectType" value={form.projectType} onChange={updateField} required>
                    <option value="" disabled>Select project type</option>
                    <option>Leasing</option>
                    <option>Ownership</option>
                  </select>
                </label>
              </div>
              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows="3"
                />
              </label>
              <label>
                Total Units
                <input
                  name="totalUnits"
                  type="number"
                  min="1"
                  step="1"
                  value={form.totalUnits}
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
                  max={totalUnits || undefined}
                  step="1"
                  value={form.soldUnits}
                  onChange={updateField}
                  required
                />
              </label>
              <div className="project-form-row">
                <label>
                  Initial Value
                  <div className="project-currency-input">
                    <span aria-hidden="true">₹</span>
                    <input
                      name="initialValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.initialValue}
                      onChange={updateField}
                      required
                    />
                  </div>
                </label>
                <label>
                  Current Value
                  <div className="project-currency-input">
                    <span aria-hidden="true">₹</span>
                    <input
                      name="currentValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.currentValue}
                      onChange={updateField}
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="project-form-row">
                <label>
                  Expected ROI (%)
                  <input
                    name="expectedROI"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.expectedROI}
                    onChange={updateField}
                  />
                </label>
                <label>
                  Tenure (Years)
                  <input
                    name="tenure"
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.tenure}
                    onChange={updateField}
                  />
                </label>
              </div>
              <label>
                Price / Unit
                <input value={pricePerUnit === null ? "" : formatINR(pricePerUnit)} readOnly />
              </label>
              <div className="project-form-row">
                <label>
                  Total Land Area
                  <div className="project-input-with-unit">
                    <input
                      name="totalLandArea"
                      type="number"
                      min="0.01"
                      step="any"
                      value={form.totalLandArea}
                      onChange={updateField}
                      required
                    />
                    <select
                      name="landAreaUnit"
                      value={form.landAreaUnit}
                      onChange={updateField}
                      aria-label="Land area unit"
                    >
                      <option>Sq. Ft.</option>
                      <option>Sq. Yards</option>
                      <option>Acres</option>
                      <option>Sq. Meters</option>
                    </select>
                  </div>
                </label>
                <label>
                  Units / Area
                  <input
                    value={unitsPerArea === null ? "" : `${Number(unitsPerArea.toFixed(6))} units/${form.landAreaUnit}`}
                    readOnly
                  />
                </label>
              </div>
              <label>
                Status
                <select name="status" value={form.status} onChange={updateField}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <div className="project-form-row">
                <label>
                  Latitude
                  <input
                    name="latitude"
                    type="number"
                    min="-90"
                    max="90"
                    step="any"
                    value={form.latitude}
                    onChange={updateField}
                  />
                </label>
                <label>
                  Longitude
                  <input
                    name="longitude"
                    type="number"
                    min="-180"
                    max="180"
                    step="any"
                    value={form.longitude}
                    onChange={updateField}
                  />
                </label>
              </div>
              <label>
                Address
                <textarea name="address" value={form.address} onChange={updateField} rows="3" />
              </label>
              <label>
                Street
                <input name="street" value={form.street} onChange={updateField} />
              </label>
              <div className="project-form-row">
                <label>
                  City
                  <input name="city" value={form.city} onChange={updateField} />
                </label>
                <label>
                  Pincode
                  <input
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    pattern="^[1-9][0-9]{5}$"
                    title="Please enter a valid 6-digit Indian pincode"
                    maxLength="6"
                    value={form.pincode}
                    onChange={(event) => {
                      const pincode = event.target.value.replace(/\D/g, "").slice(0, 6);
                      setForm((current) => ({ ...current, pincode }));
                    }}
                    onInvalid={(event) => event.target.setCustomValidity("Please enter a valid 6-digit Indian pincode")}
                    onInput={(event) => event.target.setCustomValidity("")}
                  />
                </label>
              </div>
              {error && <p className="project-form-error" role="alert">{error}</p>}
              <div className="project-form-actions">
                <button
                  className="project-cancel-button"
                  type="button"
                  disabled={saving}
                  onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}
                >
                  Cancel
                </button>
                <button className="add-project-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </section>
          ))}
    </section>
  );
}

export default ProjectsPage;