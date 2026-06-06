async function adicionarCoelho() {
  const id_usuario = localStorage.getItem("id_usuario");

  if (!id_usuario) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

 
  let codigo = document.getElementById('numero_coelho').value.trim();

  if (!codigo) {
    alert("O campo Código é obrigatório!");
    document.getElementById('numero_coelho').focus();
    return;
  }

 
  codigo = codigo.toUpperCase();


  const regex = /^BLG-\d{4}-[MF]-\d{3}$/;
  if (!regex.test(codigo)) {
    alert("❌ Código inválido!\n\nUse o formato correto:\nBLG-AAAA-L-NNN\n\nExemplo: BLG-2026-M-001");
    document.getElementById('numero_coelho').focus();
    return;
  }
 

  const formData = new FormData();

  formData.append('numero_coelho', codigo); 
  formData.append('raca_coelho', document.getElementById('raca_coelho').value.trim());
  formData.append('data_nascimento_coelho', document.getElementById('data_nascimento_coelho').value);
  formData.append('peso_nascimento', document.getElementById('peso_nascimento').value);
  formData.append('peso_atual', document.getElementById('peso_atual').value);
  formData.append('data_desmame', document.getElementById('data_desmame').value);
  formData.append('peso_desmame', document.getElementById('peso_desmame').value);
  formData.append('nome_coelho', document.getElementById('nome_coelho').value.trim());
  formData.append('sexo_coelho', document.getElementById('sexo_coelho').value);
  formData.append('tipo_coelho', document.getElementById('tipo_coelho').value);
  formData.append('situacao_coelho', document.getElementById('situacao_coelho').value);
  
  const transferido = document.getElementById('transferido_coelho').value;
  formData.append('transferido_coelho', transferido || null);

  formData.append('matriz_coelho', document.getElementById('matriz_coelho').value.trim());
  formData.append('reprodutor_coelho', document.getElementById('reprodutor_coelho').value.trim());
  formData.append('observacoes_coelho', document.getElementById('observacoes_coelho').value.trim());
  formData.append('id_usuario', id_usuario);

  
  const fotoInput = document.getElementById('foto_coelho');
  if (fotoInput && fotoInput.files.length > 0) {
    formData.append('foto_coelho', fotoInput.files[0]);
  }

  try {
    const res = await fetch('/coelho', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('✅ Coelho adicionado com sucesso!');
      window.location.href = 'index.html';
    } else {
      const erro = await res.text();
      console.error(erro);
      alert('Erro ao adicionar coelho: ' + erro);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor.');
  }
}