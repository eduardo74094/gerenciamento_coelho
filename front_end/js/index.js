let todosOsCoelhos = [];
const apiurl = "http://localhost:3000";

function normalizeStr(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function clicarbotao() {
  window.location.href = 'Adicionar_coelho.html';
}

async function fazerLogout() {
  try {
    await fetch(apiurl + '/logout', { method: 'POST' });
  } catch(e) {}
  localStorage.removeItem('usuario_atual');
  localStorage.removeItem('id_usuario');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarRestricoesAluno();
  carregarNomeUsuario();
  fetch(apiurl + '/coelhos')
    .then(res => res.json())
    .then(data => {
      todosOsCoelhos = data;
      aplicarFiltros();
    })
    .catch(() => {});

  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const statusFilter = document.getElementById('statusFilter');

  if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
  if (typeFilter) typeFilter.addEventListener('change', aplicarFiltros);
  if (statusFilter) statusFilter.addEventListener('change', aplicarFiltros);
  
  // Menu flutuante do usuário
  const userBadge = document.getElementById('userBadge');
  const userMenu = document.getElementById('userMenu');
  if (userBadge && userMenu) {
    userBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => {
      userMenu.style.display = 'none';
    });
  }
});

function aplicarRestricoesAluno(){
  try{
    const raw = localStorage.getItem('usuario_atual');
    const user = raw ? JSON.parse(raw) : null;
    if (user && (user.tipoususario || '').toLowerCase() === 'aluno'){
      const addBtn = document.querySelector('.add-button button');
      if (addBtn) addBtn.style.display = 'none';
    }
  }catch(e){}
}

function aplicarFiltros() {
  const tbody = document.getElementById('coelhoTableBody');
  const busca = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const tipo = document.getElementById('typeFilter')?.value || 'Matriz';
  const status = (document.getElementById('statusFilter')?.value || '').toLowerCase();
  tbody.innerHTML = '';

  todosOsCoelhos.forEach(coelho => {
    const tipoOk = normalizeStr(coelho.tipo_coelho) === normalizeStr(tipo);
    const situacao = (coelho.situacao_coelho || coelho.situacao || '').toLowerCase();
    const statusOk = !status || situacao === status;
    const buscaOk = (
      (coelho.nome_coelho || '').toLowerCase().includes(busca) ||
      (coelho.numero_coelho != null && coelho.numero_coelho.toString().includes(busca)) ||
      (coelho.raca_coelho || '').toLowerCase().includes(busca)
    );

    if (tipoOk && statusOk && buscaOk) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${coelho.numero_coelho ?? '-'}</td>
        <td>${coelho.nome_coelho ?? '-'}</td>
        <td>${coelho.raca_coelho ?? '-'}</td>
        <td>${coelho.matriz_coelho || '-'}</td>
        <td>${coelho.reprodutor_coelho || '-'}</td>
      `;
      selecionarcoelho(tr, coelho.id_coelho);
      tbody.appendChild(tr);
    }
  });
}

function selecionarcoelho(tr, idCoelho) {
  tr.style.cursor = 'pointer';
  tr.addEventListener('click', () => {
    window.location.href = `ficha.html?id=${idCoelho}`;
  });
}

function carregarNomeUsuario() {
  try {
    const raw = localStorage.getItem('usuario_atual');
    const user = raw ? JSON.parse(raw) : null;
    const userName = document.getElementById('userName');
    if (userName && user) {
      userName.textContent = user.nome_usuario || user.email || 'Usuário';
    }
  } catch(e) {}
}
