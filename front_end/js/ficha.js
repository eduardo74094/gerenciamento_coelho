const apiurl = "https://gerenciamento-coelho.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Nenhum ID de coelho fornecido.");
  window.history.back();
  throw new Error("ID não encontrado"); // para parar execução
}

window.onload = async () => {
  aplicarRestricoesAluno();

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

  
    const previewFoto = document.getElementById("previewFoto");
    if (coelho.foto_coelho && previewFoto) {
      previewFoto.src = `${apiurl}/uploads/${coelho.foto_coelho}`;
    }

    esconderbotaolaparo();

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do coelho.");
  }
};


function aplicarRestricoesAluno() {
  try {
    const raw = localStorage.getItem('usuario_atual');
    const user = raw ? JSON.parse(raw) : null;

    if (user && (user.tipoususario || '').toLowerCase() === 'aluno') {
      const btnEditar = document.querySelector('.buttons button[onclick^="clicarbotao2"]');
      if (btnEditar) btnEditar.style.display = 'none';
    }
  } catch (e) {
    console.error("Erro ao aplicar restrições de aluno:", e);
  }
}


function esconderbotaolaparo() {
  const tipo = document.getElementById("tipo_coelho")?.value || '';
  const normalizado = tipo
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

  const botao = document.getElementById('botaocruzas');
  if (botao && (normalizado === 'laparo' || normalizado === 'em crescimento')) {
    botao.style.display = 'none';
  }
}