// --- SUPABASE CONFIG ---
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; // URL correta para o pacote
// NOTE: Se esta linha acima der erro 'import', use a URL do seu CDN.
// A URL que você usou antes ('https://tvpuleqsmtpqwkxmdzsd.supabase.co') é o endereço do seu projeto, não do SDK.

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
const privateArea = document.getElementById("privateArea"); // Elemento não existe no HTML, mas o JS lida
const usersTableBody = document.querySelector("#usersTable tbody"); // Elemento não existe no HTML, mas o JS lida
const editFormContainer = document.getElementById("editFormContainer");
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");
const msgBox = document.getElementById("msg");
const logoutBtn = document.getElementById("logoutBtn");
const logoutBtn2 = document.getElementById("logoutBtn2"); // Elemento não existe no HTML, mas o JS lida

// --- NOVOS ELEMENTOS (adicionados) ---
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
  authMsg.classList.remove('hidden'); // Certifica que a mensagem é mostrada
}

function showMsg(text = "", type = "") {
  if (!msgBox) return;
  msgBox.textContent = text;
  msgBox.className = type ? `msg ${type}` : "msg";
  msgBox.classList.remove('hidden'); // Certifica que a mensagem é mostrada
}

// --- Tab switching (ESTA É A PARTE QUE CORRIGE A VISUALIZAÇÃO) ---
function toggleTab(tab) {
  if (tab === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.remove("hidden"); // MOSTRA O LOGIN
    registerForm.classList.add("hidden"); // ESCONDE O CADASTRO
    document.getElementById("pageTitle").textContent = "Acessar conta";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.remove("hidden"); // MOSTRA O CADASTRO
    loginForm.classList.add("hidden"); // ESCONDE O LOGIN
    document.getElementById("pageTitle").textContent = "Criar conta";
  }
  showAuthMsg(""); // Limpa mensagem de erro/sucesso da aba anterior
}

tabLogin.addEventListener("click", () => toggleTab("login"));
tabRegister.addEventListener("click", () => toggleTab("register"));

// --- BOTÃO PARA IR À PÁGINA DE CADASTRO ---
const goToRegisterBtn = document.getElementById("goToRegisterBtn");
if (goToRegisterBtn) {
  goToRegisterBtn.addEventListener("click", () => toggleTab("register"));
}

// --- REGISTER ---
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthMsg("Cadastrando...", "");

  const name = document.getElementById("registerName").value.trim();
  const dob = document.getElementById("registerDob").value || null;
  const phone = document.getElementById("registerPhone").value.trim();
  const username = document.getElementById("registerUsername").value.trim().toLowerCase();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  try {
    const { data: userData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, dob, phone, username } },
    });
    if (error) throw error;

    showAuthMsg("Cadastro realizado! Verifique seu e-mail.", "success");
    registerForm.reset();
    toggleTab("login"); // Volta para a aba de Login
  } catch (err) {
    console.error(err);
    showAuthMsg(err?.message || "Erro ao cadastrar", "error");
  }
});

// --- LOGIN ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthMsg("Entrando...", "");

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    showAuthMsg("Login realizado!", "success");
    loginForm.reset();

    // Obter usuário atual e buscar nome
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

    // Exibir a área de boas-vindas
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
  // A função onAuthStateChange cuidará do resto
}
logoutBtn.addEventListener("click", doLogout);
if (logoutBtn2) logoutBtn2.addEventListener("click", doLogout);

// botão de logout da área de boas-vindas
if (welcomeLogout) {
  welcomeLogout.addEventListener("click", async () => {
    await supabase.auth.signOut();
    // A função onAuthStateChange cuidará do resto
  });
}

// botão "Voltar" (volta para a área de login/cadastro, mas não desloga)
if (backToAuth) {
  backToAuth.addEventListener("click", () => {
    hideWelcomeArea();
  });
}

// --- ESQUECEU A SENHA ---
if (forgotBtn) {
  forgotBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
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
}

