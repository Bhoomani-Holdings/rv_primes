const API_URL = "http://localhost:5000/api";

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load employees");
  return [...result].sort((first, second) => {
    const firstCreated = Date.parse(first.createdAt || "") || 0;
    const secondCreated = Date.parse(second.createdAt || "") || 0;
    return secondCreated - firstCreated || Number(second.id || 0) - Number(first.id || 0);
  });
};

export const createEmployee = async (employee) => {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to add employee");
  return result;
};
