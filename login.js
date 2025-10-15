import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://tvpuleqsmtpqwkxmdzsd.supabase.co";  
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cHVsZXFzbXRwcXdreG1kenNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Mzc3MzYsImV4cCI6MjA3NDIxMzczNn0.FOQRXzykxjB7_89RUknTCj4G8K6bdQX1wypL7xwlPwg";             
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 💡 CORREÇÃO 1 & 2: Encapsula todo o código dentro de DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
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
   } catch (err) { // Adicionando a captura do erro para ser mais explícito
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
   } catch (err) { // Adicionando a captura do erro para ser mais explícito
     showMsg("Erro inesperado no login.", "error");
   }
 });

 // ===== ESTADO DE AUTENTICAÇÃO =====
 supabase.auth.onAuthStateChange((_event, session) => {
   if (session?.user) {
     privateArea?.classList.remove('hidden');

     // 💡 CORREÇÃO 3: Acesso robusto ao nome de usuário
     const userName = session.user.user_metadata?.full_name || session.user.email;
     if (welcomeUser) {
       welcomeUser.textContent = `Bem-vindo(a), ${userName}!`;
     }
   } else {
     privateArea?.classList.add('hidden');
   }
 });

 // ===== LOGOUT =====
 logoutBtn?.addEventListener('click', async () => {
   await supabase.auth.signOut();
   showMsg("Você saiu da conta.", "success");
 });
}); // <--- Fechamento da função DOMContentLoaded