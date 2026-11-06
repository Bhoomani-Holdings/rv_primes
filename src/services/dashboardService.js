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

  const careers = await response.json();
  return [...careers].sort((first, second) => {
    const firstCreated = Date.parse(first.createdAt || "") || 0;
    const secondCreated = Date.parse(second.createdAt || "") || 0;
    return secondCreated - firstCreated || Number(second.id || 0) - Number(first.id || 0);
  });
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

export const updateCareerPost = async (careerId, career) => {
  const response = await fetch(`${API_URL}/careers/${careerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(career)
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : {};
  if (!response.ok) {
    const message = response.status === 404
      ? result.message || "Career opening not found."
      : result.message || "Failed to update career post";
    throw new Error(message);
  }

  return result;
};

export const closeCareerPost = async (careerId) => {
  const response = await fetch(`${API_URL}/careers/${careerId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Closed" })
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : {};
  if (!response.ok) {
    throw new Error(result.message || "Unable to close career position");
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

export const getCareerApplications = async (careerId) => {
  const response = await fetch(`${API_URL}/careers/${careerId}/applications`);
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) {
    const message = result?.message || (response.status === 404
      ? "Applicants API route is unavailable. Restart the backend server and try again."
      : "Unable to load career applicants. Check that the backend server is running.");
    throw new Error(message);
  }
  if (!Array.isArray(result)) throw new Error("The server returned an invalid applicants response.");
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
