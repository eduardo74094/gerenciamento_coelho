const apiurl = "https://gerenciamento-coelho.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Nenhum ID de coelho fornecido.");
  window.history.back();
}

window.onload = async () => {
  try {
    const res = await fetch(`${apiurl}/coelho/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar coelho");

    const data = await res.json();
    const coelho = Array.isArray(data) ? data[0] : data;

    // Preenche os campos
    document.getElementById("numero_coelho").value = coelho.numero_coelho || "";
    document.getElementById("raca_coelho").value = coelho.raca_coelho || "";
    document.getElementById("data_nascimento_coelho").value = coelho.data_nascimento_coelho?.slice(0, 10) || "";
    document.getElementById("peso_nascimento").value = coelho.peso_nascimento || "";
    document.getElementById("data_desmame").value = coelho.data_desmame?.slice(0, 10) || "";
    document.getElementById("peso_desmame").value = coelho.peso_desmame || "";
    document.getElementById("peso_atual").value = coelho.peso_atual || "";
    document.getElementById("nome_coelho").value = coelho.nome_coelho || "";
    document.getElementById("sexo_coelho").value = coelho.sexo_coelho || "";
    document.getElementById("tipo_coelho").value = coelho.tipo_coelho || "";
    document.getElementById("situacao_coelho").value = coelho.situacao_coelho || coelho.situacao || "ativo";
    document.getElementById("transferido_coelho").value = coelho.transferido_coelho || "";
    document.getElementById("matriz_coelho").value = coelho.matriz_coelho || "";
    document.getElementById("reprodutor_coelho").value = coelho.reprodutor_coelho || "";
    document.getElementById("observacoes_coelho").value = coelho.observacoes_coelho || "";

    // Carrega foto existente
    if (coelho.foto_coelho) {
      const fotoUrl = coelho.foto_coelho.startsWith('http') 
        ? coelho.foto_coelho 
        : `${apiurl}/uploads/${coelho.foto_coelho}`;
      
      document.getElementById("previewFoto").src = fotoUrl;
    }

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do coelho.");
  }
};

// ====================== SALVAR ======================
async function salvaralteracao() {
  const formData = new FormData();

  formData.append("numero_coelho", document.getElementById("numero_coelho").value);
  formData.append("raca_coelho", document.getElementById("raca_coelho").value);
  formData.append("data_nascimento_coelho", document.getElementById("data_nascimento_coelho").value);
  formData.append("peso_nascimento", document.getElementById("peso_nascimento").value);
  formData.append("data_desmame", document.getElementById("data_desmame").value);
  formData.append("peso_desmame", document.getElementById("peso_desmame").value);
  formData.append("peso_atual", document.getElementById("peso_atual").value);
  formData.append("nome_coelho", document.getElementById("nome_coelho").value);
  formData.append("sexo_coelho", document.getElementById("sexo_coelho").value);
  formData.append("tipo_coelho", document.getElementById("tipo_coelho").value);
  formData.append("situacao_coelho", document.getElementById("situacao_coelho").value);
  formData.append("transferido_coelho", document.getElementById("transferido_coelho").value);
  formData.append("matriz_coelho", document.getElementById("matriz_coelho").value);
  formData.append("reprodutor_coelho", document.getElementById("reprodutor_coelho").value);
  formData.append("observacoes_coelho", document.getElementById("observacoes_coelho").value);

  // Adiciona nova foto se selecionada
  const fotoInput = document.getElementById("foto_coelho");
  if (fotoInput.files.length > 0) {
    formData.append("foto_coelho", fotoInput.files[0]);
  }

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, {
      method: 'PATCH',
      body: formData
    });

    if (res.ok) {
      alert('Alterações salvas com sucesso!');
      window.location.href = `ficha.html?id=${id}`;
    } else {
      alert('Erro ao salvar alterações.');
    }
  } catch (err) {
    console.error(err);
    alert('Falha ao conectar com o servidor.');
  }
}

// ====================== DELETAR ======================
async function deletarcoelho() {
  if (!confirm("Deseja realmente excluir esta ficha?")) return;

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Coelho deletado com sucesso!");
      window.location.href = 'index.html';
    } else {
      alert("Erro ao deletar coelho.");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
  }
}

// ====================== FUNÇÕES DA FOTO ======================
function previewFoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("previewFoto").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function abrirFoto() {
  const modal = document.getElementById("modalFoto");
  const fotoGrande = document.getElementById("fotoGrande");
  const preview = document.getElementById("previewFoto");
  
  fotoGrande.src = preview.src;
  modal.style.display = "flex";
}

function fecharFoto() {
  document.getElementById("modalFoto").style.display = "none";
}