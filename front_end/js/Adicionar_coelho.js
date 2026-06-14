function normalizarPeso(valor) {
  return valor.replace(',', '.');
}

function formatarPesoInput(e) {
  const input = e.target;
  const key = e.key;

  if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

  if (!/[0-9.,]/.test(key)) {
    e.preventDefault();
    return;
  }

  if ((key === '.' || key === ',') && /[.,]/.test(input.value)) {
    e.preventDefault();
    return;
  }

  if (key === '.') {
    e.preventDefault();
    const pos = input.selectionStart;
    input.value = input.value.slice(0, pos) + ',' + input.value.slice(pos);
    input.setSelectionRange(pos + 1, pos + 1);
  }
}

document.getElementById('peso_nascimento').addEventListener('keydown', formatarPesoInput);
document.getElementById('peso_atual').addEventListener('keydown', formatarPesoInput);
document.getElementById('peso_desmame').addEventListener('keydown', formatarPesoInput);

async function adicionarCoelho() {
  const id_usuario = localStorage.getItem("id_usuario");
  if (!id_usuario) {
    alert("Usuário não identificado.");
    return;
  }

  const codigo = document.getElementById('numero_coelho').value.trim().toUpperCase();

  const formData = new FormData();
  formData.append('numero_coelho', codigo);
  formData.append('nome_coelho', document.getElementById('nome_coelho').value);
  formData.append('raca_coelho', document.getElementById('raca_coelho').value);
  formData.append('data_nascimento_coelho', document.getElementById('data_nascimento_coelho').value);
  formData.append('peso_nascimento', normalizarPeso(document.getElementById('peso_nascimento').value));
  formData.append('peso_atual', normalizarPeso(document.getElementById('peso_atual').value));
  formData.append('peso_desmame', normalizarPeso(document.getElementById('peso_desmame').value));
  formData.append('data_desmame', document.getElementById('data_desmame').value);
  formData.append('sexo_coelho', document.getElementById('sexo_coelho').value);
  formData.append('tipo_coelho', document.getElementById('tipo_coelho').value);
  formData.append('situacao_coelho', document.getElementById('situacao_coelho').value);
  formData.append('matriz_coelho', document.getElementById('matriz_coelho').value);
  formData.append('reprodutor_coelho', document.getElementById('reprodutor_coelho').value);
  formData.append('observacoes_coelho', document.getElementById('observacoes_coelho').value);
  formData.append('id_usuario', id_usuario);

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