async function adicionarCoelho() {
  const id_usuario = localStorage.getItem("id_usuario");

  if (!id_usuario) {
    alert("Usuário não identificado.");
    return;
  }

  let codigo = document.getElementById('numero_coelho').value.trim().toUpperCase();

  console.log("🔍 Código digitado:", codigo);

  if (!codigo) {
    alert("Código é obrigatório!");
    return;
  }

  const regex = /^BLG-\d{4}-[MF]-\d{3}$/;
  if (!regex.test(codigo)) {
    alert("Código inválido! Use: BLG-2026-M-001");
    return;
  }

  const formData = new FormData();
  formData.append('numero_coelho', codigo);
  formData.append('raca_coelho', document.getElementById('raca_coelho').value);
  formData.append('data_nascimento_coelho', document.getElementById('data_nascimento_coelho').value);
  formData.append('peso_nascimento', document.getElementById('peso_nascimento').value);
  formData.append('peso_atual', document.getElementById('peso_atual').value);
  formData.append('data_desmame', document.getElementById('data_desmame').value);
  formData.append('peso_desmame', document.getElementById('peso_desmame').value);
  formData.append('nome_coelho', document.getElementById('nome_coelho').value);
  formData.append('sexo_coelho', document.getElementById('sexo_coelho').value);
  formData.append('tipo_coelho', document.getElementById('tipo_coelho').value);
  formData.append('situacao_coelho', document.getElementById('situacao_coelho').value);
  formData.append('transferido_coelho', document.getElementById('transferido_coelho').value || null);
  formData.append('matriz_coelho', document.getElementById('matriz_coelho').value);
  formData.append('reprodutor_coelho', document.getElementById('reprodutor_coelho').value);
  formData.append('observacoes_coelho', document.getElementById('observacoes_coelho').value);
  formData.append('id_usuario', id_usuario);

  const fotoInput = document.getElementById('foto_coelho');
  if (fotoInput && fotoInput.files.length > 0) {
    formData.append('foto_coelho', fotoInput.files[0]);
  }

  try {
    console.log("🚀 Enviando FormData...");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const res = await fetch('/coelho', {
      method: 'POST',
      body: formData
    });

    console.log("Status da resposta:", res.status);

    if (res.ok) {
      alert('✅ Coelho adicionado com sucesso!');
      window.location.href = 'index.html';
    } else {
      const erroTexto = await res.text();
      console.error("❌ Erro do servidor:", erroTexto);
      alert('Erro ao salvar: ' + erroTexto);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    alert('Erro de conexão com o servidor.');
  }
}