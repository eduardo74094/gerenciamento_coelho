function showToast(mensagem, tipo = "sucesso") {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.className = "toast show" + (tipo === "erro" ? " error" : "");
  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}

async function loginUsuario() {
  const form = document.getElementById("loginForm");
  const email = form.email.value.trim();
  const senha = form.senha.value;

  if (!email || !senha) {
    showToast("Preencha todos os campos.", "erro");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
      const data = await response.json();

      try { localStorage.setItem("usuario_atual", JSON.stringify(data.usuario || {})); } catch(e) {}
      localStorage.setItem("id_usuario", data.usuario.id_usuario);

      showToast(data.mensagem, "sucesso");

      const emailLower = (data.usuario.email || '').toLowerCase();
      setTimeout(() => {
        if (emailLower === 'admin@gmail.com') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/html/index.html';
        }
      }, 1000);
    } else {
      showToast("Email ou senha inválidos.", "erro");
    }

  } catch (error) {
    showToast("Erro na requisição. Tente novamente.", "erro");
  }
}