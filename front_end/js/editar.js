const apiurl = "https://gerenciamento-coelho.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Nenhum ID de coelho fornecido.");
  window.history.back();
}

let fotoAtual = null; // Armazena a nova foto selecionada

window.onload = async () => {
  try {
    const res = await fetch(`${apiurl}/coelho/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar coelho");

    const data = await res.json();
    const coelho = Array.isArray(data) ? data[0] : data;

    // Preencher os campos
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

    // Carregar foto atual
    const previewFoto = document.getElementById("previewFoto");
    if (coelho.foto_coelho && previewFoto) {
      previewFoto.src = `${apiurl}/uploads/${coelho.foto_coelho}`;
    }

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do coelho.");
  }
};

// ===================== PREVIEW DA NOVA FOTO =====================
function previewFoto(event) {
  const file = event.target.files[0];
  if (file) {
    fotoAtual = file; // Guarda para enviar ao salvar
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewFoto').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function abrirFoto() {
  const modal = document.getElementById('modalFoto');
  const fotoGrande = document.getElementById('fotoGrande');
  fotoGrande.src = document.getElementById('previewFoto').src;
  modal.style.display = "flex";
}

function fecharFoto() {
  document.getElementById('modalFoto').style.display = "none";
}

// ===================== SALVAR =====================
async function salvaralteracao() {
  if (!confirm("Deseja salvar as alterações?")) return;

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

  // Envia foto apenas se o usuário selecionou uma nova
  if (fotoAtual) {
    formData.append("foto_coelho", fotoAtual);
  }

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      alert("✅ Alterações salvas com sucesso!");
      window.location.href = `ficha.html?id=${id}`;
    } else {
      alert("Erro ao salvar as alterações.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão ao salvar.");
  }
}

// ===================== DELETAR =====================
async function deletarcoelho() {
  if (!confirm("⚠️ Tem certeza que deseja excluir este coelho?")) {
    return;
  }

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("Coelho excluído com sucesso!");
      window.location.href = "index.html";
    } else {
      alert("Erro ao excluir coelho.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão.");
  }
}