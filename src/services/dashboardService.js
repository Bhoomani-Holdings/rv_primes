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