const apiurl = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const id = params.get('id_matriz') || params.get('id'); // aceita ambos id_matriz ou id
const coelhoId = params.get('coelho_id') || null;

if (!id) {
  alert('ID da matriz não fornecido.');
  window.history.back();
}

window.onload = async () => {
  aplicarRestricoesAluno();
  try {
    const res = await fetch(`${apiurl}/matriz/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar matriz: ' + res.status);
    const data = await res.json();
    const matriz = Array.isArray(data) ? data[0] : data;

    document.getElementById('data_parto').value = matriz.data_parto ? matriz.data_parto.slice(0,10) : '';
    document.getElementById('data_cobertura').value = matriz.data_cobertura ? matriz.data_cobertura.slice(0,10) : '';
    document.getElementById('data_palpação').value = matriz.data_palpação ? matriz.data_palpação.slice(0,10) : '';
  document.getElementById('palpação_resultado').value = matriz.palpação_resultado ?? '';
  document.getElementById('ninho').value = matriz.ninho ?? '';
  document.getElementById('laparos').value = matriz.laparos ?? '';
  document.getElementById('laparos_mortos').value = matriz.laparos_mortos ?? '';
  document.getElementById('laparos_transferidos').value = matriz.laparos_transferidos ?? '';
  document.getElementById('peso_total_ninhada').value = matriz.peso_total_ninhada ?? '';
  document.getElementById('peso_total_pos_ninhada').value = matriz.peso_total_pos_ninhada || '';
    document.getElementById('data_desmame').value = matriz.data_desmame ? matriz.data_desmame.slice(0,10) : '';
  document.getElementById('total_desmame').value = matriz.total_desmame ?? '';
  document.getElementById('numero_reprodutor').value = matriz.numero_reprodutor ?? '';

  } catch (err) {
    alert('Erro ao carregar dados.');
  }
};

function aplicarRestricoesAluno(){
  try{
    const raw = localStorage.getItem('usuario_atual');
    const user = raw ? JSON.parse(raw) : null;
    if (user && (user.tipoususario || '').toLowerCase() === 'aluno'){
      const buttons = document.querySelector('.buttons');
      if (buttons){
        const btns = buttons.querySelectorAll('button');
        btns.forEach(btn => {
          if (btn.textContent && (btn.textContent.includes('Editar') || btn.textContent.includes('Excluir'))){
            btn.style.display = 'none';
          }
        });
      }
    }
  }catch(e){}
}

function editar(){
  window.location.href = `adicionar_matriz.html?id=${id}${coelhoId ? `&coelho_id=${coelhoId}` : ''}`;
}

async function excluir() {
  if (!confirm('Confirmar exclusão?')) return;

  // Usar o id que já foi validado no início do arquivo
  // em vez de pegar novamente dos parâmetros
  if (!id) {
    alert('ID da matriz não encontrado.');
    return;
  }

  try {
    const url = `${apiurl}/matriz/${encodeURIComponent(id)}`;
    
    const res = await fetch(url, { 
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Tentar ler o corpo da resposta para mais detalhes
    let errorDetail = '';
    try {
      const text = await res.text();
      if (text) errorDetail = ': ' + text;
    } catch(e) {}
    
    
    
    if (res.ok) {
      alert('Registro de matriz excluído com sucesso.');
      window.location.href = `index_matriz.html${coelhoId ? `?coelho_id=${coelhoId}` : ''}`;
    } else {
      alert(`Erro ao excluir matriz (status ${res.status})${errorDetail}`);
    }
  } catch (err) {
    alert('Erro ao conectar com servidor: ' + (err.message || err));
  }
}

function voltar(){
  if (coelhoId) window.location.href = `index_matriz.html?coelho_id=${coelhoId}`;
  else window.history.back();
}
