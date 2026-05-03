const apiurl = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@gmail.com';
const isAdminEmail = (e) => (e || '').toLowerCase() === ADMIN_EMAIL;
let usuarios = [];
let editingUser = null; // armazena usuário em edição ou null para novo

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addUserBtn');
  if (addBtn) addBtn.addEventListener('click', () => openUserForm());
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', async () => {
    try { await fetch(apiurl + '/logout', { method: 'POST' }); } catch (e) {}
    window.location.href = '/front_end/html/login.html';
  });
  // wiring modal eventos
  setupModals();
  carregarUsuarios();

  // (sem busca nesta tela)
});

function setupModals() {
  const modal = document.getElementById('userFormModal');
  const saveBtn = document.getElementById('saveUserForm');
  const cancelBtn = document.getElementById('cancelUserForm');
  const deleteBtn = document.getElementById('deleteUserBtn');
  if (saveBtn) saveBtn.addEventListener('click', salvarUsuarioViaForm);
  if (cancelBtn) cancelBtn.addEventListener('click', closeUserForm);
  if (deleteBtn) deleteBtn.addEventListener('click', async () => {
    if (!editingUser) return;
    await excluirUsuario(editingUser);
    closeUserForm();
  });

  // fechar ao clicar fora
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeUserForm();
    });
  }

  // confirm modal
  const cModal = document.getElementById('confirmModal');
  const cYes = document.getElementById('confirmYes');
  const cNo = document.getElementById('confirmNo');
  if (cNo) cNo.addEventListener('click', () => hideConfirm(false));
  if (cYes) cYes.addEventListener('click', () => hideConfirm(true));
}

async function carregarUsuarios() {
  try {
    const res = await fetch(apiurl + '/usuarios');
    if (!res.ok) throw new Error('Falha ao carregar usuários');
    usuarios = await res.json();
    renderUsuarios();
  } catch (e) {
    showMessage('Erro ao carregar usuários.', 'error');
  }
}

function renderUsuarios() {
  const tbody = document.getElementById('userTable');
  if (!tbody) return;

  const lista = usuarios;

  tbody.innerHTML = '';
  lista.forEach((u) => {
    const tr = document.createElement('tr');
    const isAdmin = isAdminEmail(u.email);

    const tdId = document.createElement('td');
    tdId.textContent = u.id_usuario;

    const tdNome = document.createElement('td');
    tdNome.textContent = (u.nome_usuario || '-') + (isAdmin ? ' (admin)' : '');

    const tdEmail = document.createElement('td');
    tdEmail.textContent = u.email || '-';
    
    // Row click abre edição (desabilitar para admin)
    tr.style.cursor = isAdmin ? 'default' : 'pointer';
    if (!isAdmin) {
      tr.addEventListener('click', () => openUserForm(u));
    }

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdEmail);

    tbody.appendChild(tr);
  });
}

function openUserForm(user = null) {
  // Não permitir abrir form de edição para admin
  if (user && isAdminEmail(user.email)) {
    showMessage('Usuário admin não pode ser editado/excluído.', 'info');
    return;
  }
  editingUser = user ? { ...user } : null;
  const modal = document.getElementById('userFormModal');
  const title = document.getElementById('userFormTitle');
  const nome = document.getElementById('nome_usuario');
  const email = document.getElementById('email_usuario');
  const tipo = document.getElementById('tipo_usuario');
  const senha = document.getElementById('senha_usuario');

  title.textContent = user ? 'Editar Usuário' : 'Novo Usuário';
  nome.value = user?.nome_usuario || '';
  email.value = user?.email || '';
  if (tipo) tipo.value = (user?.tipoususario || '');
  senha.value = '';

  if (modal) modal.style.display = 'flex';
  // Mostrar/esconder botão excluir conforme modo (e esconder para admin)
  const delBtn = document.getElementById('deleteUserBtn');
  if (delBtn) delBtn.style.display = user && !isAdminEmail(user.email) ? 'inline-block' : 'none';
}

function closeUserForm() {
  const modal = document.getElementById('userFormModal');
  if (modal) modal.style.display = 'none';
  editingUser = null;
}

