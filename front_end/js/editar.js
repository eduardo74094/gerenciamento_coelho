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
    if (!res.ok) throw new Error("Erro ao buscar coelho: " + res.status);

    const data = await res.json();
  const coelho = Array.isArray(data) ? data[0] : data;

    
    document.getElementById("numero_coelho").value = coelho.numero_coelho || "";
    document.getElementById("raca_coelho").value = coelho.raca_coelho || "";
    document.getElementById("data_nascimento_coelho").value = coelho.data_nascimento_coelho?.slice(0, 10) || "";
    document.getElementById("peso_nascimento").value = coelho.peso_nascimento || "";
    document.getElementById("data_desmame").value = coelho.data_desmame?.slice(0, 10) || "";
  document.getElementById("peso_desmame").value =
  coelho.peso_desmame || "";

    document.getElementById("peso_atual").value = coelho.peso_atual || "";
    document.getElementById("nome_coelho").value = coelho.nome_coelho || "";
    document.getElementById("sexo_coelho").value = coelho.sexo_coelho || "";
    document.getElementById("tipo_coelho").value = coelho.tipo_coelho || "";
  document.getElementById("situacao_coelho").value = coelho.situacao_coelho || coelho.situacao || "ativo";
  document.getElementById("transferido_coelho").value = coelho.transferido_coelho || "";
    document.getElementById("matriz_coelho").value = coelho.matriz_coelho || "";
    document.getElementById("reprodutor_coelho").value = coelho.reprodutor_coelho || "";
    document.getElementById("observacoes_coelho").value = coelho.observacoes_coelho || "";
if (coelho.foto_coelho) {

  document.getElementById("fotoPreview").src =
    `${apiurl}/${coelho.foto_coelho}`;
}
  } catch (err) {
    alert("Erro ao carregar dados do coelho.");
  }
};

async function salvaralteracao() {

  const formData = new FormData();

  formData.append(
    "numero_coelho",
    document.getElementById("numero_coelho").value
  );

  formData.append(
    "raca_coelho",
    document.getElementById("raca_coelho").value
  );

  formData.append(
    "data_nascimento_coelho",
    document.getElementById("data_nascimento_coelho").value
  );

  formData.append(
    "peso_nascimento",
    document.getElementById("peso_nascimento").value
  );

  formData.append(
    "data_desmame",
    document.getElementById("data_desmame").value
  );

  formData.append(
    "peso_desmame",
    document.getElementById("peso_desmame").value || null
  );

  formData.append(
    "peso_atual",
    document.getElementById("peso_atual").value
  );

  formData.append(
    "nome_coelho",
    document.getElementById("nome_coelho").value
  );

  formData.append(
    "sexo_coelho",
    document.getElementById("sexo_coelho").value
  );

  formData.append(
    "tipo_coelho",
    document.getElementById("tipo_coelho").value
  );

  formData.append(
    "matriz_coelho",
    document.getElementById("matriz_coelho").value
  );

  formData.append(
    "reprodutor_coelho",
    document.getElementById("reprodutor_coelho").value
  );

  formData.append(
    "observacoes_coelho",
    document.getElementById("observacoes_coelho").value
  );

  formData.append(
    "situacao_coelho",
    document.getElementById("situacao_coelho").value
  );

  formData.append(
    "transferido_coelho",
    document.getElementById("transferido_coelho").value || null
  );

  const foto =
    document.getElementById("foto_coelho").files[0];

  if (foto) {

    formData.append("foto_coelho", foto);
  }

  try {

    const res = await fetch(
      `${apiurl}/coelho/${id}`,
      {
        method: 'PATCH',
        body: formData
      }
    );

    if (!res.ok) {

      throw new Error(
        'Erro ao salvar alterações: ' + res.status
      );
    }

    alert('Alterações salvas com sucesso!');

    window.location.href =
      `ficha.html?id=${id}`;

  } catch (err) {

    console.error(err);

    alert('Falha ao salvar alterações.');
  }
}

  


async function deletarcoelho() {
  if (!confirm("Deseja realmente excluir esta ficha?")) return;

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, {
      method: "DELETE"
    });

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
function previewFoto(event) {
  const input = event.target;

  if (input.files && input.files[0]) {

    const reader = new FileReader();

    reader.onload = function(e) {

      document.getElementById("fotoPreview").src =
        e.target.result;

    };

    reader.readAsDataURL(input.files[0]);
  }
}

function abrirFoto() {

  const foto =
    document.getElementById("fotoPreview").src;

  document.getElementById("fotoGrande").src = foto;

  document.getElementById("modalFoto").style.display =
    "flex";
}

function fecharFoto() {

  document.getElementById("modalFoto").style.display =
    "none";
}