// --- SUPABASE CONFIG ---
// Corrija o import para uso em navegador
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://tvpuleqsmtpqwkxmdzsd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZnJqZnFhcmF4ZnVsd3FzZWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Mzg2ODUsImV4cCI6MjA3MzUxNDY4NX0.YPJ0zYeXU6UtacOCWJ2JM6NAUQIu0WwrN3B8aQiLMY0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMsg = document.getElementById("authMsg");
const authArea = document.getElementById("authArea");
const privateArea = document.getElementById("privateArea");
const usersTableBody = document.querySelector("#usersTable tbody");
const editFormContainer = document.getElementById("editFormContainer");
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");
const msgBox = document.getElementById("msg");
const logoutBtn = document.getElementById("logoutBtn");
const logoutBtn2 = document.getElementById("logoutBtn2");
const forgotBtn = document.getElementById("forgotBtn");
const welcomeArea = document.getElementById("welcomeArea");
const welcomeName = document.getElementById("welcomeName");
const welcomeLogout = document.getElementById("welcomeLogout");
const backToAuth = document.getElementById("backToAuth");

// --- Utility functions ---
function showAuthMsg(text = "", type = "") {
  if (!authMsg) return;
  authMsg.textContent = text;
  authMsg.className = type ? `msg ${type}` : "msg";
}

function showMsg(text = "", type = "") {
  if (!msgBox) return;
  msgBox.textContent = text;
  msgBox.className = type ? `msg ${type}` : "msg";
}

// --- Tab switching ---
function toggleTab(tab) {
  if (tab === "login") {
    tabLogin?.classList.add("active");
    tabRegister?.classList.remove("active");
    loginForm?.classList.remove("hidden");
    registerForm?.classList.add("hidden");
  } else {
    tabRegister?.classList.add("active");
    tabLogin?.classList.remove("active");
    registerForm?.classList.remove("hidden");
    loginForm?.classList.add("hidden");
  }
  showAuthMsg("");
}

// Adiciona listeners se os elementos existirem
tabLogin?.addEventListener("click", () => toggleTab("login"));
tabRegister?.addEventListener("click", () => toggleTab("register"));

// --- REGISTER ---
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthMsg("Cadastrando...", "");

  const name = document.getElementById("registerName")?.value.trim();
  const dob = document.getElementById("registerDob")?.value || null;
  const phone = document.getElementById("registerPhone")?.value.trim();
  const username = document.getElementById("registerUsername")?.value.trim().toLowerCase();
  const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("registerPassword")?.value;

  if (!name || !email || !password) {
    showAuthMsg("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  try {
    const { data: userData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, dob, phone, username } },
    });
    if (error) throw error;

    showAuthMsg("Cadastro realizado! Verifique seu e-mail.", "success");
    registerForm.reset();
    toggleTab("login");
  } catch (err) {
    console.error(err);
    showAuthMsg(err?.message || "Erro ao cadastrar", "error");
  }
});

// --- LOGIN ---
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthMsg("Entrando...", "");

  const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    showAuthMsg("Preencha todos os campos.", "error");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    showAuthMsg("Login realizado!", "success");
    loginForm.reset();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    let displayName = '';

    if (user) {
      displayName = user.user_metadata?.full_name || user.user_metadata?.nome || user.user_metadata?.username || user.email || '';

      try {
        const { data: profileRow, error: profileErr } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (!profileErr && profileRow?.full_name) {
          displayName = profileRow.full_name;
        }
      } catch (profileQueryErr) {
        console.warn("Erro ao buscar profile:", profileQueryErr);
      }
    }

    showWelcomeArea(displayName || 'Usuário');

  } catch (err) {
    console.error(err);
    showAuthMsg(err?.message || "Erro no login", "error");
  }
});

// --- LOGOUT ---
async function doLogout() {
  await supabase.auth.signOut();
  showAuthMsg("Você saiu.", "success");
  hideWelcomeArea();
}
logoutBtn?.addEventListener("click", doLogout);
logoutBtn2?.addEventListener("click", doLogout);
welcomeLogout?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  hideWelcomeArea();
});
backToAuth?.addEventListener("click", () => {
  hideWelcomeArea();
});

// --- ESQUECEU A SENHA ---
forgotBtn?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
  if (!email) {
    showMsg("Digite seu e-mail no campo acima para recuperar a senha.", "error");
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset.html'
    });

    if (error) {
      console.error("Erro resetPasswordForEmail:", error);
      showMsg("Erro ao enviar o e-mail de recuperação.", "error");
    } else {
      showMsg("E-mail de recuperação enviado! Verifique sua caixa de entrada.", "success");
    }
  } catch (err) {
    console.error(err);
    showMsg("Erro ao enviar o e-mail de recuperação.", "error");
  }
});

// --- PROFILE / TABLE ---
// igual ao seu código original

// --- EDIT FORM ---
// igual ao seu código original

// --- AUTH STATE CHANGE ---
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    authArea?.classList.add("hidden");
    privateArea?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");
    logoutBtn2?.classList.remove("hidden");
    await loadMyProfileAndRender(session.user.id, session.user.email);
    const nameFromMeta = session.user.user_metadata?.full_name || session.user.user_metadata?.nome || session.user.user_metadata?.username || session.user.email || 'Usuário';
    showWelcomeArea(nameFromMeta);
  } else {
    authArea?.classList.remove("hidden");
    privateArea?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
    logoutBtn2?.classList.add("hidden");
    usersTableBody && (usersTableBody.innerHTML = "");
    editFormContainer?.classList.add("hidden");
    hideWelcomeArea();
  }
});

// --- CHECK SESSION ON LOAD ---
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (session?.user) {
      authArea?.classList.add("hidden");
      privateArea?.classList.remove("hidden");
      await loadMyProfileAndRender(session.user.id, session.user.email);

      const nameFromMeta = session.user.user_metadata?.full_name || session.user.user_metadata?.nome || session.user.user_metadata?.username || session.user.email || 'Usuário';
      showWelcomeArea(nameFromMeta);
    } else {
      authArea?.classList.remove("hidden");
      privateArea?.classList.add("hidden");
    }
  } catch (err) {
    console.error("Erro ao checar sessão:", err);
  }
})();

// =========================
// Funções para mostrar/ocultar área de boas-vindas
// =========================
function showWelcomeArea(name) {
  const authAreaEl = document.getElementById('authArea');
  if (authAreaEl) authAreaEl.classList.add('hidden');

  if (welcomeArea) {
    welcomeName.textContent = name || 'Usuário';
    welcomeArea.classList.remove('hidden');
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = `Bem-vindo(a), ${name || 'Usuário'}`;
  }
}

function hideWelcomeArea() {
  const authAreaEl = document.getElementById('authArea');
  if (authAreaEl) authAreaEl.classList.remove('hidden');

  if (welcomeArea) {
    welcomeArea.classList.add('hidden');
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = 'Acessar conta';
  }
}
