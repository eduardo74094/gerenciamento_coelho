const apiurl = '';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
let coelhoId = params.get('coelho_id');

window.onload = async () => {
  if (id) {
    
    try{
      const res = await fetch(`${apiurl}/matriz/${id}`);
      const data = await res.json();
      const matriz = Array.isArray(data)? data[0] : data;
      
      if (!coelhoId && matriz && matriz.id_coelho) coelhoId = matriz.id_coelho;
  
  const btnVoltar = document.getElementById('btnVoltar');
  if (btnVoltar) btnVoltar.textContent = 'Cancelar';
      
      document.getElementById('data_parto').value = matriz.data_parto ? matriz.data_parto.slice(0,10) : '';
      document.getElementById('data_cobertura').value = matriz.data_cobertura ? matriz.data_cobertura.slice(0,10) : '';
      document.getElementById('data_palpação').value = matriz.data_palpação ? matriz.data_palpação.slice(0,10) : '';
      document.getElementById('palpação_resultado').value = matriz.palpação_resultado || '';
      document.getElementById('data_ninho').value = matriz.data_ninho ? matriz.data_ninho.slice(0,10) : '';
      document.getElementById('laparos').value = matriz.laparos || '';
      document.getElementById('laparos_mortos').value = matriz.laparos_mortos || '';
      document.getElementById('laparos_transferidos').value = matriz.laparos_transferidos || '';
      document.getElementById('peso_total_ninhada').value = matriz.peso_total_ninhada || '';
      document.getElementById('peso_total_pos_ninhada').value = matriz.peso_total_pos_ninhada || '';
      document.getElementById('data_desmame').value = matriz.data_desmame ? matriz.data_desmame.slice(0,10) : '';
      document.getElementById('total_desmame').value = matriz.total_desmame || '';
      document.getElementById('numero_reprodutor').value = matriz.numero_reprodutor || '';
  }catch(err){}
  }
}

async function salvar(){
  const payload = {
    id_coelho: coelhoId ? parseInt(coelhoId) : (document.getElementById('id_coelho') ? parseInt(document.getElementById('id_coelho').value) || undefined : undefined),
    data_parto: document.getElementById('data_parto').value,
    data_cobertura: document.getElementById('data_cobertura').value || null,
    data_palpação: document.getElementById('data_palpação').value || null,
    palpação_resultado: document.getElementById('palpação_resultado').value || null,
      data_ninho: document.getElementById('data_ninho').value || null,
  laparos: (Number.isNaN(parseInt(document.getElementById('laparos').value)) ? null : parseInt(document.getElementById('laparos').value)),
  laparos_mortos: (Number.isNaN(parseInt(document.getElementById('laparos_mortos').value)) ? null : parseInt(document.getElementById('laparos_mortos').value)),
  laparos_transferidos: (Number.isNaN(parseInt(document.getElementById('laparos_transferidos').value)) ? null : parseInt(document.getElementById('laparos_transferidos').value)),
  peso_total_ninhada: (Number.isNaN(parseFloat(document.getElementById('peso_total_ninhada').value)) ? null : parseFloat(document.getElementById('peso_total_ninhada').value)),
  peso_total_pos_ninhada: (Number.isNaN(parseFloat(document.getElementById('peso_total_pos_ninhada').value)) ? null : parseFloat(document.getElementById('peso_total_pos_ninhada').value)),
    data_desmame: document.getElementById('data_desmame').value || null,
  total_desmame: (Number.isNaN(parseInt(document.getElementById('total_desmame').value)) ? null : parseInt(document.getElementById('total_desmame').value)),
  numero_reprodutor: (Number.isNaN(parseInt(document.getElementById('numero_reprodutor').value)) ? null : parseInt(document.getElementById('numero_reprodutor').value))
  };

  try{
    const targetCoelho = payload.id_coelho || (coelhoId ? parseInt(coelhoId, 10) : null);
    
    
    if (id) {
      if (!confirm('Tem certeza que deseja salvar as alterações desta matriz?')) return;
      const res = await fetch(`${apiurl}/matriz/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (res.ok) {
        alert('Matriz atualizada com sucesso!');
        window.location.href = `index_matriz.html${targetCoelho ? `?coelho_id=${targetCoelho}` : ''}`;
      }
      else {
        const errorText = await res.text();
        alert('Erro ao atualizar: ' + errorText);
      }
    } else {
      const res = await fetch(`${apiurl}/matriz`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (res.ok) {
        alert('Matriz criada com sucesso!');
        window.location.href = `index_matriz.html${targetCoelho ? `?coelho_id=${targetCoelho}` : ''}`;
      }
      else {
        const errorText = await res.text();
        alert('Erro ao adicionar: ' + errorText);
      }
    }
  }catch(err){
    alert('Erro de conexão: ' + err.message);
  }
}

function voltar(){
  if (id) {
    if (!confirm('Deseja sair? Suas alterações não serão salvas.')) return;
  }
  if (coelhoId) window.location.href = `index_matriz.html?coelho_id=${coelhoId}`;
  else window.history.back();
}
