async function adicionarCoelho() {
  const id_usuario = localStorage.getItem("id_usuario");

  if (!id_usuario) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }
  const novoCoelho = {
    numero_coelho: document.getElementById('numero_coelho').value,
    raca_coelho: document.getElementById('raca_coelho').value,
    data_nascimento_coelho: document.getElementById('data_nascimento_coelho').value,
    peso_nascimento: document.getElementById('peso_nascimento').value,
    peso_atual: document.getElementById('peso_atual').value,
    data_desmame: document.getElementById('data_desmame').value,
    peso_desmame: document.getElementById('peso_desmame').value,
    nome_coelho: document.getElementById('nome_coelho').value,
    sexo_coelho: document.getElementById('sexo_coelho').value,
    tipo_coelho: document.getElementById('tipo_coelho').value,
  situacao_coelho: document.getElementById('situacao_coelho').value,
  transferido_coelho: document.getElementById('transferido_coelho').value || null,
    matriz_coelho: document.getElementById('matriz_coelho').value,
    reprodutor_coelho: document.getElementById('reprodutor_coelho').value,
    observacoes_coelho: document.getElementById('observacoes_coelho').value,
    id_usuario: parseInt(id_usuario)

  };

  try {
    const res = await fetch('/coelho', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoCoelho)
    });

    if (res.ok) {
      alert('Coelho adicionado com sucesso!');
      window.location.href = 'index.html';
    } else {
      alert('Erro ao adicionar coelho.');
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
  }
}
