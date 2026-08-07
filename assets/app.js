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
      image.alt = `Foto profil ${profile.full_name || "Bima Yusuf Dharmahita"}`;
      image.classList.remove("is-ready");
      image.setAttribute("aria-busy", "true");

      const fallback = resolveAsset("assets/profile.jpg");
      const source = profile.photo_url ? resolveAsset(profile.photo_url) : fallback;
      const revealImage = () => {
        image.classList.add("is-ready");
        image.removeAttribute("aria-busy");
      };

      image.dataset.fallbackAttempted = "false";
      image.onload = revealImage;
      image.onerror = () => {
        if (source !== fallback && image.dataset.fallbackAttempted !== "true") {
          image.dataset.fallbackAttempted = "true";
          image.src = fallback;
          return;
        }
        revealImage();
      };
      image.removeAttribute("src");
      image.src = source;
      if (image.complete && image.naturalWidth > 0) revealImage();
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

  function socialIcon(url, label) {
    const value = `${url || ""} ${label || ""}`.toLowerCase();
    const svg = (content, attributes = 'fill="currentColor"') =>
      `<svg viewBox="0 0 24 24" role="img" aria-hidden="true" ${attributes}>${content}</svg>`;

    if (value.includes("linkedin")) {
      return svg('<path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 1 0 5.25 7.04 2.02 2.02 0 0 0 5.25 3ZM20.44 13.41c0-3.47-1.85-5.09-4.32-5.09-1.99 0-2.88 1.1-3.38 1.87V8.5H9.36V20h3.38v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.85 1.71 1.85 3.05V20h3.38l.33-6.59Z" />');
    }
    if (value.includes("telegram") || value.includes("t.me")) {
      return svg('<path d="m21.4 4.6-2.95 13.9c-.22.98-.8 1.22-1.63.76l-4.5-3.32-2.17 2.09c-.24.24-.44.44-.9.44l.32-4.58 8.34-7.54c.36-.32-.08-.5-.56-.18L7.04 12.7l-4.35-1.36c-.95-.3-.97-.95.2-1.4L19.9 3.96c.8-.3 1.5.18 1.5.64Z" />');
    }
    if (value.includes("github")) {
      return svg('<path d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.49.09.67-.21.67-.47v-1.67c-2.72.59-3.3-1.16-3.3-1.16-.44-1.13-1.08-1.43-1.08-1.43-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .87 1.49 2.28 1.06 2.84.81.09-.63.34-1.06.62-1.3-2.17-.25-4.45-1.09-4.45-4.83 0-1.07.38-1.94 1-2.62-.1-.25-.43-1.25.1-2.59 0 0 .82-.26 2.68 1a9.26 9.26 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .53 1.34.2 2.34.1 2.59.62.68 1 1.55 1 2.62 0 3.75-2.29 4.58-4.47 4.82.35.3.66.9.66 1.82v2.69c0 .26.18.56.68.47A9.75 9.75 0 0 0 12 2.25Z" />');
    }
    if (value.includes("instagram")) {
      return svg('<rect x="3.5" y="3.5" width="17" height="17" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="17.5" cy="6.5" r="1" />');
    }
    if (value.includes("facebook")) {
      return svg('<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46h1.72V3.96c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.38V10H7v3h2.92v8h3.58Z" />');
    }
    if (value.includes("youtube")) {
      return svg('<path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.63 4.6 12 4.6 12 4.6s-5.63 0-7.48.49a2.98 2.98 0 0 0-2.1 2.1C1.93 9.04 1.93 12 1.93 12s0 2.96.49 4.81c.23.86.91 1.54 1.77 1.77 1.85.49 7.81.49 7.81.49s5.63 0 7.48-.49a2.98 2.98 0 0 0 2.1-2.1c.49-1.85.49-4.81.49-4.81s0-2.96-.49-4.81ZM9.75 15.1V8.9l5.2 3.1-5.2 3.1Z" />');
    }
    if (value.includes("tiktok")) {
      return svg('<path d="M15.8 3h3.05c.15 1.24.77 2.37 1.74 3.16A5.98 5.98 0 0 0 24 7.42v3.1a9.1 9.1 0 0 1-5.1-1.57v6.2a5.86 5.86 0 1 1-5.86-5.86c.39 0 .78.04 1.15.11v3.22a2.8 2.8 0 1 0 1.61 2.53V3Z" />');
    }
    if (value.includes("whatsapp") || value.includes("wa.me")) {
      return svg('<path d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L.05 24l6.28-1.65a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.43Zm-8.46 18.2h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.73.98.99-3.64-.23-.37a9.85 9.85 0 0 1-1.51-5.17C2.19 6.47 6.62 2.04 12.07 2.04a9.8 9.8 0 0 1 6.97 2.89 9.8 9.8 0 0 1 2.88 6.98c0 5.45-4.43 9.77-9.86 9.77Zm5.39-7.34c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />');
    }
    if (value.includes("twitter") || value.includes("x.com")) {
      return svg('<path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.41L6.45 22H3.33l7.24-8.27L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.8h1.73L8.27 4.1H6.42L17.8 19.8Z" />');
    }
    if (value.includes("mailto:") || /\bemail\b/.test(value)) {
      return svg('<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" />');
    }
    return svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" /><path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" fill="none" stroke="currentColor" stroke-width="2" />');
  }

  function renderSocialLinks(links) {
    document.querySelectorAll("[data-render-socials]").forEach((list) => {
      list.innerHTML = published(links)
        .map(
          (item) => {
            const label = item.label || "Tautan";
            return `
            <a class="social-link" href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
              <span class="social-icon">${socialIcon(item.url, label)}</span>
              <span class="social-link-label">${escapeHtml(label)}</span>
            </a>
          `;
          },
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

    let data;
    try {
      data = await loadData();
    } catch (_error) {
      // Tetap tampilkan data demo jika koneksi sumber data gagal.
      data = getDemoData();
    }
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
    document.documentElement.classList.add("data-ready");
    revealOnScroll();
  }

  init();
})();
