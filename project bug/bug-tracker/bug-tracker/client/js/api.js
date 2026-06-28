// Base URL of the backend API.
// Since the frontend is served by the same Express server (see server.js),
// a relative path works both locally and after deployment.
const API_BASE = "/api";

// ---------- Token helpers ----------
function getToken() {
  return localStorage.getItem("bt_token");
}

function setSession(data) {
  localStorage.setItem("bt_token", data.token);
  localStorage.setItem(
    "bt_user",
    JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
  );
}

function getCurrentUser() {
  const raw = localStorage.getItem("bt_user");
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem("bt_token");
  localStorage.removeItem("bt_user");
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}

// ---------- Core request wrapper ----------
async function apiRequest(path, { method = "GET", body = null } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token invalid/expired -> force re-login
  if (res.status === 401) {
    clearSession();
    window.location.href = "login.html";
    return Promise.reject(new Error("Session expired, please log in again"));
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ---------- Auth ----------
const AuthAPI = {
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  me: () => apiRequest("/auth/me"),
  allUsers: () => apiRequest("/auth/users"),
};

// ---------- Projects ----------
const ProjectAPI = {
  list: () => apiRequest("/projects"),
  get: (id) => apiRequest(`/projects/${id}`),
  create: (payload) => apiRequest("/projects", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/projects/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/projects/${id}`, { method: "DELETE" }),
  addMember: (id, userId) =>
    apiRequest(`/projects/${id}/members`, { method: "POST", body: { userId } }),
};

// ---------- Bugs ----------
const BugAPI = {
  list: (query = {}) => {
    const qs = new URLSearchParams(query).toString();
    return apiRequest(`/bugs${qs ? `?${qs}` : ""}`);
  },
  get: (id) => apiRequest(`/bugs/${id}`),
  create: (payload) => apiRequest("/bugs", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/bugs/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/bugs/${id}`, { method: "DELETE" }),
  addComment: (id, text) =>
    apiRequest(`/bugs/${id}/comments`, { method: "POST", body: { text } }),
};

// ---------- Small UI helper ----------
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
