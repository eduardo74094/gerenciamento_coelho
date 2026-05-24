const apiurl = "https://gerenciamento-coelho.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Nenhum ID de coelho fornecido.");
  window.history.back();
}

console.log(`🔍 Tentando carregar coelho ID: ${id}`);

window.onload = async () => {
  console.log("📄 Iniciando carregamento da ficha...");

  try {
    const res = await fetch(`${apiurl}/coelho/${id}`);
    
    console.log(`📡 Status da resposta /coelho/${id}: ${res.status}`);

    if (!res.ok) {
      if (res.status === 404) {
        alert(`❌ Coelho com ID ${id} não encontrado.`);
      } else {
        alert(`Erro ao buscar coelho: ${res.status}`);
      }
      throw new Error(`Erro ${res.status}`);
    }

    const data = await res.json();
    const coelho = Array.isArray(data) ? data[0] : data;

    console.log("✅ Coelho encontrado:", coelho);

    // Preencher os campos...
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

    if (coelho.foto_coelho) {
      const fotoUrl = `${apiurl}/uploads/${coelho.foto_coelho}`;
      console.log("🖼 Tentando carregar foto:", fotoUrl);
      document.getElementById("previewFoto").src = fotoUrl;
    }

  } catch (err) {
    console.error("❌ Erro geral:", err);
  }
};