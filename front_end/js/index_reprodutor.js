const apiurl = "http://localhost:3000";

function initReprodutoresPage() {
  aplicarRestricoesAluno();
  const params = new URLSearchParams(window.location.search);
  const coelhoId = params.get('coelho_id') || params.get('id') || null; // prefer explicit coelho_id
  const fetchUrl = apiurl + '/reprodutor' + (coelhoId ? `?coelho_id=${coelhoId}` : '');
  fetch(fetchUrl)
    .then(res => {
      return res.text();
    })
    .then(text => {
      if (text) {
        return JSON.parse(text);
      } else {
        throw new Error('Resposta vazia do servidor');
      }
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        preencherTabela(data);
      } else {
        mostrarSemDados();
      }
    })
    .catch(err => {
      mostrarSemDados();
    });
}

function aplicarRestricoesAluno(){
  try{
    const raw = localStorage.getItem('usuario_atual');
    const user = raw ? JSON.parse(raw) : null;
    if (user && (user.tipoususario || '').toLowerCase() === 'aluno'){
      const addBtn = document.getElementById('btnAdicionar');
      if (addBtn) addBtn.style.display = 'none';
    }
  }catch(e){}
}

// ensure initialization runs whether DOMContentLoaded already fired or not
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReprodutoresPage);
} else {
  initReprodutoresPage();
}

function preencherTabela(reprodutores) {
  const tbody = document.getElementById('reprodutorTableBody');
  tbody.innerHTML = ''; 

  reprodutores.forEach(reprodutor => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${reprodutor.data_acasalamento ? new Date(reprodutor.data_acasalamento).toLocaleDateString('pt-BR') : '-'}</td>
      <td>${reprodutor.numero_laparos || '-'}</td>
      <td>${reprodutor.peso_total_ninhada || '-'}</td>
      <td>${reprodutor.peso_total_pos_ninhada || '-'}</td>
      <td>${reprodutor.numero_matriz || '-'}</td>
    `;
    // Construir URL com ambos os IDs: o do reprodutor (id_reprodutor) e o do coelho pai (coelho_id)
    const params = new URLSearchParams(window.location.search);
    const coelhoId = params.get('coelho_id') || params.get('id') || null;
    // Construir URL base com id do reprodutor
    let url = `ficha_reprodutor.html?id_reprodutor=${reprodutor.id_reprodutor}`;
    // Adicionar coelho_id se existir
    if (coelhoId) {
      url += `&coelho_id=${coelhoId}`;
    }
    selecionarLinha(tr, url);
    tbody.appendChild(tr);
  });
}

function mostrarSemDados() {
  const tbody = document.getElementById('reprodutorTableBody');
  tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum dado encontrado.</td></tr>`;
}

function selecionarLinha(tr, url) {
  tr.style.cursor = 'pointer';
  tr.addEventListener('click', () => {
    window.location.href = url;
  });
}

// handle Add button preserving the coelho id when present
{
  const params = new URLSearchParams(window.location.search);
  const coelhoId = params.get('coelho_id') || params.get('id') || null;
  const btn = document.getElementById('btnAdicionar');
  if (btn) {
    btn.addEventListener('click', () => {
      const target = 'adicionar_reprodutor.html' + (coelhoId ? `?coelho_id=${coelhoId}` : '');
      window.location.href = target;
    });
  }
}

function voltar() {
  const params = new URLSearchParams(window.location.search);
  const coelhoId = params.get('coelho_id') || params.get('id') || null;
  
  if (coelhoId) {
    // Se temos coelho_id, volta para a ficha do coelho
    window.location.href = `ficha.html?id=${coelhoId}`;
  } else {
    // Se não temos coelho_id, usa history.back()
    window.history.back();
  }
}