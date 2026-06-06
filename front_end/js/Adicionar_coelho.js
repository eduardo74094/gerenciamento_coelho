async function adicionarCoelho() {
  const id_usuario = localStorage.getItem("id_usuario");
  if (!id_usuario) {
    alert("Usuário não identificado.");
    return;
  }

  const codigo = document.getElementById('numero_coelho').value.trim().toUpperCase();

  if (!codigo.startsWith("BLG-")) {
    alert("Código deve começar com BLG-");
    return;
  }

  const formData = new FormData();
  formData.append('numero_coelho', codigo);
  formData.append('nome_coelho', document.getElementById('nome_coelho').value);
  formData.append('raca_coelho', document.getElementById('raca_coelho').value);
  formData.append('data_nascimento_coelho', document.getElementById('data_nascimento_coelho').value);
  formData.append('peso_nascimento', document.getElementById('peso_nascimento').value);
  formData.append('peso_atual', document.getElementById('peso_atual').value);
  formData.append('data_desmame', document.getElementById('data_desmame').value);
  formData.append('peso_desmame', document.getElementById('peso_desmame').value);
  formData.append('sexo_coelho', document.getElementById('sexo_coelho').value);
  formData.append('tipo_coelho', document.getElementById('tipo_coelho').value);
  formData.append('situacao_coelho', document.getElementById('situacao_coelho').value);
  formData.append('matriz_coelho', document.getElementById('matriz_coelho').value);
  formData.append('reprodutor_coelho', document.getElementById('reprodutor_coelho').value);
  formData.append('observacoes_coelho', document.getElementById('observacoes_coelho').value);
  formData.append('id_usuario', id_usuario);

  // Foto
  const foto = document.getElementById('foto_coelho');
  if (foto.files.length > 0) {
    formData.append('foto_coelho', foto.files[0]);
  }

  try {
    console.log("Enviando código:", codigo);

    const res = await fetch('/coelho', {
      method: 'POST',
      body: formData
    });

    console.log("Status:", res.status);

    if (res.ok) {
      alert("✅ Salvo com sucesso!");
      window.location.href = 'index.html';
    } else {
      const texto = await res.text();
      console.error("Erro:", texto);
      alert("Erro ao salvar: " + texto);
    }
  } catch (e) {
    console.error(e);
    alert("Erro de conexão");
  }
}