(function () {
  const demoKey = "bydh-portfolio-demo-data-v1";
  const seed = window.PORTFOLIO_SEED || {};
  const config = window.SUPABASE_CONFIG || {};
  const hasSupabase = Boolean(config.url && config.anonKey);
  const contactCooldownKey = "bydh-contact-last-submit";
  const contactCooldownMs = 30 * 1000;
  const base = document.body.dataset.base || "";
  const page = document.body.dataset.page || "home";

  const routes = {
    home: { clean: "/", file: "index.html" },
    about: { clean: "/about/", file: "about/index.html" },
    experience: { clean: "/experience/", file: "experience/index.html" },
    projects: { clean: "/projects/", file: "projects/index.html" },
    certificates: { clean: "/certificates/", file: "certificates/index.html" },
    hobbies: { clean: "/hobbies/", file: "hobbies/index.html" },
    contact: { clean: "/contact/", file: "contact/index.html" },
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const byOrder = (a, b) => Number(a.sort_order || 999) - Number(b.sort_order || 999);
  const published = (items) => (items || []).filter((item) => item.published !== false).sort(byOrder);

  function isFilePreview() {
    return window.location.protocol === "file:";
  }

  function pathFor(route) {
    if (route.startsWith("project:")) {
      const slug = route.replace("project:", "");
      return isFilePreview()
        ? `${base}projects/detail/index.html?slug=${encodeURIComponent(slug)}`
        : `/projects/${encodeURIComponent(slug)}/`;
    }

    const target = routes[route] || routes.home;
    return isFilePreview() ? `${base}${target.file}` : target.clean;
  }

  function resolveAsset(url) {
    if (!url) return "";
    if (/^(https?:|mailto:|data:|#|\/)/.test(url) || url.startsWith("../")) return url;
    return `${base}${url}`;
  }

  function applyImageFallbacks(data) {
    const fallbacks = {
      experiences: "assets/profile.jpg",
      projects: "assets/test-project-image.svg",
      certificates: "assets/profile.jpg",
      education: "assets/profile.jpg",
      hobbies: "assets/profile.jpg",
    };
    Object.entries(fallbacks).forEach(([table, image]) => {
      if (Array.isArray(data[table])) {
        data[table] = data[table].map((item) => ({ ...item, image_url: item.image_url || image }));
      }
    });
    if (data.profile && !data.profile.photo_url) data.profile.photo_url = "assets/profile.jpg";
    return data;
  }

  function getDemoData() {
    const stored = localStorage.getItem(demoKey);
    if (!stored) return applyImageFallbacks(clone(seed));
    try {
      return applyImageFallbacks(JSON.parse(stored));
    } catch (_error) {
      return applyImageFallbacks(clone(seed));
    }
  }

  async function createClient() {
    if (!hasSupabase) return null;
    try {
      const supabaseModule = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
      return supabaseModule.createClient(config.url, config.anonKey);
    } catch (_error) {
      return null;
    }
  }

  async function loadData() {
    const client = await createClient();
    if (!client) return getDemoData();

    const tables = [
      "skills",
      "experiences",
      "projects",
      "certificates",
      "education",
      "social_links",
      "hobbies",
      "articles",
    ];
    const profileResult = await client.from("profiles").select("*").eq("id", "main").maybeSingle();
    const data = { ...clone(seed), profile: profileResult.data || seed.profile };

    await Promise.all(
      tables.map(async (table) => {
        const result = await client.from(table).select("*").order("sort_order", { ascending: true });
        if (!result.error && Array.isArray(result.data)) data[table] = result.data;
      }),
    );

    return data;
  }

  function applyRoutes() {
    document.querySelectorAll("[data-route]").forEach((element) => {
      element.setAttribute("href", pathFor(element.dataset.route));
    });

    document.querySelectorAll(`.site-nav [data-route="${page}"]`).forEach((element) => {
      element.classList.add("active");
      element.setAttribute("aria-current", "page");
    });
  }

  function applyPageTransitions() {
    document.documentElement.classList.add("page-ready");
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href") || "";
        const external = /^(https?:|mailto:|#)/.test(href);
        if (!external) document.documentElement.classList.add("page-leaving");
      });
    });
  }

  function text(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value || "";
    });
  }

  function setProfile(profile) {
    Object.entries(profile || {}).forEach(([key, value]) => text(`[data-profile="${key}"]`, value));

    document.querySelectorAll("[data-profile-image]").forEach((image) => {
      if (profile.photo_url) image.src = resolveAsset(profile.photo_url);
      image.alt = `Foto profil ${profile.full_name || "Bima Yusuf Dharmahita"}`;
    });

    document.querySelectorAll('[data-profile-link="email"]').forEach((link) => {
      link.href = `mailto:${profile.email || ""}`;
      if (link.textContent.includes("@")) link.textContent = profile.email || "";
    });

    document.querySelectorAll('[data-profile-link="linkedin"]').forEach((link) => {
      link.href = profile.linkedin || "#";
    });

    document.querySelectorAll('[data-profile-link="telegram"]').forEach((link) => {
      link.href = profile.telegram || "#";
      if (link.textContent.includes("Telegram") || link.textContent.includes("telegram")) {
        link.textContent = "Telegram";
      }
    });

    document.querySelectorAll('[data-profile-link="footer_link"]').forEach((link) => {
      if (profile.footer_link) link.href = profile.footer_link;
    });
  }

  function limitItems(container, items) {
    const limit = Number(container.dataset.limit || 0);
    return limit > 0 ? items.slice(0, limit) : items;
  }

  function renderSkills(skills) {
    document.querySelectorAll("[data-render-skills]").forEach((grid) => {
      grid.innerHTML = limitItems(grid, published(skills))
        .map(
          (skill) => `
            <article class="skill-card reveal">
              <p class="skill-meta">${escapeHtml(skill.category || "Keterampilan")} / ${escapeHtml(skill.level || "Terapan")}</p>
              <h3>${escapeHtml(skill.title)}</h3>
              <p>${escapeHtml(skill.description || "")}</p>
            </article>
          `,
        )
        .join("");
    });
  }

  function renderExperience(experiences) {
    document.querySelectorAll("[data-render-experience]").forEach((list) => {
      list.innerHTML = limitItems(list, published(experiences))
        .map(
          (item) => {
            const imageMarkup = item.image_url
              ? `<figure class="timeline-media"><img src="${resolveAsset(item.image_url)}" alt="${escapeHtml(item.role || item.organization)}" loading="lazy" /></figure>`
              : "";
            return `
              <article class="timeline-item reveal">
                <div>
                  <p class="timeline-meta">${escapeHtml(item.period || "")}</p>
                  <p class="timeline-meta">${escapeHtml(item.location || "")}</p>
                  ${imageMarkup}
                </div>
                <div>
                  <h3>${escapeHtml(item.role || "")}</h3>
                  <p><strong>${escapeHtml(item.organization || "")}</strong></p>
                  <p>${escapeHtml(item.description || "")}</p>
                  ${renderList(item.highlights)}
                </div>
              </article>
            `;
          },
        )
        .join("");
    });
  }

  function renderProjects(projects) {
    document.querySelectorAll("[data-render-projects]").forEach((grid) => {
      const visibleProjects = grid.dataset.featuredOnly === "true"
        ? published(projects).filter((project) => project.featured === true)
        : published(projects);
      grid.innerHTML = limitItems(grid, visibleProjects)
        .map((project) => projectCard(project))
        .join("");
    });
  }

  function projectCard(project) {
    const slug = project.slug || project.id;
    const imageMarkup = project.image_url
      ? `<figure class="project-media"><img src="${resolveAsset(project.image_url)}" alt="${escapeHtml(project.title)}" loading="lazy" /></figure>`
      : "";

    return `
      <a class="project-card morph-card reveal" href="${pathFor(`project:${slug}`)}">
        ${imageMarkup}
        <div class="project-card-body">
              <p class="card-kicker">${escapeHtml(project.category || "Proyek")}</p>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description || "")}</p>
          <div class="pill-row">${(project.tools || []).map((tool) => `<span class="pill">${escapeHtml(tool)}</span>`).join("")}</div>
          <p class="result">${escapeHtml(project.result || "")}</p>
        </div>
      </a>
    `;
  }

  function renderProjectDetail(projects) {
    const container = document.querySelector("[data-render-project-detail]");
    if (!container) return;

    const slug = currentProjectSlug();
    const project = published(projects).find((item) => item.slug === slug) || published(projects)[0];
    if (!project) {
      container.innerHTML = "<p>Proyek belum tersedia.</p>";
      return;
    }

    document.title = `${project.title} | Bima Yusuf Dharmahita`;
    const imageMarkup = project.image_url
      ? `<figure class="project-media detail-media"><img src="${resolveAsset(project.image_url)}" alt="${escapeHtml(project.title)}" loading="eager" /></figure>`
      : "";

    container.innerHTML = `
      ${imageMarkup}
      <p class="eyebrow">${escapeHtml(project.category || "Proyek")}</p>
      <h1>${escapeHtml(project.title)}</h1>
      <p class="page-lead">${escapeHtml(project.description || "")}</p>
      <div class="pill-row">${(project.tools || []).map((tool) => `<span class="pill">${escapeHtml(tool)}</span>`).join("")}</div>
      <div class="detail-panel">
        <p class="card-kicker">Hasil</p>
        <p>${escapeHtml(project.result || "")}</p>
      </div>
    `;
  }

  function renderCertificates(certificates) {
    document.querySelectorAll("[data-render-certificates]").forEach((list) => {
      list.innerHTML = limitItems(list, published(certificates))
        .map(
          (cert) => {
            const imageMarkup = cert.image_url
              ? `<figure class="certificate-media"><img src="${resolveAsset(cert.image_url)}" alt="${escapeHtml(cert.title)}" loading="lazy" /></figure>`
              : "";
            return `
              <article class="certificate-item reveal">
                ${imageMarkup}
                <p class="certificate-meta">${escapeHtml(cert.issuer || "Sertifikasi")}</p>
                <h3>${escapeHtml(cert.title)}</h3>
                ${cert.issued_at ? `<p class="muted">${escapeHtml(cert.issued_at)}</p>` : ""}
              </article>
            `;
          },
        )
        .join("");
    });
  }

  function renderEducation(education) {
    document.querySelectorAll("[data-render-education]").forEach((list) => {
      list.innerHTML = published(education)
        .map(
          (item) => `
            <article class="certificate-item reveal">
              ${item.image_url ? `<figure class="certificate-media"><img src="${resolveAsset(item.image_url)}" alt="${escapeHtml(item.degree || item.school)}" loading="lazy" /></figure>` : ""}
              <p class="certificate-meta">${escapeHtml(item.period || "")}</p>
              <h3>${escapeHtml(item.degree || "")}</h3>
              <p><strong>${escapeHtml(item.school || "")}</strong></p>
              <p class="muted">${escapeHtml(item.description || "")}</p>
            </article>
          `,
        )
        .join("");
    });
  }

  function renderHobbies(hobbies) {
    document.querySelectorAll("[data-render-hobbies]").forEach((grid) => {
      grid.innerHTML = limitItems(grid, published(hobbies))
        .map(
          (item) => {
            const imageMarkup = item.image_url
              ? `<figure class="hobby-media"><img src="${resolveAsset(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy" /></figure>`
              : "";
            return `
              <article class="hobby-card reveal">
                ${imageMarkup}
                <div class="hobby-card-body">
                  <h3>${escapeHtml(item.title || "Hobi")}</h3>
                  <p>${escapeHtml(item.description || "")}</p>
                </div>
              </article>
            `;
          },
        )
        .join("");
    });
  }

  function renderSocialLinks(links) {
    document.querySelectorAll("[data-render-socials]").forEach((list) => {
      list.innerHTML = published(links)
        .map(
          (item) => `
            <a class="social-link" href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">
              ${escapeHtml(item.label || "Tautan")}
            </a>
          `,
        )
        .join("");
    });
  }

  function renderList(items) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentProjectSlug() {
    if (document.body.dataset.projectSlug) return document.body.dataset.projectSlug;
    const querySlug = new URLSearchParams(window.location.search).get("slug");
    if (querySlug) return querySlug;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const projectIndex = parts.indexOf("projects");
    return projectIndex >= 0 ? parts[projectIndex + 1] : "";
  }

  async function handleContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("contact-status");
    const payload = Object.fromEntries(new FormData(form).entries());
    if (payload.website) {
      status.textContent = "Pesan tidak dapat diproses.";
      return;
    }
    delete payload.website;
    const lastSubmit = Number(localStorage.getItem(contactCooldownKey) || 0);
    if (Date.now() - lastSubmit < contactCooldownMs) {
      const seconds = Math.ceil((contactCooldownMs - (Date.now() - lastSubmit)) / 1000);
      status.textContent = `Silakan tunggu ${seconds} detik sebelum mengirim pesan lagi.`;
      return;
    }
    payload.created_at = new Date().toISOString();

    const client = await createClient();
    if (client) {
      const { error } = await client.from("contact_messages").insert(payload);
      if (error) {
        status.textContent = "Pesan belum terkirim. Silakan hubungi lewat email.";
        return;
      }
    } else {
      const data = getDemoData();
      data.contact_messages = data.contact_messages || [];
      data.contact_messages.unshift({ ...payload, id: crypto.randomUUID() });
      localStorage.setItem(demoKey, JSON.stringify(data));
    }

    localStorage.setItem(contactCooldownKey, String(Date.now()));
    form.reset();
    status.textContent = "Pesan berhasil disimpan.";
  }

  function bindContactForm() {
    const form = document.getElementById("contact-form");
    if (form) form.addEventListener("submit", handleContact);
  }

  function revealOnScroll() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // Menetapkan indeks jeda untuk setiap wadah induk
    const parents = new Map();
    items.forEach((item) => {
      const parent = item.parentElement;
      if (!parents.has(parent)) parents.set(parent, 0);
      const i = parents.get(parent);
      item.style.setProperty("--reveal-i", i);
      parents.set(parent, i + 1);
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    items.forEach((item) => observer.observe(item));
  }

  function bindMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !isExpanded);
      nav.classList.toggle("is-open");
    });
  }

  async function init() {
    applyRoutes();
    applyPageTransitions();
    bindMobileNav();
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const data = await loadData();
    setProfile(data.profile || {});
    renderSkills(data.skills);
    renderExperience(data.experiences);
    renderProjects(data.projects);
    renderProjectDetail(data.projects);
    renderCertificates(data.certificates);
    renderEducation(data.education);
    renderHobbies(data.hobbies);
    renderSocialLinks(data.social_links);
    bindContactForm();
    revealOnScroll();
  }

  init();
})();
