const API_URL = "http://localhost:5000/api";

export const getDashboardData = async () => {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const getCareerPosts = async () => {
  const response = await fetch(`${API_URL}/careers`);

  if (!response.ok) {
    const message = response.status === 404
      ? "The Careers API is not available. Restart the backend server and try again."
      : "Failed to fetch career posts";
    throw new Error(message);
  }

  return response.json();
};

export const createCareerPost = async (career) => {
  const response = await fetch(`${API_URL}/careers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(career)
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : {};
  if (!response.ok) {
    const message = response.status === 404
      ? "The Careers API is not available. Restart the backend server and try again."
      : result.message || "Failed to create career post";
    throw new Error(message);
  }

  return result;
};

export const createCareerApplication = async (careerId, application) => {
  const formData = new FormData();
  formData.append("fullName", application.fullName);
  formData.append("email", application.email);
  formData.append("phone", application.phone);
  formData.append("experience", application.experience);
  formData.append("currentCTC", application.currentCTC);
  formData.append("linkedin", application.linkedin);
  formData.append("coverLetter", application.coverLetter);
  formData.append("resume", application.resume);

  const response = await fetch(`${API_URL}/careers/${careerId}/applications`, {
    method: "POST",
    body: formData
  });
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(result.message || `Unable to submit application (${response.status})`);
  }

  return result;
};

export const createProject = async ({ project, photos, videos }) => {
  const formData = new FormData();
  formData.append("project", JSON.stringify(project));
  photos.forEach((photo) => formData.append("photos", photo));
  videos.forEach((video) => formData.append("videos", video));

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to create project");
  }

  return result;
};

export const updateProject = async (projectId, updates) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to update project");
  }

  return result;
};
