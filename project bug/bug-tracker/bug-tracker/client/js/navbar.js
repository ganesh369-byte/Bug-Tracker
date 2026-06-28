function renderNavbar(activePage) {
  const user = getCurrentUser();
  const nav = document.createElement("div");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="brand">🐞 Bug Tracker</div>
    <div class="nav-links">
      <a href="projects.html" class="${activePage === "projects" ? "active" : ""}">Projects</a>
      <a href="bugs.html" class="${activePage === "bugs" ? "active" : ""}">All Bugs</a>
      <span style="color: var(--text-light); font-size: 13px;">${user ? escapeHtml(user.name) : ""} (${user ? user.role : ""})</span>
      <button class="secondary" id="logoutBtn">Logout</button>
    </div>
  `;
  document.body.prepend(nav);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}
