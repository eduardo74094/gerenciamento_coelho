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

  } catch (err) {
    alert("Erro ao carregar dados do coelho.");
  }
};

async function salvaralteracao() {
  const coelhoAtualizado = {
    numero_coelho: document.getElementById("numero_coelho").value,
    raca_coelho: document.getElementById("raca_coelho").value,
    data_nascimento_coelho: document.getElementById("data_nascimento_coelho").value,
    peso_nascimento: document.getElementById("peso_nascimento").value,
    data_desmame: document.getElementById("data_desmame").value,
    peso_desmame: document.getElementById("peso_desmame").value || null,
    peso_atual: document.getElementById("peso_atual").value,
    nome_coelho: document.getElementById("nome_coelho").value,
    sexo_coelho: document.getElementById("sexo_coelho").value,
    tipo_coelho: document.getElementById("tipo_coelho").value,
    matriz_coelho: document.getElementById("matriz_coelho").value,
    reprodutor_coelho: document.getElementById("reprodutor_coelho").value,
  observacoes_coelho: document.getElementById("observacoes_coelho").value,
  situacao_coelho: document.getElementById("situacao_coelho").value,
  transferido_coelho: document.getElementById("transferido_coelho").value || null,
  };

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coelhoAtualizado)
    });

    if (!res.ok) throw new Error('Erro ao salvar alterações: ' + res.status);

    alert('Alterações salvas com sucesso!');

    window.location.href = `ficha.html?id=${id}`;
    
  } catch (err) {
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
