const apiurl = "https://gerenciamento-coelho.onrender.com";

function initMatrizesPage() {
  aplicarRestricoesAluno();
  const params = new URLSearchParams(window.location.search);
  const coelhoId = params.get('coelho_id') || params.get('id') || null; // prefer explicit coelho_id
  const fetchUrl = apiurl + '/matriz' + (coelhoId ? `?coelho_id=${coelhoId}` : '');
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
  document.addEventListener('DOMContentLoaded', initMatrizesPage);
} else {
  initMatrizesPage();
}

function preencherTabela(matrizes) {
  const tbody = document.getElementById('matrizTableBody');
  tbody.innerHTML = ''; 

  matrizes.forEach(matriz => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${matriz.data_parto ? new Date(matriz.data_parto).toLocaleDateString('pt-BR') : '-'}</td>
  <td>${matriz.laparos ?? '-'}</td>
  <td>${matriz.laparos_mortos ?? '-'}</td>
  <td>${matriz.laparos_transferidos ?? '-'}</td>
  <td>${matriz.peso_total_ninhada ?? '-'}</td>
  <td>${matriz.peso_total_pos_ninhada ?? '-'}</td>
  <td>${matriz.numero_reprodutor ?? '-'}</td>
    `;
    // Construir URL com ambos os IDs: o da matriz (id_matriz) e o do coelho pai (coelho_id)
    const params = new URLSearchParams(window.location.search);
    const coelhoId = params.get('coelho_id') || params.get('id') || null;
    // Construir URL base com id da matriz
    let url = `ficha_matriz.html?id_matriz=${matriz.id_matriz}`;
    // Adicionar coelho_id se existir
    if (coelhoId) {
      url += `&coelho_id=${coelhoId}`;
    }
    selecionarLinha(tr, url);
    tbody.appendChild(tr);
  });
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
      const target = 'adicionar_matriz.html' + (coelhoId ? `?coelho_id=${coelhoId}` : '');
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