function showMessage(text, type = 'info') {
  const area = document.getElementById('messageArea');
  if (!area) return;
  area.className = `message ${type}`;
  area.textContent = text;
  area.style.display = 'block';
  // auto-hide after a while for info/success
  if (type === 'success' || type === 'info') {
    setTimeout(() => { if (area.className.includes(type)) area.style.display = 'none'; }, 3000);
  }
}

let confirmResolver = null;
function showConfirm(message) {
  const modal = document.getElementById('confirmModal');
  const msg = document.getElementById('confirmMessage');
  if (msg) msg.textContent = message || 'Tem certeza?';
  if (modal) modal.style.display = 'flex';
  return new Promise((resolve) => { confirmResolver = resolve; });
}
function hideConfirm(result) {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.style.display = 'none';
  if (confirmResolver) { confirmResolver(result); confirmResolver = null; }
}

async function salvarUsuarioViaForm() {
  const nome = document.getElementById('nome_usuario').value.trim();
  const email = document.getElementById('email_usuario').value.trim();
  const tipo = (document.getElementById('tipo_usuario')?.value || '').trim();
  const senha = document.getElementById('senha_usuario').value;
  const emailLower = (email || '').toLowerCase();

  if (!nome || !email || (!editingUser && !senha)) {
    showMessage('Preencha todos os campos obrigatórios.', 'error');
    return;
  }
  if (senha && senha.length < 8) {
    showMessage('Senha deve ter no mínimo 8 caracteres.', 'error');
    return;
  }

  try {
    if (!editingUser) {
      if (emailLower === ADMIN_EMAIL) {
        showMessage('Criação do usuário admin é bloqueada.', 'error');
        return;
      }
      // criar novo
      const res = await fetch(apiurl + '/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_usuario: nome, email, senha, tipoususario: tipo || null })
      });
      if (res.ok) {
        closeUserForm();
        showMessage('Usuário criado com sucesso!', 'success');
        await carregarUsuarios();
      } else {
        if (res.status === 409) {
          showMessage('Email já cadastrado.', 'error');
        } else {
          const txt = await res.text();
          showMessage('Erro ao criar usuário: ' + txt, 'error');
        }
      }
    } else {
      if (isAdminEmail(editingUser.email)) {
        showMessage('Usuário admin não pode ser editado.', 'error');
        return;
      }
      // editar existente: primeiro patch nome/email
      const needPatch = nome !== (editingUser.nome_usuario || '') || email !== (editingUser.email || '') || tipo !== (editingUser.tipoususario || '');
      if (needPatch && emailLower === ADMIN_EMAIL) {
        showMessage('Não é permitido alterar email para o do admin.', 'error');
        return;
      }
      if (needPatch) {
        const resPatch = await fetch(`${apiurl}/usuario/${editingUser.id_usuario}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome_usuario: nome, email, senha: editingUser.senha, tipoususario: tipo || null })
        });
        if (!resPatch.ok) {
          const t = await resPatch.text();
          showMessage('Erro ao atualizar usuário: ' + t, 'error');
          return;
        }
      }
      // senha opcional
      if (senha) {
        if (emailLower === ADMIN_EMAIL) {
          showMessage('Não é permitido alterar a senha do admin.', 'error');
          return;
        }
        const resSenha = await fetch(apiurl + '/alterarSenha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });
        if (!resSenha.ok) {
          const t = await resSenha.text();
          showMessage('Erro ao alterar senha: ' + t, 'error');
          return;
        }
      }

      closeUserForm();
      showMessage('Usuário atualizado com sucesso!', 'success');
      await carregarUsuarios();
    }
  } catch (e) {
    showMessage('Erro na requisição.', 'error');
  }
}

async function excluirUsuario(u) {
  if (isAdminEmail(u.email)) {
    showMessage('Usuário admin não pode ser excluído.', 'error');
    return;
  }
  const ok = await showConfirm(`Deseja excluir o usuário "${u.nome_usuario || u.email}"?`);
  if (!ok) return;
  try {
    const res = await fetch(`${apiurl}/usuario/${u.id_usuario}`, { method: 'DELETE' });
    if (res.ok) {
      showMessage('Usuário excluído com sucesso!', 'success');
      await carregarUsuarios();
    } else {
      const t = await res.text();
      showMessage('Erro ao excluir: ' + t, 'error');
    }
  } catch (e) {
    showMessage('Erro na requisição.', 'error');
  }
}
