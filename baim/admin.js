(function () {
  const demoKey = "bydh-portfolio-demo-data-v1";
  const seed = window.PORTFOLIO_SEED || {};
  const config = window.SUPABASE_CONFIG || {};
  const hasSupabase = Boolean(config.url && config.anonKey);
  const hostName = window.location.hostname || "";
  const isLocalPreview =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostName) ||
    hostName.endsWith(".local") ||
    hostName.startsWith("192.168.") ||
    hostName.startsWith("10.");
  const allowDemo = !hasSupabase && isLocalPreview;
  const localAdminEmail = "bimayusufdh@gmail.com";
  let localAdminPassword = "sementara123";
  const localRecoveryEmailsKey = "bydh-admin-recovery-emails";
  const localRecoveryCodesKey = "bydh-admin-recovery-codes";
  const authStateKey = "bydh-admin-auth-state";

  const modules = {
    profile: {
      label: "Profile",
      table: "profiles",
      single: true,
      titleField: "full_name",
      fields: [
        ["full_name", "Nama Lengkap", "text"],
        ["role", "Role", "text"],
        ["headline", "Headline", "textarea"],
        ["summary", "Ringkasan", "textarea"],
        ["location", "Lokasi", "text"],
        ["email", "Email", "email"],
        ["website", "Website", "url"],
        ["linkedin", "LinkedIn", "url"],
        ["telegram", "Telegram", "url"],
        ["focus_area", "Fokus Utama", "text"],
        ["certifications", "Sertifikasi", "text"],
        ["snapshot_credential", "Credential Snapshot", "text"],
        ["hero_highlight_title", "Judul Snapshot", "text"],
        ["snapshot_label", "Label Snapshot", "text"],
        ["cta_view_projects_text", "Teks Tombol Lihat Project", "text"],
        ["cta_contact_text", "Teks Tombol Hubungi Saya", "text"],
        ["cta_about_text", "Teks Tombol Baca Profil", "text"],
        ["cta_experience_text", "Teks Tombol Pengalaman", "text"],
        ["featured_projects_label", "Label Featured Projects", "text"],
        ["featured_projects_title", "Judul Featured Projects", "text"],
        ["cta_projects_text", "Teks Tombol Semua Project", "text"],
        ["core_skills_label", "Label Core Skills", "text"],
        ["core_skills_title", "Judul Core Skills", "text"],
        ["cta_profile_text", "Teks Tombol Detail Profil", "text"],
        ["about_page_label", "Label Halaman About", "text"],
        ["about_page_title", "Judul Halaman About", "text"],
        ["about_skills_label", "Label Skills About", "text"],
        ["about_skills_title", "Judul Skills About", "text"],
        ["about_education_label", "Label Education About", "text"],
        ["about_education_title", "Judul Education About", "text"],
        ["experience_page_label", "Label Halaman Experience", "text"],
        ["experience_page_title", "Judul Halaman Experience", "text"],
        ["experience_page_intro", "Intro Halaman Experience", "textarea"],
        ["certificates_page_label", "Label Halaman Certificates", "text"],
        ["certificates_page_title", "Judul Halaman Certificates", "text"],
        ["certificates_page_intro", "Intro Halaman Certificates", "textarea"],
        ["projects_page_label", "Label Halaman Projects", "text"],
        ["projects_page_title", "Judul Halaman Projects", "text"],
        ["projects_page_intro", "Intro Halaman Projects", "textarea"],
        ["contact_page_label", "Label Halaman Contact", "text"],
        ["contact_page_title", "Judul Halaman Contact", "text"],
        ["contact_page_intro", "Intro Halaman Contact", "textarea"],
        ["contact_direct_label", "Label Direct Contact", "text"],
        ["contact_direct_title", "Judul Direct Contact", "text"],
        ["photo_url", "Foto Profil", "image"],
        ["footer_text", "Teks Footer (Nama/Copyright)", "text"],
        ["footer_link_text", "Teks Link Footer", "text"],
        ["footer_link", "URL Link Footer", "url"],
      ],
    },
    skills: {
      label: "Skills",
      table: "skills",
      titleField: "title",
      summaryField: "description",
      fields: [
        ["title", "Nama Skill", "text"],
        ["category", "Kategori", "text"],
        ["description", "Deskripsi", "textarea"],
        ["level", "Level", "text"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    experiences: {
      label: "Experience",
      table: "experiences",
      titleField: "role",
      summaryField: "organization",
      fields: [
        ["organization", "Organisasi", "text"],
        ["role", "Role", "text"],
        ["location", "Lokasi", "text"],
        ["period", "Periode", "text"],
        ["description", "Deskripsi", "textarea"],
        ["image_url", "Gambar", "image"],
        ["highlights", "Highlights", "list"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    projects: {
      label: "Projects",
      table: "projects",
      titleField: "title",
      summaryField: "description",
      fields: [
        ["title", "Judul", "text"],
        ["slug", "Slug", "text"],
        ["category", "Kategori", "text"],
        ["description", "Deskripsi", "textarea"],
        ["tools", "Tools", "tags"],
        ["result", "Hasil", "textarea"],
        ["image_url", "Gambar Project", "image"],
        ["project_url", "Project URL", "url"],
        ["repository_url", "Repository URL", "url"],
        ["sort_order", "Urutan", "number"],
        ["featured", "Featured", "checkbox"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    certificates: {
      label: "Certificates",
      table: "certificates",
      titleField: "title",
      summaryField: "issuer",
      fields: [
        ["title", "Nama Sertifikasi", "text"],
        ["issuer", "Penerbit", "text"],
        ["issued_at", "Tanggal", "text"],
        ["credential_url", "Credential URL", "url"],
        ["image_url", "Gambar", "image"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    education: {
      label: "Education",
      table: "education",
      titleField: "degree",
      summaryField: "school",
      fields: [
        ["school", "Institusi", "text"],
        ["degree", "Program", "text"],
        ["period", "Periode", "text"],
        ["description", "Deskripsi", "textarea"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    hobbies: {
      label: "Hobbies",
      table: "hobbies",
      titleField: "title",
      summaryField: "description",
      fields: [
        ["title", "Judul Hobi", "text"],
        ["description", "Deskripsi", "textarea"],
        ["image_url", "Gambar", "image"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    articles: {
      label: "Articles",
      table: "articles",
      titleField: "title",
      summaryField: "excerpt",
      fields: [
        ["title", "Judul", "text"],
        ["slug", "Slug", "text"],
        ["excerpt", "Excerpt", "textarea"],
        ["content", "Konten", "textarea"],
        ["published_at", "Tanggal Publish", "text"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    social_links: {
      label: "Social Links",
      table: "social_links",
      titleField: "label",
      summaryField: "url",
      fields: [
        ["label", "Label", "text"],
        ["url", "URL", "url"],
        ["sort_order", "Urutan", "number"],
        ["published", "Tampilkan", "checkbox"],
      ],
    },
    contact_messages: {
      label: "Messages",
      table: "contact_messages",
      titleField: "name",
      summaryField: "message",
      readonly: true,
      fields: [],
    },
  };

  const state = {
    active: "profile",
    client: null,
    demo: false,
    data: {},
    editing: null,
    profileEditMode: false,
    loggedIn: false,
    recoveryEmails: [],
    pendingRecovery: null,
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const byOrder = (a, b) => Number(a.sort_order || 999) - Number(b.sort_order || 999);

  function normalizeProfileData(profile = {}) {
    const baseProfile = clone(seed.profile || {});
    const mergedProfile = { ...baseProfile, ...(profile || {}) };
    modules.profile.fields.forEach(([name]) => {
      if (mergedProfile[name] === undefined || mergedProfile[name] === null || mergedProfile[name] === "") {
        mergedProfile[name] = baseProfile[name] ?? "";
      }
    });
    return mergedProfile;
  }

  function resolveAsset(url) {
    if (!url) return "";
    if (/^(https?:|mailto:|tel:|data:|#|\/)/.test(url) || url.startsWith("../")) return url;
    return `../${url}`;
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

  function getDemoData() {
    const stored = localStorage.getItem(demoKey);
    if (!stored) return clone(seed);
    try {
      return JSON.parse(stored);
    } catch (_error) {
      return clone(seed);
    }
  }

  function saveDemoData() {
    localStorage.setItem(demoKey, JSON.stringify(state.data));
  }

  function getRecoveryEmails() {
    const stored = localStorage.getItem(localRecoveryEmailsKey);
    if (!stored) return [localAdminEmail];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length ? parsed : [localAdminEmail];
    } catch (_error) {
      return [localAdminEmail];
    }
  }

  function saveRecoveryEmails(list) {
    state.recoveryEmails = list.filter(Boolean);
    localStorage.setItem(localRecoveryEmailsKey, JSON.stringify(state.recoveryEmails));
  }

  function addRecoveryCode(email, code) {
    const codes = JSON.parse(localStorage.getItem(localRecoveryCodesKey) || "{}") || {};
    codes[email.trim().toLowerCase()] = code;
    localStorage.setItem(localRecoveryCodesKey, JSON.stringify(codes));
  }

  function consumeRecoveryCode(email, code) {
    const codes = JSON.parse(localStorage.getItem(localRecoveryCodesKey) || "{}") || {};
    const expected = codes[email.trim().toLowerCase()];
    if (expected && expected === code) {
      delete codes[email.trim().toLowerCase()];
      localStorage.setItem(localRecoveryCodesKey, JSON.stringify(codes));
      return true;
    }
    return false;
  }

  async function loadAllData() {
    if (state.demo || !state.client) {
      state.data = getDemoData();
      if (state.data.profile) {
        state.data.profile = normalizeProfileData(state.data.profile);
      }
      return;
    }

    state.data = clone(seed);
    const profile = await state.client.from("profiles").select("*").eq("id", "main").maybeSingle();
    if (!profile.error && profile.data) {
      state.data.profile = normalizeProfileData(profile.data);
    } else {
      state.data.profile = normalizeProfileData(seed.profile || {});
    }

    await Promise.all(
      Object.values(modules)
        .filter((module) => !module.single)
        .map(async (module) => {
          const query = state.client.from(module.table).select("*");
          const result =
            module.table === "contact_messages"
              ? await query.order("created_at", { ascending: false })
              : await query.order("sort_order", { ascending: true });
          if (!result.error) state.data[module.table] = result.data || [];
        }),
    );
  }

  function renderAccountSettings() {
    const container = document.getElementById("account-settings");
    if (!container) return;
    const recoveryEmails = state.recoveryEmails.length ? state.recoveryEmails : [localAdminEmail];
    container.innerHTML = `
      <article class="account-settings-card">
        <div class="profile-editor-header">
          <div>
            <p class="record-title">Akun Admin</p>
            <p class="record-summary">Gunakan akun tetap untuk masuk dan kelola alamat pemulihan password.</p>
          </div>
        </div>
        <div class="account-settings-grid">
          <div class="profile-field">
            <span class="profile-field-label">Email login</span>
            <div class="profile-view-value">${escapeHtml(localAdminEmail)}</div>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Password sementara</span>
            <div class="profile-view-value">${escapeHtml(localAdminPassword)}</div>
          </div>
        </div>
        <div class="profile-field">
          <span class="profile-field-label">Ubah password</span>
          <form id="change-password-form" class="recovery-form">
            <input id="current-password-input" type="password" placeholder="Password lama" />
            <input id="new-password-input" type="password" placeholder="Password baru" />
            <input id="confirm-password-input" type="password" placeholder="Konfirmasi password" />
            <button class="button primary" type="submit">Ganti password</button>
          </form>
          <p id="password-change-status" class="profile-inline-status" role="status"></p>
        </div>
        <div class="profile-field">
          <span class="profile-field-label">Email pemulihan</span>
          <div class="recovery-list">
            ${recoveryEmails.map((email) => `
              <div class="recovery-item">
                <span>${escapeHtml(email)}</span>
                <button class="button ghost" type="button" data-action="remove-recovery" data-email="${escapeHtml(email)}">Hapus</button>
              </div>
            `).join("")}
          </div>
          <form id="recovery-form" class="recovery-form">
            <input id="recovery-email-input" type="email" placeholder="Tambah email pemulihan" />
            <button class="button primary" type="submit">Tambah</button>
          </form>
        </div>
      </article>
    `;

    container.querySelector("#change-password-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const current = document.getElementById("current-password-input")?.value || "";
      const next = document.getElementById("new-password-input")?.value || "";
      const confirm = document.getElementById("confirm-password-input")?.value || "";
      const status = document.getElementById("password-change-status");
      if (!current || !next || !confirm) {
        if (status) status.textContent = "Isi semua field password.";
        return;
      }
      if (current !== localAdminPassword) {
        if (status) status.textContent = "Password lama tidak sesuai.";
        return;
      }
      if (next.length < 6) {
        if (status) status.textContent = "Password minimal 6 karakter.";
        return;
      }
      if (next !== confirm) {
        if (status) status.textContent = "Password baru dan konfirmasi tidak cocok.";
        return;
      }
      localAdminPassword = next;
      if (status) status.textContent = "Password berhasil diganti.";
      container.querySelector("#change-password-form").reset();
    });

    container.querySelector("#recovery-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("recovery-email-input");
      const value = input?.value?.trim();
      if (!value) return;
      const next = Array.from(new Set([...state.recoveryEmails, value]));
      saveRecoveryEmails(next);
      renderAccountSettings();
    });

    container.querySelectorAll("[data-action='remove-recovery']").forEach((button) => {
      button.addEventListener("click", () => {
        const email = button.dataset.email;
        const next = state.recoveryEmails.filter((item) => item !== email);
        saveRecoveryEmails(next);
        renderAccountSettings();
      });
    });
  }

  function buildNav() {
    const nav = document.getElementById("admin-nav");
    nav.innerHTML = Object.entries(modules)
      .map(
        ([key, module]) => `
          <button type="button" data-module="${key}" class="${key === state.active ? "active" : ""}">
            <span>${module.label}</span>
          </button>
        `,
      )
      .join("");

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-module]");
      if (!button) return;
      state.active = button.dataset.module;
      document.querySelectorAll(".admin-nav button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderModule();
    });
  }

  function renderModule() {
    const module = modules[state.active];
    document.getElementById("module-kicker").textContent = module.label;
    document.getElementById("module-title").textContent = module.label;
    document.getElementById("add-button").hidden = module.single || module.readonly;
    renderAccountSettings();

    if (module.single) {
      renderProfilePanel();
      return;
    }

    state.profileEditMode = false;
    const rows = state.data[module.table] || [];
    const sortedRows = module.table === "contact_messages" ? rows : [...rows].sort(byOrder);
    renderRecordList(sortedRows, module);
  }

  function renderProfilePanel() {
    const module = modules.profile;
    const profile = normalizeProfileData(state.data.profile || {});
    const currentValue = state.profileEditMode ? state.editing || profile : profile;
    const list = document.getElementById("record-list");

    if (state.profileEditMode) {
      list.innerHTML = `
        <article class="record-item profile-editor-card">
          <div class="profile-editor-header">
            <div>
              <p class="record-title">Profil</p>
              <p class="record-summary">Ubah nilai profil yang ingin diperbarui.</p>
            </div>
            <div class="profile-inline-actions">
              <button class="button ghost" type="button" data-action="profile-cancel">Batal</button>
              <button class="button primary" type="submit" id="profile-save-button" form="profile-inline-form">Simpan</button>
            </div>
          </div>
          <form id="profile-inline-form" class="profile-inline-form">
            <div class="profile-form-grid">
              ${module.fields
                .map(([name, label, type]) => {
                  const value = currentValue[name];
                  if (type === "checkbox") {
                    const checked = value !== false ? "checked" : "";
                    return `
                      <label class="check-row">
                        <input name="${name}" type="checkbox" ${checked} />
                        ${label}
                      </label>
                    `;
                  }
                  if (type === "textarea") {
                    return `
                      <label class="wide-field">
                        <span class="profile-field-label">${label}</span>
                        <textarea name="${name}" rows="5">${escapeHtml(value || "")}</textarea>
                      </label>
                    `;
                  }
                  if (type === "image") {
                    const src = value ? resolveAsset(value) : "";
                    return `
                      <label class="wide-field">
                        <span class="profile-field-label">${label}</span>
                        <div class="profile-image-field">
                          <input name="${name}" type="text" value="${escapeHtml(value || "")}" placeholder="URL gambar atau isi path gambar" />
                          <input type="file" accept="image/*" class="image-file-picker" data-target-input="input-${name}" data-target-preview="preview-${name}" />
                          <img id="preview-${name}" class="profile-preview" src="${escapeHtml(src)}" alt="Preview" ${src ? "" : "style=\"display:none;\""} />
                        </div>
                      </label>
                    `;
                  }
                  return `
                    <label class="profile-edit-field">
                      <span class="profile-field-label">${label}</span>
                      <input name="${name}" type="${type}" value="${escapeHtml(value || "")}" />
                    </label>
                  `;
                })
                .join("")}
            </div>
            <div id="profile-form-status" class="profile-inline-status" role="status"></div>
          </form>
        </article>
      `;

      const inlineForm = document.getElementById("profile-inline-form");
      if (inlineForm) {
        inlineForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const status = document.getElementById("profile-form-status");
          const saveButton = document.getElementById("profile-save-button");
          const pendingImage = inlineForm.querySelector('input[data-image-pending="true"]');
          if (pendingImage) {
            if (status) status.textContent = "Gambar sedang diproses. Tunggu sebentar...";
            return;
          }
          if (status) status.textContent = "Menyimpan...";
          if (saveButton) saveButton.disabled = true;
          const payload = collectFormData(inlineForm);
          const result = await saveRecord(payload);
          if (result.error) {
            if (status) status.textContent = result.error.message || "Data belum tersimpan.";
            if (saveButton) saveButton.disabled = false;
            return;
          }
          await loadAllData();
          state.profileEditMode = false;
          state.editing = null;
          renderModule();
        });
        bindImagePickers(inlineForm);
      }
      return;
    }

    list.innerHTML = `
      <article class="record-item profile-editor-card">
        <div class="profile-editor-header">
          <div>
            <p class="record-title">Profil</p>
            <p class="record-summary">Semua informasi profil sudah diisi dengan data awal yang siap diedit.</p>
          </div>
          <button class="button primary" type="button" data-action="profile-edit">Edit</button>
        </div>
        <div class="profile-view-grid">
          ${module.fields
            .map(([name, label, type]) => {
              const value = currentValue[name];
              if (type === "image") {
                const src = value ? resolveAsset(value) : "";
                return `
                  <div class="profile-field">
                    <span class="profile-field-label">${label}</span>
                    <div class="profile-view-value">
                      ${src ? `<img class="profile-preview" src="${escapeHtml(src)}" alt="Foto profil" />` : '<span class="muted">Belum diisi</span>'}
                    </div>
                  </div>
                `;
              }
              const displayValue = value || "Belum diisi";
              return `
                <div class="profile-field">
                  <span class="profile-field-label">${label}</span>
                  <div class="profile-view-value">${escapeHtml(displayValue)}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>
    `;
  }

  function renderRecordList(rows, module) {
    const list = document.getElementById("record-list");
    if (!rows.length) {
      list.innerHTML = '<article class="record-item"><p class="record-title">Belum ada data.</p></article>';
      return;
    }

    list.innerHTML = rows
      .map((row) => {
        const title = row[module.titleField] || row.full_name || row.email || "Data";
        const summary = row[module.summaryField] || row.role || row.created_at || "";
        return `
          <article class="record-item">
            <div>
              <p class="record-title">${escapeHtml(title)}</p>
              <p class="record-summary">${escapeHtml(summary)}</p>
            </div>
            <div class="record-actions">
              ${
                module.readonly
                  ? ""
                  : `<button class="button ghost" type="button" data-action="edit" data-id="${escapeHtml(row.id || "main")}">Edit</button>`
              }
              ${
                module.single
                  ? ""
                  : `<button class="button ghost" type="button" data-action="delete" data-id="${escapeHtml(row.id)}">Hapus</button>`
              }
            </div>
          </article>
        `;
      })
      .join("");
  }

  function findRecord(id) {
    const module = modules[state.active];
    if (module.single) return state.data.profile || {};
    return (state.data[module.table] || []).find((row) => row.id === id);
  }

  function bindImagePickers(container) {
    container.querySelectorAll(".image-file-picker").forEach((picker) => {
      picker.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const targetInput = container.querySelector(`input[name="${picker.dataset.targetInput?.replace("input-", "") || ""}"]`) || null;
        const targetPreview = container.querySelector(`#${picker.dataset.targetPreview}`);
        const saveButton = document.getElementById("profile-save-button");
        const status = document.getElementById("profile-form-status");

        if (targetInput) {
          targetInput.dataset.imagePending = "true";
          targetInput.value = "";
        }
        if (saveButton) saveButton.disabled = true;
        if (status) status.textContent = "Memproses gambar...";

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataUrl = loadEvent.target.result;
          if (targetInput) {
            targetInput.value = dataUrl;
            targetInput.dataset.imagePending = "false";
            targetInput.dataset.imageSource = "file";
          }
          if (targetPreview) {
            targetPreview.src = dataUrl;
            targetPreview.style.display = "block";
          }
          if (saveButton) saveButton.disabled = false;
          if (status) status.textContent = "Gambar siap disimpan.";
        };
        reader.onerror = () => {
          if (targetInput) {
            targetInput.dataset.imagePending = "false";
            targetInput.dataset.imageSource = "";
          }
          if (saveButton) saveButton.disabled = false;
          if (status) status.textContent = "Gambar gagal diproses.";
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function openDialog(record = null) {
    const module = modules[state.active];
    state.editing = record ? clone(record) : null;
    document.getElementById("dialog-kicker").textContent = module.label;
    document.getElementById("dialog-title").textContent = record ? "Edit Data" : "Tambah Data";
    document.getElementById("form-status").textContent = "";
    renderFields(module, record || {});
    document.getElementById("record-dialog").showModal();
  }

  function renderFields(module, record) {
    const fields = document.getElementById("form-fields");
    fields.innerHTML = module.fields
      .map(([name, label, type]) => {
        const value = record[name];
        if (type === "checkbox") {
          const checked = value !== false ? "checked" : "";
          return `
            <label class="check-row">
              <input name="${name}" type="checkbox" ${checked} />
              ${label}
            </label>
          `;
        }
        if (type === "textarea" || type === "list" || type === "tags") {
          const textValue = Array.isArray(value) ? value.join(type === "tags" ? ", " : "\n") : value || "";
          return `
            <label class="wide-field">
              ${label}
              <textarea name="${name}" rows="${type === "textarea" ? "5" : "4"}">${escapeHtml(textValue)}</textarea>
            </label>
          `;
        }
        if (type === "image") {
          const src = value ? resolveAsset(value) : "";
          return `
            <label class="wide-field">
              ${label}
              <div style="display: grid; gap: 8px; margin-top: 6px;">
                <input name="${name}" type="text" value="${escapeHtml(value || "")}" placeholder="URL gambar atau upload file..." id="input-${name}" />
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="file" accept="image/*" data-target-input="input-${name}" data-target-preview="preview-${name}" class="image-file-picker" style="font-size: 0.85rem;" />
                  <img id="preview-${name}" src="${escapeHtml(src)}" alt="Preview" style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid var(--line); background: var(--bg-card); ${src ? "" : "display:none;"}" />
                </div>
              </div>
            </label>
          `;
        }
        return `
          <label>
            ${label}
            <input name="${name}" type="${type}" value="${escapeHtml(value || "")}" />
          </label>
        `;
      })
      .join("");

    fields.querySelectorAll(".image-file-picker").forEach((picker) => {
      picker.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const targetInput = document.getElementById(picker.dataset.targetInput);
        const targetPreview = document.getElementById(picker.dataset.targetPreview);
        const saveButton = document.getElementById("save-button");
        const status = document.getElementById("form-status");

        if (targetInput) {
          targetInput.dataset.imagePending = "true";
          targetInput.value = "";
        }
        if (saveButton) saveButton.disabled = true;
        if (status) status.textContent = "Memproses gambar...";

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (targetInput) {
            targetInput.value = dataUrl;
            targetInput.dataset.imagePending = "false";
            targetInput.dataset.imageSource = "file";
          }
          if (targetPreview) {
            targetPreview.src = dataUrl;
            targetPreview.style.display = "block";
          }
          if (saveButton) saveButton.disabled = false;
          if (status) status.textContent = "Gambar siap disimpan.";
        };
        reader.onerror = () => {
          if (targetInput) {
            targetInput.dataset.imagePending = "false";
            targetInput.dataset.imageSource = "";
          }
          if (saveButton) saveButton.disabled = false;
          if (status) status.textContent = "Gambar gagal diproses.";
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function collectFormData(form) {
    const module = modules[state.active];
    const payload = state.editing ? clone(state.editing) : {};

    module.fields.forEach(([name, _label, type]) => {
      const field = form.elements[name];
      if (!field) return;
      if (type === "checkbox") {
        payload[name] = field.checked;
        return;
      }
      if (type === "number") {
        payload[name] = Number(field.value || 0);
        return;
      }
      if (type === "list") {
        payload[name] = field.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        return;
      }
      if (type === "tags") {
        payload[name] = field.value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        return;
      }
      payload[name] = field.value.trim();
    });

    if (state.active === "projects" && !payload.slug && payload.title) {
      payload.slug = payload.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    return payload;
  }

  async function saveRecord(payload) {
    const module = modules[state.active];
    if (module.single) payload.id = "main";
    if (!module.single && !payload.id) payload.id = crypto.randomUUID();

    if (state.demo || !state.client) {
      if (module.single) {
        state.data.profile = payload;
      } else {
        const rows = state.data[module.table] || [];
        const index = rows.findIndex((row) => row.id === payload.id);
        if (index >= 0) rows[index] = payload;
        else rows.unshift(payload);
        state.data[module.table] = rows;
      }
      saveDemoData();
      return { error: null };
    }

    const result = await state.client.from(module.table).upsert(payload);
    return { error: result.error };
  }

  async function deleteRecord(id) {
    const module = modules[state.active];
    if (state.demo || !state.client) {
      state.data[module.table] = (state.data[module.table] || []).filter((row) => row.id !== id);
      saveDemoData();
      return;
    }
    await state.client.from(module.table).delete().eq("id", id);
    await loadAllData();
  }

  function bindRecordList() {
    document.getElementById("record-list").addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (action === "profile-edit") {
        state.editing = clone(normalizeProfileData(state.data.profile || {}));
        state.profileEditMode = true;
        renderModule();
        return;
      }
      if (action === "profile-cancel") {
        state.profileEditMode = false;
        state.editing = null;
        renderModule();
        return;
      }
      if (action === "edit") {
        openDialog(findRecord(id));
        return;
      }
      if (action === "delete") {
        await deleteRecord(id);
        renderModule();
      }
    });
  }

  function bindDialog() {
    document.getElementById("add-button").addEventListener("click", () => openDialog(null));
    document.getElementById("record-form").addEventListener("submit", async (event) => {
      const submitter = event.submitter;
      if (submitter && submitter.value === "cancel") return;
      event.preventDefault();

      const pendingImage = event.currentTarget.querySelector('input[data-image-pending="true"]');
      const status = document.getElementById("form-status");
      if (pendingImage) {
        status.textContent = "Gambar sedang diproses. Tunggu sebentar...";
        return;
      }

      status.textContent = "Menyimpan...";
      const payload = collectFormData(event.currentTarget);
      const result = await saveRecord(payload);
      if (result.error) {
        status.textContent = result.error.message || "Data belum tersimpan.";
        return;
      }
      await loadAllData();
      document.getElementById("record-dialog").close();
      renderModule();
    });
  }

  function bindAuth() {
    state.recoveryEmails = getRecoveryEmails();
    const demoButton = document.getElementById("demo-button");
    if (demoButton) demoButton.hidden = true;

    document.getElementById("login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = document.getElementById("login-status");
      status.textContent = "Memeriksa akun...";
      const form = event.currentTarget;
      const email = document.getElementById("login-email")?.value.trim() || form.elements.email?.value?.trim() || "";
      const password = document.getElementById("login-password")?.value || form.elements.password?.value || "";
      if (email === localAdminEmail && password === localAdminPassword) {
        state.demo = false;
        state.loggedIn = true;
        localStorage.setItem(authStateKey, "true");
        await enterAdmin();
        return;
      }
      status.textContent = "Email atau password salah.";
    });

    const quickLoginButton = document.getElementById("quick-login-button");
    if (quickLoginButton) {
      quickLoginButton.remove();
    }

    document.getElementById("forgot-password-button").addEventListener("click", () => {
      document.getElementById("auth-panel").querySelector("#login-form").hidden = true;
      document.getElementById("password-recovery-panel").hidden = false;
      document.getElementById("recovery-status").textContent = "Masukkan email pemulihan yang terdaftar.";
    });

    document.getElementById("back-to-login-button").addEventListener("click", () => {
      document.getElementById("auth-panel").querySelector("#login-form").hidden = false;
      document.getElementById("password-recovery-panel").hidden = true;
      document.getElementById("recovery-status").textContent = "";
    });

    document.getElementById("request-reset-button").addEventListener("click", () => {
      const email = document.getElementById("recovery-request-email").value.trim().toLowerCase();
      const status = document.getElementById("recovery-status");
      if (!email) {
        status.textContent = "Isi email pemulihan terlebih dahulu.";
        return;
      }
      const isAllowed = state.recoveryEmails.some((item) => item.trim().toLowerCase() === email);
      if (!isAllowed) {
        status.textContent = "Email pemulihan tidak terdaftar.";
        return;
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      addRecoveryCode(email, code);
      state.pendingRecovery = email;
      status.textContent = `Kode verifikasi dikirim ke ${email} (demo: ${code}).`;
    });

    document.getElementById("confirm-reset-button").addEventListener("click", () => {
      const email = state.pendingRecovery || document.getElementById("recovery-request-email").value.trim().toLowerCase();
      const code = document.getElementById("reset-code-input").value.trim();
      const newPassword = document.getElementById("new-password-input").value;
      const status = document.getElementById("recovery-status");
      if (!email || !code || !newPassword) {
        status.textContent = "Isi email, kode verifikasi, dan password baru.";
        return;
      }
      if (!consumeRecoveryCode(email, code)) {
        status.textContent = "Kode verifikasi salah atau sudah kedaluwarsa.";
        return;
      }
      if (newPassword.length < 6) {
        status.textContent = "Password minimal 6 karakter.";
        return;
      }
      localAdminPassword = newPassword;
      status.textContent = "Password berhasil diubah.";
      document.getElementById("new-password-input").value = "";
      document.getElementById("reset-code-input").value = "";
      document.getElementById("recovery-request-email").value = email;
    });

    document.getElementById("logout-button").addEventListener("click", async () => {
      state.loggedIn = false;
      state.demo = false;
      localStorage.removeItem(authStateKey);
      document.getElementById("admin-panel").hidden = true;
      document.getElementById("auth-panel").hidden = false;
      document.getElementById("logout-button").hidden = true;
      document.getElementById("session-label").textContent = "Menunggu login";
    });
  }

  async function enterAdmin() {
    await loadAllData();
    document.getElementById("auth-panel").hidden = true;
    document.getElementById("admin-panel").hidden = false;
    document.getElementById("logout-button").hidden = false;
    document.getElementById("session-label").textContent = "Mode akun lokal aktif";
    renderModule();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function init() {
    buildNav();
    bindRecordList();
    bindDialog();
    bindAuth();
    state.client = await createClient();
    if (localStorage.getItem(authStateKey) === "true") {
      state.loggedIn = true;
      await enterAdmin();
      return;
    }
    if (state.client) {
      const session = await state.client.auth.getSession();
      if (session.data.session) {
        state.demo = false;
        await enterAdmin();
      }
    }
    document.getElementById("login-status").textContent = "Gunakan akun lokal untuk masuk.";
  }

  init();
})();
