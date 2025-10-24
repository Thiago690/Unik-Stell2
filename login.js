import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {
  
  
  // ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://xxxxxxxxxxxxxxxxxxxx.supabase.co";   // troque
const SUPABASE_ANON_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx um  código bem grande vai aqui xxxxxxxx";             // troque
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ===== ELEMENTOS =====
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.pane');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authMsg = document.getElementById('authMsg');
  const privateArea = document.getElementById('privateArea');
  const welcomeUser = document.getElementById('welcomeUser');
  const logoutBtn = document.getElementById('logoutBtn');
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  const showMsg = (text, type = "success") => {
    if (!authMsg) return;
    authMsg.textContent = text;
    authMsg.className = `msg ${type}`;
  };
  const clearMsg = () => showMsg("");

  // ===== TROCA DE ABAS =====
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  // ===== LOGIN COM GOOGLE =====
  googleLoginBtn?.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) showMsg("Erro ao entrar com Google: " + error.message, "error");
  });

  // ===== CADASTRO =====
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const nome = document.getElementById('regNome').value.trim();
    const dataNascimento = document.getElementById('regNascimento').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const telefone = document.getElementById('regTelefone').value.trim();
    const usuario = document.getElementById('regUsuario').value.trim().toLowerCase();
    const senha = document.getElementById('regSenha').value;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { full_name: nome, dob: dataNascimento, phone: telefone, username: usuario }
        }
      });

      if (error) return showMsg("Erro ao cadastrar: " + error.message, "error");

      showMsg("Conta criada! Verifique seu e-mail.", "success");
      registerForm.reset();
      document.querySelector('.tab[data-tab="login-pane"]').click();
    } catch {
      showMsg("Erro inesperado ao cadastrar.", "error");
    }
  });

  // ===== LOGIN =====
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const userOrEmail = document.getElementById('loginUser').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userOrEmail,
        password: pass
      });

      if (error) return showMsg("Erro ao entrar: " + error.message, "error");

      showMsg("Login realizado com sucesso!", "success");
      loginForm.reset();
    } catch {
      showMsg("Erro inesperado no login.", "error");
    }
  });

  // ===== ESTADO DE AUTENTICAÇÃO =====
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      privateArea.classList.remove('hidden');
      welcomeUser.textContent = `Bem-vindo, ${session.user.user_metadata?.full_name || session.user.email}!`;
    } else {
      privateArea.classList.add('hidden');
    }
  });

  // ===== LOGOUT =====
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showMsg("Você saiu da conta.", "success");
  });
});
