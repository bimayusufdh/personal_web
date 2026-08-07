window.SUPABASE_CONFIG = {
  url: "https://ocxmucpjfdcpfartyxpf.supabase.co",
  anonKey: "sb_publishable_itcdyiF4dHce366JvaSZew_FWUyjOdx",
};

const supabasePreconnect = document.createElement("link");
supabasePreconnect.rel = "preconnect";
supabasePreconnect.href = "https://cdn.jsdelivr.net";
document.head.appendChild(supabasePreconnect);

const supabaseModulePreload = document.createElement("link");
supabaseModulePreload.rel = "modulepreload";
supabaseModulePreload.href = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
document.head.appendChild(supabaseModulePreload);

const supabaseApiPreconnect = document.createElement("link");
supabaseApiPreconnect.rel = "preconnect";
supabaseApiPreconnect.href = new URL(window.SUPABASE_CONFIG.url).origin;
document.head.appendChild(supabaseApiPreconnect);