// --- PROFILE / TABLE (manutenção) ---
async function loadMyProfileAndRender(userId, email) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, dob, phone, username")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    usersTableBody && (usersTableBody.innerHTML = "");

    const row = data || { id: userId, full_name: "(sem perfil)", dob: "", phone: "", username: "" };

    if (usersTableBody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.full_name || ""}</td>
        <td>${row.dob || ""}</td>
        <td>${email || ""}</td>
        <td>${row.phone || ""}</td>
        <td>${row.username || ""}</td>
        <td>
          <button class="btn edit-btn" data-id="${row.id}">Editar</button>
        </td>
      `;
      usersTableBody.appendChild(tr);

      const editBtn = tr.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => openEditForm(row, email));
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
    showMsg("Não foi possível carregar seu perfil.", "error");
  }
}

// --- EDIT FORM (manutenção) ---
function openEditForm(profile, email) {
  editFormContainer.classList.remove("hidden");
  document.getElementById("editId").value = profile.id || "";
  document.getElementById("editNome").value = profile.full_name || "";
  document.getElementById("editNascimento").value = profile.dob || "";
  document.getElementById("editEmail").value = email || "";
  document.getElementById("editTelefone").value = profile.phone || "";
  document.getElementById("editUsuario").value = profile.username || "";
}

cancelEdit.addEventListener("click", (e) => {
  e.preventDefault();
  editFormContainer.classList.add("hidden");
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMsg("Salvando...", "");

  const id = document.getElementById("editId").value;
  const full_name = document.getElementById("editNome").value.trim();
  const dob = document.getElementById("editNascimento").value || null;
  const email = document.getElementById("editEmail").value.trim().toLowerCase();
  const phone = document.getElementById("editTelefone").value.trim();
  const username = document.getElementById("editUsuario").value.trim().toLowerCase();

  try {
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ full_name, dob, phone, username })
      .eq("id", id);
    if (updateErr) throw updateErr;

    try {
      const { error: authErr } = await supabase.auth.updateUser({ email });
      if (authErr) console.warn("Não foi possível atualizar email:", authErr.message);
    } catch (e) {
      console.warn("updateUser falhou:", e);
    }

    showMsg("Perfil atualizado com sucesso!", "success");
    editFormContainer.classList.add("hidden");

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await loadMyProfileAndRender(session.user.id, session.user.email);
  } catch (err) {
    console.error(err);
    showMsg(err?.message || "Erro ao salvar perfil", "error");
  }
});

// --- AUTH STATE CHANGE (Gerencia login/logout) ---
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    authArea.classList.add("hidden");
    privateArea && privateArea.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    logoutBtn2 && logoutBtn2.classList.remove("hidden");
    await loadMyProfileAndRender(session.user.id, session.user.email);

    const nameFromMeta = session.user.user_metadata?.full_name || session.user.user_metadata?.nome || session.user.user_metadata?.username || session.user.email || 'Usuário';
    showWelcomeArea(nameFromMeta);
  } else {
    authArea.classList.remove("hidden");
    privateArea && privateArea.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    logoutBtn2 && logoutBtn2.classList.add("hidden");
    usersTableBody && (usersTableBody.innerHTML = "");
    editFormContainer.classList.add("hidden");
    hideWelcomeArea();
    toggleTab("login");
  }
});

// --- CHECK SESSION ON LOAD ---
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (session?.user) {
      authArea.classList.add("hidden");
      privateArea && privateArea.classList.remove("hidden");
      await loadMyProfileAndRender(session.user.id, session.user.email);

      const nameFromMeta = session.user.user_metadata?.full_name || session.user.user_metadata?.nome || session.user.user_metadata?.username || session.user.email || 'Usuário';
      showWelcomeArea(nameFromMeta);
    } else {
      authArea.classList.remove("hidden");
      privateArea && privateArea.classList.add("hidden");
      toggleTab("login");
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
