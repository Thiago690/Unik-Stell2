// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Elementos principais
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const msg = document.getElementById("msg");
  const authMsg = document.getElementById("authMsg");
  const welcomeArea = document.getElementById("welcomeArea");
  const welcomeName = document.getElementById("welcomeName");
  const welcomeLogout = document.getElementById("welcomeLogout");
  const backToAuth = document.getElementById("backToAuth");
  const logoutBtn = document.getElementById("logoutBtn");
  const editFormContainer = document.getElementById("editFormContainer");
  const editForm = document.getElementById("editForm");
  const cancelEdit = document.getElementById("cancelEdit");
  const forgotBtn = document.getElementById("forgotBtn");

  // Utilitário: mostrar mensagem
  function showMessage(el, text, type = "info") {
    el.textContent = text;
    el.className = `msg ${type}`;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 4000);
  }

  // Alternar abas Login / Cadastro
  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // ------------------ CADASTRO ------------------
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
      nome: document.getElementById("registerName").value.trim(),
      nascimento: document.getElementById("registerDob").value,
      email: document.getElementById("registerEmail").value.trim().toLowerCase(),
      telefone: document.getElementById("registerPhone").value.trim(),
      usuario: document.getElementById("registerUsername").value.trim(),
      senha: document.getElementById("registerPassword").value,
    };

    if (user.senha.length < 6)
      return showMessage(authMsg, "A senha deve ter no mínimo 6 caracteres.", "error");

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (usuarios.some(u => u.email === user.email))
      return showMessage(authMsg, "E-mail já cadastrado.", "error");

    usuarios.push(user);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    showMessage(authMsg, "Cadastro realizado com sucesso!", "success");
    registerForm.reset();

    // Volta automaticamente para a aba de login
    tabLogin.click();
  });

  // ------------------ LOGIN ------------------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const senha = document.getElementById("loginPassword").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) return showMessage(authMsg, "E-mail ou senha incorretos.", "error");

    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    mostrarBemVindo(user);
  });

  // ------------------ ESQUECEU A SENHA ------------------
  forgotBtn.addEventListener("click", () => {
    const email = prompt("Digite seu e-mail cadastrado:");
    if (!email) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const idx = usuarios.findIndex(u => u.email === email.trim().toLowerCase());

    if (idx === -1) {
      alert("E-mail não encontrado!");
      return;
    }

    const novaSenha = prompt("Digite sua nova senha (mínimo 6 caracteres):");
    if (!novaSenha || novaSenha.length < 6) {
      alert("Senha inválida. Operação cancelada.");
      return;
    }

    usuarios[idx].senha = novaSenha;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Senha atualizada com sucesso! Faça login novamente.");
  });

  // ------------------ ÁREA LOGADA ------------------
  function mostrarBemVindo(user) {
    welcomeArea.classList.remove("hidden");
    welcomeName.textContent = `${user.nome} (${user.usuario})`;
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    tabLogin.classList.add("hidden");
    tabRegister.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  }

  // Carregar se já estiver logado
  const userLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (userLogado) mostrarBemVindo(userLogado);

  // Logout
  function logout() {
    localStorage.removeItem("usuarioLogado");
    location.reload();
  }
  logoutBtn.addEventListener("click", logout);
  welcomeLogout.addEventListener("click", logout);
  backToAuth.addEventListener("click", logout);

  // ------------------ EDITAR DADOS ------------------
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const idx = usuarios.findIndex(u => u.email === document.getElementById("editEmail").value);

    if (idx > -1) {
      usuarios[idx].nome = document.getElementById("editNome").value;
      usuarios[idx].nascimento = document.getElementById("editNascimento").value;
      usuarios[idx].telefone = document.getElementById("editTelefone").value;
      usuarios[idx].usuario = document.getElementById("editUsuario").value;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      showMessage(msg, "Cadastro atualizado!", "success");
    }
    editFormContainer.classList.add("hidden");
  });

  cancelEdit.addEventListener("click", () => {
    editFormContainer.classList.add("hidden");
  });

  // ------------------ BOTÕES DO CABEÇALHO ------------------
  document.querySelectorAll("nav.main-menu a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const destino = link.getAttribute("href");
      if (destino && destino !== "#") window.location.href = destino;
    });
  });
});

